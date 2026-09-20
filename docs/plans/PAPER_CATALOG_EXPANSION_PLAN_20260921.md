# Paper Catalog Expansion — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/paper-catalog-expansion`  
Feature: curated expansion of the public Papers catalog

## 1. Goal

Promote the already-audited candidate papers into the public `/papers/` catalog after an explicit editorial review.

The catalog remains curated. This PR does **not** turn Awesome Echocardiography into an exhaustive bibliography and does **not** change the three featured homepage papers.

## 2. Editorial decision

The seven audited candidates are accepted because each is directly about echocardiography AI, appears at CVPR/ECCV/MICCAI, and adds a meaningful research direction or methodological perspective beyond the existing three-paper video-segmentation-only view.

Accepted candidates:

1. **EchoForge — CVPR 2026**  
   Semi-supervised echocardiography video segmentation. Code state: **Code announced**.
2. **CardiacNet — ECCV 2024**  
   Echocardiogram-based cardiac disease assessment. Code state: **Code available**.
3. **EchoCardMAE — MICCAI 2025**  
   Masked-video representation learning for EF, CHD, and segmentation. Code state: **Partial code**.
4. **HSS-Net — MICCAI 2025**  
   Spatio-temporal segmentation for EF estimation. Code state: **Code announced**.
5. **CoReEcho — MICCAI 2024**  
   Continuous representation learning for 2D+time echocardiography. Code state: **Code available**.
6. **Free-Echo — MICCAI 2024**  
   Echocardiogram video synthesis. Code state: **Code available**.
7. **MLSW — MICCAI 2024**  
   Domain-generalized echocardiography segmentation. Code state: **Code announced**.

The code states are inherited from `docs/PAPER_CODE_AUDIT.md` and must not be upgraded merely because a publisher page says “code available.”

## 3. Non-goals

This PR will not:

- change the homepage featured-paper count;
- alter metrics/reference-standard pages or code;
- add datasets;
- create Research Map UI;
- create issue/PR submission templates;
- automate candidate discovery;
- automate code-status updates;
- add papers that have not gone through the audit/editing process.

## 4. Data-model changes

Extend the canonical `PaperRecord` only where needed for useful catalog display:

- optional short method/display name;
- optional dataset list;
- optional bilingual editorial summary.

The existing canonical fields remain authoritative for title, authors, venue/year, category, URLs, code status, verification date, and featured flag.

## 5. Category placement

Primary category assignment:

- Video Segmentation: OSA, GDKVM, MemSAM, EchoForge
- Cardiac Function & EF: HSS-Net
- Disease Assessment: CardiacNet
- Representation Learning: EchoCardMAE, CoReEcho
- Generation & Synthesis: Free-Echo
- Domain Generalization: MLSW

No paper is duplicated across multiple primary categories in this PR.

## 6. Implementation checklist

### A. Planning

- [x] Create an isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [ ] Open the feature PR with this plan as the first commit.

### B. Canonical records

- [ ] Add the seven accepted papers to `src/papers.ts`.
- [ ] Preserve all audited code-status labels exactly.
- [ ] Preserve GDKVM's verified implementation URL `wangrui2025/gdkvm_code`.
- [ ] Add dataset metadata where the paper's official publication/audit evidence supports it.
- [ ] Add concise bilingual editorial summaries.
- [ ] Keep `featured: false` for all seven new papers.
- [ ] Confirm homepage still derives exactly the original three featured papers.

### C. Catalog behavior

- [ ] Render all public papers on Chinese `/papers/`.
- [ ] Render the same public papers on English `/en/papers/`.
- [ ] Group all papers under the intended six public categories.
- [ ] Preserve code-status explanation and verification date.
- [ ] Keep the candidate audit link and curation-policy link visible.
- [ ] Ensure no paper is duplicated across category sections.

### D. Validation

- [ ] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [ ] Homepage renders exactly 3 paper cards and 2 dataset cards.
- [ ] Chinese Papers page renders exactly 10 paper cards.
- [ ] English Papers page renders exactly 10 paper cards.
- [ ] Papers page reports exactly 6 active categories.
- [ ] Code-state counts match the audit/editorial data.
- [ ] GDKVM link resolves to `wangrui2025/gdkvm_code`.
- [ ] Mobile viewport has no horizontal overflow.
- [ ] Existing Metrics routes still build and retain KaTeX output.
- [ ] No unaudited paper is made public.

### E. Delivery

- [ ] Push implementation to the feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics regression CI remains green.
- [ ] Vercel Preview passes.
- [ ] Preview content is verified before merge.
- [ ] Squash-merge only with a clean exact head.
- [ ] Production deployment succeeds.
- [ ] Production `/papers/` and `/en/papers/` return HTTP 200 with 10 papers.
- [ ] Update this checklist and record delivery evidence.

## 7. Delivery standard

The feature is complete only when:

1. the public catalog contains **10** manually curated papers;
2. homepage remains exactly the original **3** featured papers;
3. the seven new entries retain their audited code-status truth;
4. Chinese and English catalog contents are identical in membership and factual metadata;
5. six research categories are represented;
6. no metrics implementation or reference semantics are changed;
7. CI, reference-metrics regression, Vercel Preview, and Production are all green;
8. this plan remains merged as an auditable receipt.

## 8. Rollback conditions

Do not merge if:

- any audited code status is silently upgraded;
- a new paper becomes `featured: true` accidentally;
- the homepage expands beyond three papers;
- a paper is duplicated across primary categories;
- the metrics/reference-standard CI regresses;
- Preview or Production is red.
