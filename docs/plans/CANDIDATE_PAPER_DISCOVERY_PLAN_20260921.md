# Candidate Paper Discovery — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/candidate-discovery`

## 1. Goal

Add a conservative scheduled discovery assistant for recent echocardiography-AI papers.

The feature generates a **candidate review list only**. It must never add a paper to the public catalog, assign a final code status, or make an editorial inclusion decision automatically.

## 2. Target publication sources

Prioritize recent work from:

- CVPR
- ICCV
- ECCV
- MICCAI
- IEEE Transactions on Medical Imaging (TMI)
- Medical Image Analysis (MedIA)

Discovery uses public bibliographic metadata without external secrets.

## 3. Discovery policy

### Positive evidence

A candidate needs both:

1. a target venue/journal match; and
2. echocardiography evidence in searchable metadata, such as:
   - echocardiography / echocardiographic
   - echocardiogram
   - cardiac ultrasound

### Conservative recall

The automation is intentionally not exhaustive. A generic method paper that uses echocardiography only inside the full text may be missed.

That is acceptable because:

- manual literature review remains authoritative;
- the discovery assistant exists to surface plausible candidates, not replace Scholar/PubMed/conference browsing;
- false positives should be minimized before a candidate reaches the audit queue.

## 4. Deduplication

Exclude titles already present in:

- canonical `src/papers.ts`;
- `docs/PAPER_CODE_AUDIT.md`.

Normalize title case, whitespace, punctuation, and Unicode before comparison.

## 5. Data source and network contract

Use public OpenAlex search for candidate discovery, then use Crossref DOI metadata only to enrich venue information when OpenAlex exposes a generic proceedings/book-series source. Both are accessed with Python stdlib only.

Requirements:

- descriptive User-Agent;
- bounded number of task-oriented OpenAlex queries;
- bounded results per query;
- bounded Crossref DOI enrichments;
- explicit date lookback;
- timeouts/retries;
- deterministic deduplication;
- no API secret.

OpenAlex queries combine echocardiography with research-task terms such as video segmentation, representation learning, EF/deep learning, foundation models, domain generalization, generation, and echocardiogram/deep learning. Conference workshops are explicitly excluded from CVPR/ICCV/ECCV main-venue matches.

## 6. Output

Generate a Markdown candidate report with:

- title;
- venue;
- publication date/year;
- DOI or authoritative metadata URL;
- matched discovery term;
- reason it passed the venue/relevance filter;
- explicit note that code status and editorial inclusion are **not yet verified**.

## 7. GitHub workflow

Add `.github/workflows/candidate-paper-discovery.yml`:

- weekly schedule;
- manual dispatch;
- `contents: read`;
- `issues: write`;
- no external secrets.

Behavior:

1. run discovery script;
2. append report to Actions summary;
3. if new candidates exist:
   - create one open issue titled **Candidate paper review** if absent;
   - otherwise update that existing issue;
4. if no candidates exist:
   - do not create an issue;
5. never edit `src/papers.ts`.

## 8. Human review contract

The candidate issue must tell maintainers to run the existing protocol before publication:

1. confirm paper identity and venue;
2. determine whether the paper is directly relevant enough for this curated index;
3. distinguish project/page repo, real implementation repo, dataset repo, and unofficial reproductions;
4. inspect actual code contents;
5. record findings in the audit/decision trail;
6. only then open a separate content PR.

## 9. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open PR with this plan as first commit.

### B. Discovery script
- [x] Add stdlib-only OpenAlex discovery + bounded Crossref venue-enrichment script.
- [x] Query task-oriented echocardiography search combinations through OpenAlex.
- [x] Restrict to target venues/journals.
- [x] Apply explicit recent-date lookback.
- [x] Normalize and deduplicate titles.
- [x] Exclude canonical public papers.
- [x] Exclude already-audited candidate papers.
- [x] Emit Markdown candidate report.
- [x] Include DOI/URL and venue evidence.
- [x] State clearly that code/editorial status is unverified.
- [x] Never edit `src/papers.ts`.

### C. Workflow
- [x] Add weekly schedule.
- [x] Add manual dispatch.
- [x] Use minimal contents/issues permissions.
- [x] Use no external secret.
- [x] Publish report to Actions summary.
- [x] Create/update one **Candidate paper review** issue only when candidates exist.
- [x] Do nothing to issues when candidate count is zero.

### D. Validation
- [ ] Script runs locally against real OpenAlex discovery with Crossref venue enrichment.
- [x] Current public 10 papers are excluded.
- [x] Existing entries in `PAPER_CODE_AUDIT.md` are excluded.
- [x] Every emitted candidate matches a target venue.
- [x] Every emitted candidate has echocardiography metadata evidence.
- [x] Local run leaves tracked files unchanged.
- [x] Workflow YAML parses.
- [x] `npm run build` remains green.
- [x] Reference Metrics v1.1 remains unaffected.

### E. Delivery
- [x] Push implementation to feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics CI remains green.
- [ ] Vercel Preview passes.
- [ ] Squash-merge only on clean exact head.
- [ ] Manually dispatch discovery on main.
- [ ] Verify candidate issue/no-issue behavior.
- [ ] Production deployment remains green.
- [ ] Close checklist with delivery evidence.

## 10. Delivery standard

Complete only when:

1. candidate discovery never mutates the public paper catalog;
2. emitted records have venue + echocardiography evidence;
3. known public/audited papers are deduplicated;
4. no external API secret is required;
5. issue behavior is non-spammy;
6. manual editorial and code verification remains mandatory.

## 11. Rollback conditions

Do not merge if:

- the workflow can edit `src/papers.ts`;
- results are not venue-filtered;
- known papers repeatedly reappear;
- an issue is created when there are zero candidates;
- the workflow needs broad permissions or third-party secrets;
- metrics CI regresses.
