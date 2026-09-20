# Community Paper Submission — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/community-submissions`

## 1. Goal

Create a low-friction but evidence-driven community submission path for authors or readers who want to propose a paper for Awesome Echocardiography.

The workflow must preserve the repository's core rule:

> A GitHub link is not proof of released code.

Submissions should make it easy for maintainers to distinguish a project/page repository, real implementation repository, dataset repository, and unofficial reproduction before anything becomes public.

## 2. Non-goals

This PR will not:

- auto-accept or auto-publish submitted papers;
- modify the paper catalog itself;
- change code-status definitions;
- create the Research Map;
- change metrics/reference-standard code;
- add SEO/Citation infrastructure;
- add scheduled monitoring.

## 3. User flow

1. User clicks **Suggest a paper** from the Papers page.
2. GitHub opens a structured issue form.
3. User provides:
   - title, venue/year, paper URL;
   - why the work belongs in an echocardiography index;
   - research task/category;
   - datasets used;
   - project/page URL if any;
   - actual implementation repository URL if any;
   - claimed code state;
   - concrete runnable components present;
   - weights/checkpoint availability;
   - whether author/lab repositories were searched for a separate implementation;
   - verification date.
4. Maintainer manually reviews the issue.
5. If accepted, a separate feature/content PR updates the canonical paper catalog.

## 4. GitHub artifacts

### Issue form

Add `.github/ISSUE_TEMPLATE/paper.yml` with required fields and explicit code-source distinctions.

### Issue chooser config

Add `.github/ISSUE_TEMPLATE/config.yml`:
- keep blank issues available for general site bugs;
- expose the structured paper form as the preferred paper-submission route.

### Pull request template

Add `.github/PULL_REQUEST_TEMPLATE.md` with:
- one feature per PR;
- a plan Markdown for substantive features;
- paper additions must link their submission/audit evidence;
- code-status claims require repository-content evidence;
- no automatic status upgrade based only on publisher badges.

## 5. Site integration

Update Papers page footer so **Suggest a paper** links directly to the structured paper issue form.

Update README contribution text with a concise link to the submission form and curation policy.

## 6. Checklist

### A. Planning
- [x] Create an isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open the feature PR with this plan as the first commit.

### B. Issue form
- [x] Add structured paper submission form.
- [x] Require authoritative paper URL and venue/year.
- [x] Require research-task/category explanation.
- [x] Require project/page repo and implementation repo to be entered separately.
- [x] Include explicit code-status selection.
- [x] Require runnable-component evidence for code claims.
- [x] Ask whether author/lab repositories were searched for alternate implementation repos.
- [x] Capture datasets, weights/checkpoints, and verification date.
- [x] State clearly that submission does not guarantee inclusion.

### C. PR template
- [x] Add one-feature-one-PR guidance.
- [x] Require a detailed plan Markdown for substantive features.
- [x] Require paper-content PRs to link audit/submission evidence.
- [x] Require code-status evidence.
- [x] Preserve manual editorial review.

### D. Site/README integration
- [x] Link Papers page **Suggest a paper** directly to the form.
- [x] Preserve Chinese/English Papers page parity.
- [x] Update README contribution guidance.
- [x] Keep general GitHub issues available for non-paper problems.

### E. Validation
- [x] GitHub issue-form YAML parses correctly.
- [x] Issue-form template contains all required evidence fields.
- [x] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [x] Chinese and English Papers pages link to the paper submission form.
- [x] Homepage remains exactly 3 featured papers.
- [x] Papers page remains exactly 10 public papers.
- [x] Reference-metrics routes/build remain unaffected.

### F. Delivery
- [x] Push implementation to the feature branch.
- [x] PR build CI passes.
- [x] Reference-metrics regression remains green.
- [x] Vercel Preview passes.
- [x] Preview link behavior verified before merge.
- [x] Squash-merge only with clean exact head.
- [x] Production deployment succeeds.
- [x] Production Papers pages expose the new submission link.
- [x] Close this checklist with delivery evidence.

## 7. Delivery standard

Complete only when:

1. paper submission is structured and evidence-driven;
2. implementation and project/page repositories cannot be conflated by the form;
3. submission never implies automatic inclusion;
4. one-feature-one-PR guidance is visible to contributors;
5. existing site content and metrics remain unchanged;
6. PR/Preview/Production gates are green;
7. this plan remains as the final auditable receipt.

## 8. Rollback conditions

Do not merge if:

- the form allows paper proposals without a paper URL or venue/year;
- code availability can be claimed without describing actual runnable contents;
- site routes break;
- existing catalog membership changes;
- reference-metrics CI regresses.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.

## 9. Delivery evidence

- Feature PR: **#11 — feat: add community paper submission workflow**
- Merge commit: `11130adff034a58c6bae34e6e91cc8d3b3382047`
- Main build CI: **SUCCESS**.
- Reference-metrics regression: **SUCCESS**.
- Vercel Production: **SUCCESS**.
- Default branch contains `.github/ISSUE_TEMPLATE/paper.yml`.
- Production Chinese and English Papers pages link directly to `issues/new?template=paper.yml`.
- Public paper membership remains 10; homepage remains 3 featured papers.
