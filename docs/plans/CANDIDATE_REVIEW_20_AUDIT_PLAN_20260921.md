# Candidate Review #20 — Code Audit Plan

Date: **2026-09-21**  
Branch: `audit/discovered-candidates-20`  
Source issue: **#20 Candidate paper review**

## 1. Goal

Manually audit the five candidates surfaced by Candidate Paper Discovery and record trustworthy code-source evidence before any editorial/catalog decision.

Candidates:

1. Echocardiography Video Segmentation via Mamba-Based Spatiotemporal Synergistic Network and Adaptive-Dynamic Learning — TMI 2026
2. Robust fine-grained echocardiographic view classification with supervised contrastive learning — MedIA 2026
3. Echocardiography Video Segmentation via Neighborhood Correlation Mining — TMI 2025
4. EchoFM: Foundation Model for Generalizable Echocardiogram Analysis — TMI 2025
5. EchoONE: Segmenting Multiple Echocardiography Planes in One Model — CVPR 2025

## 2. Non-goals

This PR will not:

- add/remove public papers from `src/papers.ts`;
- change the website catalog;
- assign homepage featured status;
- change metrics/reference semantics;
- close issue #20 until all five audits are recorded and merged.

A separate content PR is required for any public catalog changes.

## 3. Audit protocol

For every candidate:

1. verify paper identity and venue from an authoritative publication source;
2. locate author-declared code/repository links;
3. search GitHub by method/title and author/lab account for alternate implementation repositories;
4. inspect repository tree, not just README;
5. distinguish:
   - project/paper page,
   - actual implementation,
   - dataset repository,
   - model/weight library,
   - unofficial reproduction;
6. inspect training, evaluation/inference, configs, preprocessing, dependencies, and weights when relevant;
7. assign one existing code state:
   - Code available
   - Partial code
   - Code announced
   - No public code
   - Unofficial implementation
8. record verification date and concrete evidence.

## 4. Editorial boundary

This audit answers **“what is actually public?”**, not **“should the paper be included?”**

After this audit merges, each paper may separately be:
- accepted into the public catalog;
- kept in the audit ledger only;
- deferred for more evidence.

## 5. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before changing audit records.
- [x] Open audit PR with this plan as first commit.

### B. MSSNet / TMI 2026
- [x] Verify authoritative paper record.
- [x] Verify author-declared implementation repository.
- [x] Search for alternate author/lab repositories.
- [x] Inspect actual runnable contents.
- [x] Assign and document code state.

### C. EchoFine / MedIA 2026
- [x] Verify authoritative paper record.
- [x] Verify actual implementation repository.
- [x] Distinguish TTE47 dataset/model library from implementation.
- [x] Inspect training/evaluation contents.
- [x] Assign and document code state.

### D. NCM-Net / TMI 2025
- [x] Verify authoritative paper record.
- [x] Verify actual implementation repository.
- [x] Inspect what is present versus README “other codes coming soon”.
- [x] Search for alternate complete implementation repository.
- [x] Assign and document code state.

### E. EchoFM / TMI 2025
- [x] Verify authoritative paper record.
- [x] Verify actual implementation repository.
- [x] Inspect pretraining/config/environment code.
- [x] Verify checkpoint/weight evidence separately.
- [x] Assign and document code state.

### F. EchoONE / CVPR 2025
- [x] Verify CVPR Open Access paper record.
- [x] Verify actual implementation repository.
- [x] Inspect train/test/model/utils contents.
- [x] Distinguish old “code will be available” paper text from current repository state.
- [x] Assign and document code state.

### G. Audit ledger
- [x] Add all five candidates to `docs/PAPER_CODE_AUDIT.md`.
- [x] Include authoritative paper URL.
- [x] Include verified implementation/project/dataset URLs as applicable.
- [x] Include concrete code evidence and missing pieces.
- [x] Record verification date.
- [x] Keep editorial decision separate from code state.
- [x] Ensure future Candidate Discovery deduplicates all five via audit headings.

### H. Validation
- [x] `npm run build` stays green.
- [x] Reference Metrics v1.1 remains unchanged.
- [x] Public paper count remains 10.
- [x] Homepage featured count remains 3.
- [x] `src/papers.ts` is untouched.
- [x] Issue #20 titles all appear in the audit ledger after change.

### I. Delivery
- [ ] Push audit changes to feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics CI remains green.
- [ ] Vercel Preview passes.
- [ ] Squash-merge only on clean exact head.
- [ ] Close issue #20 only after merged audit exists on main.
- [x] Re-run Candidate Discovery and confirm these five no longer reappear.
- [ ] Close checklist with delivery evidence.

## 6. Delivery standard

Complete only when all five candidates have:

- authoritative paper identity;
- verified repository source;
- concrete repository-content evidence;
- honest code state;
- explicit verification date;
- no project-page / implementation-repo confusion.

No catalog publication decision is part of this PR.

## 7. Rollback conditions

Do not merge if:

- any code state is inferred only from a paper badge/link;
- a project page is labeled as implementation without file-tree evidence;
- a paper is silently added to the public catalog;
- metrics/reference behavior changes;
- one of the five candidates remains unaudited.
