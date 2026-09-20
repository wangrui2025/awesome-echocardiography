# Papers Index — Implementation Plan

Date: **2026-09-20**  
Branch: `feature/papers-index`  
Scope owner: Awesome Echocardiography paper-index feature

## 1. Goal

Build a dedicated, bilingual Papers entry point that can grow beyond the three homepage cards without turning the homepage into an exhaustive bibliography.

The feature must preserve the project's curation philosophy:

> Awesome Echocardiography is a manually curated research index, not a dump of every paper.

This PR establishes the **paper-page infrastructure and structured paper schema only**. It does not bulk-add candidate papers.

## 2. Non-goals

This PR will **not**:

- modify the metrics/reference-standard implementation;
- add or edit dataset guide pages;
- add the Research Map;
- add issue/PR submission templates;
- add automated paper discovery;
- bulk-publish the seven audited candidate papers;
- change the Vercel/GitHub Actions deployment architecture;
- redefine the existing code-availability policy.

## 3. Product design

### Routes

- `/papers/` — Chinese default
- `/en/papers/` — English

### Navigation

The shared top navigation will expose:

- Home
- Papers
- Metrics
- language switch

The current route must have an active state.

### Page structure

The Papers page will contain:

1. a concise hero explaining the curation scope;
2. a small summary showing number of public papers and categories;
3. task/category sections;
4. structured paper cards;
5. verified code-status information;
6. an explicit link to the curation/code-verification policy.

### Initial public content

Only the current three public papers are included:

- OSA — CVPR 2026 Highlight
- GDKVM — ICCV 2025
- MemSAM — CVPR 2024 Oral

All three are initially categorized as **Video Segmentation**.

The seven newly audited papers remain in `docs/PAPER_CODE_AUDIT.md` with editorial decision pending.

## 4. Structured paper schema

Create a canonical paper-data module rather than keeping paper records embedded in general site data.

Each public paper record should support:

- stable `id`
- `title`
- `authors`
- `venue`
- `year`
- `category`
- `paperUrl`
- optional `projectUrl`
- optional `repositoryUrl`
- `codeStatus`
- `codeVerifiedAt`
- bilingual code-status notes
- `featured` flag for homepage selection

The homepage and Papers page must read from the **same canonical records**. No duplicated paper lists are allowed.

## 5. Implementation checklist

### A. Planning and isolation

- [x] Detect and preserve the concurrent metrics Agent's uncommitted work.
- [x] Create an isolated Git worktree and branch for this feature.
- [x] Write this plan before implementation.
- [ ] Open the feature PR with this plan as the first commit.

### B. Data model

- [ ] Add a typed canonical paper schema.
- [ ] Migrate the three existing paper records to the canonical paper module.
- [ ] Preserve the verified code states and repository links already established.
- [ ] Make homepage featured papers derive from the canonical records.
- [ ] Confirm no paper metadata is duplicated between homepage and Papers page.

### C. Papers page

- [ ] Add Chinese `/papers/`.
- [ ] Add English `/en/papers/`.
- [ ] Group papers by category.
- [ ] Show venue/year/task information.
- [ ] Show Paper / Official repo / Project links where available.
- [ ] Show verified code status and verification date.
- [ ] Link to `CONTRIBUTING.md` for curation/code-status definitions.

### D. Navigation and homepage integration

- [ ] Add Papers to the shared navigation.
- [ ] Preserve Home / Metrics navigation.
- [ ] Preserve Chinese-default and English switching behavior.
- [ ] Add a restrained homepage link to the Papers index without expanding homepage content.

### E. Validation

- [ ] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [ ] Chinese Papers page renders all 3 public papers.
- [ ] English Papers page renders all 3 public papers.
- [ ] Homepage still renders exactly 3 paper cards and 2 dataset cards.
- [ ] Both Papers pages expose the correct code-status labels.
- [ ] Mobile viewport has no horizontal overflow.
- [ ] Language switching preserves the Papers route.
- [ ] Metrics routes still build successfully.
- [ ] No candidate paper from `PAPER_CODE_AUDIT.md` appears publicly.

### F. PR / deployment closeout

- [ ] Push implementation commits to this feature branch.
- [ ] PR CI build passes.
- [ ] Reference-metrics CI remains green.
- [ ] Vercel Preview passes.
- [ ] Validate Preview content before merge.
- [ ] Squash-merge only when all gates are green.
- [ ] Production deployment succeeds.
- [ ] Verify production `/papers/` and `/en/papers/` return HTTP 200 and correct content.
- [ ] Update this checklist to fully reflect completed delivery.

## 6. Delivery standard

The feature is considered complete only when all of the following are true:

1. **One feature, one PR** — the PR contains only the Papers index/schema feature plus its plan and verification.
2. **Single source of truth** — homepage and Papers page use the same paper records.
3. **No silent scope expansion** — only the existing three public papers appear.
4. **Bilingual parity** — Chinese and English expose the same papers and code facts.
5. **Code-status integrity** — GDKVM points to `gdkvm_code`; MemSAM remains Code available; OSA remains Code announced unless separately re-verified.
6. **Parallel-agent safety** — no metrics Agent working-tree changes are overwritten or absorbed.
7. **Build quality** — Astro/type checks pass with zero errors/warnings/hints.
8. **Responsive quality** — no horizontal overflow at 390×844.
9. **Deployment quality** — PR Preview and production deployment both succeed.
10. **Auditability** — this Markdown remains in the merged repository with final checked state.

## 7. Rollback condition

Do not merge if any of these occur:

- paper metadata diverges between homepage and Papers page;
- navigation breaks the existing Metrics routes;
- Chinese/English route parity is lost;
- a pending candidate paper becomes public accidentally;
- CI or Vercel Preview is red;
- concurrent metrics work is overwritten or mixed into this PR.
