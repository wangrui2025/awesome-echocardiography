#!/usr/bin/env python3
"""Conservative recent-paper discovery for Awesome Echocardiography.

OpenAlex is used for discovery because it searches title/abstract-like metadata well.
Crossref is used only to enrich venue metadata when OpenAlex records a generic
proceedings/book-series source. The script never edits src/papers.ts.
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path

USER_AGENT = "awesome-echocardiography-candidate-discovery/1.1"
OPENALEX_API = "https://api.openalex.org/works"
CROSSREF_WORK = "https://api.crossref.org/works/{doi}"
DEFAULT_LOOKBACK_DAYS = 550
MAX_RESULTS_PER_QUERY = 50
MAX_CROSSREF_ENRICHMENTS = 40

SEARCH_QUERIES = (
    "echocardiography video segmentation",
    "echocardiography artificial intelligence",
    "echocardiography representation learning",
    "echocardiography ejection fraction deep learning",
    "echocardiography foundation model",
    "echocardiography domain generalization",
    "echocardiography generation",
    "echocardiogram deep learning",
)

TARGET_VENUES = {
    "CVPR": (
        "computer vision and pattern recognition",
        "(cvpr)",
        " cvpr ",
    ),
    "ICCV": (
        "international conference on computer vision",
        "(iccv)",
        " iccv ",
    ),
    "ECCV": (
        "european conference on computer vision",
        "eccv",
        "computer vision – eccv",
        "computer vision - eccv",
    ),
    "MICCAI": (
        "medical image computing and computer assisted intervention",
        "medical image computing and computer-assisted intervention",
        "miccai",
    ),
    "TMI": (
        "ieee transactions on medical imaging",
        "transactions on medical imaging",
    ),
    "MedIA": (
        "medical image analysis",
    ),
}

ECHO_TERMS = (
    "echocardiograph",
    "echocardiogram",
    "cardiac ultrasound",
)


@dataclass(frozen=True)
class Candidate:
    title: str
    venue_key: str
    venue_raw: str
    publication_date: str
    doi: str | None
    url: str
    matched_query: str
    evidence: str
    openalex_id: str


def normalize_title(text: str) -> str:
    text = unicodedata.normalize("NFKC", text).casefold()
    text = re.sub(r"[^\w]+", " ", text, flags=re.UNICODE)
    return " ".join(text.split())


def existing_titles() -> set[str]:
    titles: set[str] = set()

    papers_path = Path("src/papers.ts")
    if papers_path.exists():
        for match in re.finditer(
            r"^    title: '([^']+)',?$",
            papers_path.read_text(encoding="utf-8"),
            flags=re.M,
        ):
            titles.add(normalize_title(match.group(1)))

    audit_path = Path("docs/PAPER_CODE_AUDIT.md")
    if audit_path.exists():
        for line in audit_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("### "):
                heading = line[4:].strip()
                title = re.split(
                    r"\s+[—-]\s+(?:CVPR|ICCV|ECCV|MICCAI|TMI|MedIA)\b",
                    heading,
                    maxsplit=1,
                )[0]
                titles.add(normalize_title(title))

    return titles


def abstract_text(work: dict) -> str:
    inverted = work.get("abstract_inverted_index") or {}
    if not inverted:
        return ""
    tokens: list[tuple[int, str]] = []
    for word, positions in inverted.items():
        for pos in positions:
            tokens.append((int(pos), word))
    return " ".join(word for _, word in sorted(tokens))


def openalex_source_text(work: dict) -> str:
    parts: list[str] = []
    locations = []
    primary = work.get("primary_location")
    if isinstance(primary, dict):
        locations.append(primary)
    locations.extend(x for x in (work.get("locations") or []) if isinstance(x, dict))

    for location in locations:
        raw = location.get("raw_source_name")
        if raw:
            parts.append(str(raw))
        source = location.get("source") or {}
        if isinstance(source, dict) and source.get("display_name"):
            parts.append(str(source["display_name"]))
    return " | ".join(dict.fromkeys(parts))


def venue_match(text: str) -> tuple[str, str] | None:
    haystack = f" {text.casefold()} "
    if re.search(r"\b(?:workshop|workshops|cvprw|iccvw|eccvw)\b", haystack):
        return None
    for key, aliases in TARGET_VENUES.items():
        if any(alias.casefold() in haystack for alias in aliases):
            return key, text
    return None


def echo_evidence(work: dict) -> tuple[bool, str]:
    title = str(work.get("title") or "")
    abstract = abstract_text(work)
    keywords = " ".join(
        str(item.get("display_name") or "")
        for item in (work.get("keywords") or [])
        if isinstance(item, dict)
    )
    blob = f"{title} {abstract} {keywords}".casefold()
    matched = [term for term in ECHO_TERMS if term in blob]
    if not matched:
        return False, ""

    where: list[str] = []
    title_lower = title.casefold()
    abstract_lower = abstract.casefold()
    for term in matched:
        if term in title_lower:
            where.append(f"title:{term}")
        elif term in abstract_lower:
            where.append(f"abstract:{term}")
        else:
            where.append(f"metadata:{term}")
    return True, ", ".join(where)


def request_json(url: str, attempts: int = 3) -> dict:
    req = urllib.request.Request(
        url,
        headers={"Accept": "application/json", "User-Agent": USER_AGENT},
    )
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                return json.load(response)
        except urllib.error.HTTPError as exc:
            if exc.code in (429, 500, 502, 503, 504) and attempt + 1 < attempts:
                delay = int(exc.headers.get("Retry-After", "2"))
                time.sleep(min(max(delay, 1), 10))
                continue
            raise
        except urllib.error.URLError:
            if attempt + 1 < attempts:
                time.sleep(2)
                continue
            raise
    raise RuntimeError("metadata request failed after retries")


def openalex_search(query: str, start: dt.date, end: dt.date) -> list[dict]:
    params = {
        "search": query,
        "filter": f"from_publication_date:{start.isoformat()},to_publication_date:{end.isoformat()}",
        "per-page": str(MAX_RESULTS_PER_QUERY),
    }
    url = f"{OPENALEX_API}?{urllib.parse.urlencode(params)}"
    return request_json(url).get("results", [])


def doi_value(work: dict) -> str | None:
    doi = work.get("doi")
    if not doi:
        return None
    value = str(doi)
    prefix = "https://doi.org/"
    return value[len(prefix):] if value.casefold().startswith(prefix) else value


def crossref_source_text(doi: str) -> str:
    encoded = urllib.parse.quote(doi, safe="")
    data = request_json(CROSSREF_WORK.format(doi=encoded)).get("message", {})
    parts: list[str] = []
    for key in ("container-title", "short-container-title"):
        value = data.get(key) or []
        if isinstance(value, str):
            parts.append(value)
        else:
            parts.extend(str(x) for x in value if x)
    event = data.get("event") or {}
    if isinstance(event, dict):
        for key in ("name", "acronym"):
            if event.get(key):
                parts.append(str(event[key]))
    return " | ".join(dict.fromkeys(parts))


def discover(lookback_days: int) -> tuple[list[Candidate], list[dict]]:
    end = dt.datetime.now(dt.timezone.utc).date()
    start = end - dt.timedelta(days=lookback_days)
    known = existing_titles()

    seen_works: dict[str, tuple[dict, str, str]] = {}
    diagnostics: list[dict] = []

    for query in SEARCH_QUERIES:
        results = openalex_search(query, start, end)
        diagnostics.append({"query": query, "returned": len(results)})
        for work in results:
            title = str(work.get("title") or "").strip()
            if not title:
                continue
            relevant, evidence = echo_evidence(work)
            if not relevant:
                continue
            key = normalize_title(title)
            if key in known:
                continue
            prior = seen_works.get(key)
            if prior is None:
                seen_works[key] = (work, query, evidence)

    candidates: list[Candidate] = []
    enrichments = 0

    for key in sorted(seen_works):
        work, query, evidence = seen_works[key]
        source_text = openalex_source_text(work)
        doi = doi_value(work)
        workshop_blob = f"{source_text} {doi or ''}".casefold()
        if re.search(r"\b(?:workshop|workshops|cvprw|iccvw|eccvw)\b", workshop_blob):
            continue
        venue = venue_match(source_text)


        if venue is None and doi and enrichments < MAX_CROSSREF_ENRICHMENTS:
            enrichments += 1
            try:
                enriched = crossref_source_text(doi)
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
                enriched = ""
            if enriched:
                venue = venue_match(enriched)
                if venue:
                    source_text = enriched

        if venue is None:
            continue

        title = str(work.get("title") or "").strip()
        publication_date = str(work.get("publication_date") or "unknown")
        openalex_id = str(work.get("id") or "")
        primary = work.get("primary_location") or {}
        landing = primary.get("landing_page_url") if isinstance(primary, dict) else None
        url = f"https://doi.org/{doi}" if doi else str(landing or openalex_id)

        candidates.append(
            Candidate(
                title=title,
                venue_key=venue[0],
                venue_raw=source_text or venue[0],
                publication_date=publication_date,
                doi=doi,
                url=url,
                matched_query=query,
                evidence=evidence,
                openalex_id=openalex_id,
            )
        )

    candidates.sort(
        key=lambda c: (c.publication_date, c.venue_key, c.title.casefold()),
        reverse=True,
    )
    return candidates, diagnostics


def render_report(candidates: list[Candidate], diagnostics: list[dict], lookback_days: int) -> str:
    now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Candidate paper review",
        "",
        f"Discovery run: **{now}** · lookback: **{lookback_days} days**",
        "",
        "> These are discovery candidates only. They are not accepted papers and their code status is not verified.",
        "> Before publication, run the repository-source audit protocol and make an explicit editorial decision.",
        "",
        f"**New candidates after public/audit deduplication:** {len(candidates)}",
        "",
    ]

    if not candidates:
        lines.extend(["No new candidates matched the conservative venue + echocardiography metadata filter.", ""])
    else:
        for index, item in enumerate(candidates, 1):
            lines.extend(
                [
                    f"## {index}. {item.title}",
                    "",
                    f"- Target venue: **{item.venue_key}**",
                    f"- Source metadata venue: {item.venue_raw}",
                    f"- Publication date: {item.publication_date}",
                    f"- DOI / metadata URL: {item.url or 'not provided'}",
                    f"- OpenAlex record: {item.openalex_id or 'not provided'}",
                    f"- Discovery query: `{item.matched_query}`",
                    f"- Echocardiography evidence: {item.evidence}",
                    "- Code status: **not verified**",
                    "- Editorial status: **candidate only — human review required**",
                    "",
                ]
            )

    lines.extend(["## Query diagnostics", ""])
    for item in diagnostics:
        lines.append(f"- `{item['query']}`: {item['returned']} OpenAlex records inspected")
    lines.append("")
    lines.extend(
        [
            "## Required human review",
            "",
            "1. Confirm the paper identity, venue, and direct echocardiography relevance.",
            "2. Search the authors' and lab's repositories for the real implementation repository.",
            "3. Distinguish project/page repo, implementation repo, dataset repo, and unofficial reproductions.",
            "4. Inspect actual runnable code before assigning a code-status label.",
            "5. Record the audit/editorial decision before opening a separate catalog PR.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lookback-days", type=int, default=DEFAULT_LOOKBACK_DAYS)
    parser.add_argument("--output", default="candidate-paper-report.md")
    args = parser.parse_args()

    if args.lookback_days < 1 or args.lookback_days > 2000:
        raise SystemExit("--lookback-days must be between 1 and 2000")

    candidates, diagnostics = discover(args.lookback_days)
    Path(args.output).write_text(
        render_report(candidates, diagnostics, args.lookback_days),
        encoding="utf-8",
    )
    print(f"CANDIDATE_COUNT={len(candidates)}")
    print(f"QUERY_COUNT={len(diagnostics)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
