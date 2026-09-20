# Code Status Watch — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/code-status-watch`

## 1. Goal

Add a scheduled, evidence-only review of public paper implementation repositories.

The automation should detect conditions that deserve human re-verification, such as:

- a repository disappears or becomes inaccessible;
- a repository is archived/disabled;
- a paper currently marked **Code announced** begins to expose plausible ML implementation files;
- a paper marked **Code available / Partial code** no longer exposes meaningful implementation files;
- the manual verification date becomes stale.

The automation must **never modify paper code status automatically**.

## 2. Non-goals

This PR will not:

- update `src/papers.ts` automatically;
- promote Code announced → Code available automatically;
- demote a paper automatically;
- discover new papers;
- add/remove papers;
- touch Reference Metrics semantics;
- require third-party secrets.

## 3. Audit logic

### Source of truth

Read public paper records from canonical `src/papers.ts`.

For every GitHub `repositoryUrl`:

1. query GitHub repository metadata;
2. inspect the default-branch tree;
3. count plausible research-code signals such as:
   - Python files;
   - shell scripts;
   - YAML/config files;
   - notebooks;
   - common training/evaluation filenames;
4. compare repository evidence with the current manual `codeStatus`;
5. compare `codeVerifiedAt` with a stale threshold.

### Conservative heuristics

- **Code announced** is only flagged as “possible release” if ML/research implementation signals appear.
- Website/project JavaScript alone must not count as released ML code.
- **Code available / Partial code** is flagged only when implementation signals vanish or repository access fails.
- The report must clearly say that findings require manual review.

## 4. Workflow

Add `.github/workflows/code-status-watch.yml`:

- weekly schedule;
- manual `workflow_dispatch`;
- `contents: read`;
- `issues: write`;
- use built-in `GITHUB_TOKEN`, no new secret.

Behavior:

1. run audit script;
2. write Markdown report to job summary;
3. when review findings exist:
   - create one issue titled **Code status review needed** if absent;
   - otherwise update the existing open issue;
4. when no findings exist:
   - do not create a new issue;
   - leave status changes untouched.

## 5. Script

Add `scripts/audit_code_status.py` using Python stdlib only.

Required properties:

- deterministic parsing of current canonical records;
- explicit user-agent for GitHub API;
- token optional locally, `GITHUB_TOKEN` in Actions;
- bounded API calls;
- useful non-zero exit only for true script/API failures, not review findings;
- report includes paper title, current status, repository, evidence, and recommended human action.

## 6. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open PR with this plan as first commit.

### B. Audit script
- [x] Parse canonical paper records.
- [x] Extract GitHub implementation repository URLs.
- [x] Query repository metadata and default-branch tree.
- [x] Distinguish ML/research implementation signals from project-site files.
- [x] Detect inaccessible/archived repositories.
- [x] Detect possible release from Code announced repositories.
- [x] Detect missing implementation signals for available/partial repositories.
- [x] Detect stale verification dates.
- [x] Emit Markdown report with human-review language.
- [x] Never edit `src/papers.ts`.

### C. Workflow
- [x] Add weekly schedule.
- [x] Add manual dispatch.
- [x] Use only built-in GitHub token.
- [x] Set minimal contents/issues permissions.
- [x] Publish report to GitHub Actions summary.
- [x] Create/update one review issue only when findings exist.
- [x] Do not auto-change catalog status.

### D. Validation
- [x] Script runs locally against current 10 papers.
- [x] Current known Code announced placeholders are not falsely classified as full code solely from website files.
- [x] GDKVM real implementation is recognized as having implementation signals.
- [x] MemSAM implementation is recognized as having implementation signals.
- [x] Local run does not modify tracked files.
- [x] Workflow YAML parses.
- [x] `npm run build` remains green.
- [x] Reference Metrics v1.1 regression remains unaffected.

### E. Delivery
- [x] Push implementation to feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics CI remains green.
- [ ] Vercel Preview passes.
- [ ] Manually dispatch code-status watch on PR/default branch where safe.
- [ ] Verify report/issue behavior.
- [ ] Squash-merge only on clean exact head.
- [ ] Production deployment remains green.
- [ ] Close checklist with delivery evidence.

## 7. Delivery standard

Complete only when:

1. automation reports evidence, not verdicts;
2. no status changes can happen without a human PR;
3. project-page code does not create obvious false “released code” positives;
4. the workflow needs no external secret;
5. current site/metrics behavior is unchanged;
6. scheduled/manual workflow is reproducible.

## 8. Rollback conditions

Do not merge if:

- workflow can modify `src/papers.ts`;
- project-site JS is treated as released ML code;
- issue spam can occur on every run;
- workflow requires broad write permissions;
- reference-metrics CI regresses.
