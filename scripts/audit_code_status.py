#!/usr/bin/env python3
"""Conservative audit of paper implementation repositories.

This script reports conditions that require human review. It never edits src/papers.ts.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path

PAPERS_FILE = Path("src/papers.ts")
STALE_DAYS = 90
USER_AGENT = "awesome-echocardiography-code-status-watch/1.0"

@dataclass
class Paper:
    title: str
    repository_url: str
    code_status: str
    verified_at: str


def parse_papers(path: Path) -> list[Paper]:
    text = path.read_text(encoding="utf-8")
    start = text.index("export const papers")
    end = text.index("];", start)
    section = text[start:end]
    blocks = re.findall(r"\n  \{\n(.*?)\n  \},", section, flags=re.S)
    papers: list[Paper] = []

    def field(block: str, name: str) -> str | None:
        match = re.search(rf"^    {re.escape(name)}: '([^']*)',?$", block, flags=re.M)
        return match.group(1) if match else None

    for block in blocks:
        title = field(block, "title")
        repo = field(block, "repositoryUrl")
        status = field(block, "codeStatus")
        verified = field(block, "codeVerifiedAt")
        if title and repo and status and verified:
            papers.append(Paper(title, repo, status, verified))
    if not papers:
        raise RuntimeError("No paper repository records parsed from src/papers.ts")
    return papers


def github_repo_slug(url: str) -> str | None:
    match = re.fullmatch(r"https://github\.com/([^/]+)/([^/#]+?)(?:\.git)?/?", url)
    if not match:
        return None
    return f"{match.group(1)}/{match.group(2)}"


def api_json(url: str, token: str | None) -> dict:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": USER_AGENT,
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=25) as response:
        return json.load(response)


def implementation_signals(tree: list[dict]) -> tuple[list[str], list[str]]:
    paths = [item.get("path", "") for item in tree if item.get("type") == "blob"]
    ml_files: list[str] = []
    strong_files: list[str] = []
    strong_name = re.compile(
        r"(^|/)(train|training|test|testing|eval|evaluate|evaluation|infer|inference|predict|model|models|network|networks)([_./-]|$)",
        re.I,
    )
    for path in paths:
        lower = path.lower()
        if lower.endswith((".py", ".ipynb")):
            ml_files.append(path)
            if strong_name.search(lower):
                strong_files.append(path)
        elif lower.endswith(".sh") and strong_name.search(lower):
            strong_files.append(path)
    return ml_files, strong_files


def days_since(date_str: str) -> int:
    date = dt.date.fromisoformat(date_str)
    return (dt.datetime.now(dt.timezone.utc).date() - date).days


def audit(papers: list[Paper], token: str | None) -> tuple[list[dict], list[dict]]:
    findings: list[dict] = []
    observations: list[dict] = []
    for paper in papers:
        slug = github_repo_slug(paper.repository_url)
        if not slug:
            observations.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "evidence": "Non-GitHub repository; automated tree audit skipped.",
            })
            continue

        metadata_url = f"https://api.github.com/repos/{slug}"
        try:
            meta = api_json(metadata_url, token)
        except urllib.error.HTTPError as exc:
            if exc.code in (403, 404):
                findings.append({
                    "title": paper.title,
                    "status": paper.code_status,
                    "repo": paper.repository_url,
                    "reason": f"Repository metadata is inaccessible (HTTP {exc.code}).",
                    "action": "Manually verify whether the implementation repository moved, became private, or was removed.",
                })
                continue
            raise

        default_branch = meta.get("default_branch", "main")
        archived = bool(meta.get("archived"))
        disabled = bool(meta.get("disabled"))
        if archived or disabled:
            findings.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "reason": f"Repository is {'archived' if archived else 'disabled'}.",
                "action": "Review whether the catalog note or implementation link should change.",
            })

        tree_url = f"https://api.github.com/repos/{slug}/git/trees/{urllib.parse.quote(default_branch)}?recursive=1"
        try:
            tree_data = api_json(tree_url, token)
            ml_files, strong_files = implementation_signals(tree_data.get("tree", []))
        except urllib.error.HTTPError as exc:
            findings.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "reason": f"Default-branch tree could not be inspected (HTTP {exc.code}).",
                "action": "Inspect the repository manually.",
            })
            continue

        observations.append({
            "title": paper.title,
            "status": paper.code_status,
            "repo": paper.repository_url,
            "evidence": f"{len(ml_files)} Python/notebook files; {len(strong_files)} strong training/evaluation/model signals.",
        })

        if paper.code_status == "announced" and (strong_files or len(ml_files) >= 2):
            sample = ", ".join((strong_files or ml_files)[:5])
            findings.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "reason": f"Possible implementation release detected ({sample}).",
                "action": "Manually inspect runnable training/inference/config/dependency coverage before changing code status.",
            })

        if paper.code_status in {"available", "partial"} and not ml_files and not strong_files:
            findings.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "reason": "No Python/notebook or strong training/evaluation implementation signals remain on the default branch.",
                "action": "Manually verify that the real implementation repository has not moved or disappeared.",
            })

        age = days_since(paper.verified_at)
        if age > STALE_DAYS:
            findings.append({
                "title": paper.title,
                "status": paper.code_status,
                "repo": paper.repository_url,
                "reason": f"Manual code verification is {age} days old (threshold: {STALE_DAYS}).",
                "action": "Re-run the full repository-source verification protocol and update codeVerifiedAt in a reviewed PR.",
            })

    return findings, observations


def render_report(findings: list[dict], observations: list[dict]) -> str:
    now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Code status review",
        "",
        f"Automated evidence check: **{now}**",
        "",
        "> This automation does not decide or modify code status. Every finding requires human repository verification and a reviewed PR.",
        "",
        f"**Review findings:** {len(findings)}",
        "",
    ]
    if findings:
        for item in findings:
            lines.extend([
                f"## {item['title']}",
                "",
                f"- Current status: **{item['status']}**",
                f"- Repository: {item['repo']}",
                f"- Evidence: {item['reason']}",
                f"- Human action: {item['action']}",
                "",
            ])
    else:
        lines.extend(["No review-triggering changes detected.", ""])

    lines.extend(["## Repository observations", ""])
    for item in observations:
        lines.extend([
            f"- **{item['title']}** — {item['status']} — {item['evidence']} — {item['repo']}",
        ])
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="code-status-report.md")
    args = parser.parse_args()

    papers = parse_papers(PAPERS_FILE)
    token = os.environ.get("GITHUB_TOKEN")
    findings, observations = audit(papers, token)
    report = render_report(findings, observations)
    Path(args.output).write_text(report, encoding="utf-8")
    print(f"FINDINGS_COUNT={len(findings)}")
    print(f"AUDITED_REPOSITORIES={len(observations) + sum(1 for x in findings if 'inaccessible' in x.get('reason', ''))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
