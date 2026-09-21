# Paper Catalog Batch 2 — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/paper-catalog-batch2`  
Source audit: PR #21 / Candidate Review #20

## 1. Goal

Promote the five manually audited papers from Candidate Review #20 into the public Papers catalog after an explicit editorial decision.

Accepted papers:

1. **MSSNet — TMI 2026**  
   Direct echocardiography video segmentation; adds a recent TMI method.  
   Code state: **Partial code**.
2. **EchoFine — MedIA 2026**  
   Fine-grained transthoracic echocardiographic view classification; fills the current Acquisition & View Understanding coverage gap.  
   Code state: **Code available**.
3. **NCM-Net — TMI 2025**  
   Direct echocardiography video segmentation with neighborhood correlation mining.  
   Code state: **Partial code**.
4. **EchoFM — TMI 2025**  
   Echocardiogram video foundation model; expands the representation/foundation-model direction.  
   Code state: **Code available**.
5. **EchoONE — CVPR 2025**  
   Multi-plane echocardiography segmentation from a top computer-vision venue.  
   Code state: **Code available**.

The homepage remains intentionally limited to the original three featured papers.

## 2. Non-goals

This PR will not:

- add any unaudited paper;
- change the five verified code states;
- change metrics/reference semantics;
- change datasets;
- change automation workflows;
- change the homepage featured-paper membership.

## 3. Canonical schema

Extend `PaperCategory` with:

- `acquisition-view`

New paper primary categories:

- MSSNet → `video-segmentation`
- EchoFine → `acquisition-view`
- NCM-Net → `video-segmentation`
- EchoFM → `foundation-models`
- EchoONE → `video-segmentation`

All five must use the repositories verified in PR #21.

## 4. Research Map integration

Because map counts derive from canonical paper categories:

- Acquisition & View Understanding should move from **0 → 1** via EchoFine.
- Segmentation & Tracking should move from **4 → 7** via MSSNet, NCM-Net, EchoONE.
- Representation & Foundation Models should move from **2 → 3** via EchoFM.
- Reporting & Multimodal remains an explicit coverage gap.

Update the acquisition node to include `acquisition-view`.

## 5. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Verify authoritative author/title metadata from DOI records.
- [x] Write this plan before catalog changes.
- [ ] Open PR with this plan as first commit.

### B. Canonical records
- [ ] Add `acquisition-view` paper category.
- [ ] Add MSSNet with audited Partial code state.
- [ ] Add EchoFine with audited Code available state.
- [ ] Add NCM-Net with audited Partial code state.
- [ ] Add EchoFM with audited Code available state.
- [ ] Add EchoONE with audited Code available state.
- [ ] Use verified implementation URLs from audit.
- [ ] Use authoritative title/author/venue/year metadata.
- [ ] Keep all five `featured: false`.
- [ ] Add concise bilingual summaries.

### C. Papers page
- [ ] Add bilingual Acquisition & View Understanding category label.
- [ ] Render all five new papers in correct primary categories.
- [ ] Preserve code-status evidence and verification date.
- [ ] Public paper count becomes exactly 15.
- [ ] Active catalog category count becomes exactly 8.
- [ ] Homepage remains exactly 3 featured papers.

### D. Research Map
- [ ] Connect acquisition node to `acquisition-view`.
- [ ] Acquisition count becomes 1.
- [ ] Segmentation count becomes 7.
- [ ] Representation/Foundation count becomes 3.
- [ ] Reporting remains the only main-path coverage gap.
- [ ] Cross-cutting Generation and Domain Generalization remain unchanged.

### E. Validation
- [ ] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [ ] Chinese Papers page renders exactly 15 papers.
- [ ] English Papers page renders exactly 15 papers.
- [ ] Homepage renders exactly 3 paper cards and 2 dataset cards.
- [ ] Papers page shows exactly 8 active categories.
- [ ] Code-state counts reflect audited facts.
- [ ] All five implementation links match PR #21 audit.
- [ ] Research Map main counts are 1 / 7 / 1 / 1 / 3 / 0.
- [ ] Mobile Papers and Map pages have no horizontal overflow.
- [ ] Reference Metrics v1.1 remains green.
- [ ] Candidate Discovery no longer emits these five due to canonical/audit dedup.

### F. Delivery
- [ ] Push implementation to feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics CI remains green.
- [ ] Vercel Preview passes.
- [ ] Preview content verified before merge.
- [ ] Squash-merge only on clean exact head.
- [ ] Production deployment succeeds.
- [ ] Production Papers pages show 15 papers; homepage remains 3.
- [ ] Production Research Map counts match canonical catalog.
- [ ] Close checklist with delivery evidence.

## 6. Delivery standard

Complete only when:

1. all five additions are backed by the merged manual audit;
2. public catalog becomes 15 papers without expanding homepage featured content;
3. code-state truth is preserved;
4. acquisition/foundation coverage appears automatically in the Research Map;
5. Chinese and English membership are identical;
6. no metrics/reference behavior changes;
7. CI, Preview, and Production are green.

## 7. Rollback conditions

Do not merge if:

- any paper status is upgraded beyond the audit evidence;
- an implementation URL differs from the verified audit source without new evidence;
- homepage gains more than three featured papers;
- Reference Metrics regress;
- Candidate Discovery or map counts become inconsistent with canonical records.
