# Research Map — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/research-map`

## 1. Goal

Add a bilingual Research Map that helps newcomers understand the major AI research problems in echocardiography and see where the current curated papers fit.

This is a **research-task map**, not a clinical workflow, clinical guideline, or claim that real-world echocardiography must follow a fixed linear pipeline.

## 2. Non-goals

This PR will not:

- change which papers are in the catalog;
- change code-status labels;
- modify Reference Metrics;
- add new datasets;
- add citation/SEO infrastructure;
- add scheduled monitoring or candidate discovery;
- present a clinical decision pathway.

## 3. Routes

- `/map/` — Chinese default
- `/en/map/` — English

## 4. Information architecture

### Main research-task path

1. **Acquisition & View Understanding**
   - probe guidance
   - view classification
   - image-quality assessment

2. **Segmentation & Tracking**
   - chamber/structure segmentation
   - temporal consistency
   - motion tracking

3. **Quantification & Cardiac Function**
   - EF
   - volumes
   - strain / measurements

4. **Disease Assessment**
   - structural disease
   - functional disease
   - risk / diagnosis support

5. **Representation & Foundation Models**
   - self-supervised learning
   - masked modeling
   - transfer learning
   - large-scale foundation models

6. **Reporting & Multimodal**
   - report generation
   - vision-language
   - study-level reasoning

### Cross-cutting methods

- Generation / synthesis
- Domain generalization
- Robustness / adaptation

These are shown separately so the map does not imply they are sequential clinical stages.

## 5. Data connection

The map must derive paper membership from the existing canonical `src/papers.ts` records where possible. It should not duplicate full paper metadata.

For each map node:

- show a short bilingual explanation;
- show the count of currently curated papers relevant to that node;
- link to the corresponding section of `/papers/` when a direct category exists;
- show “coverage gap / 待补代表作” when no current curated paper covers the node.

## 6. Navigation

Add **研究地图 / Map** to the shared navigation.

Language switching must preserve the Map route:
- `/map/` ↔ `/en/map/`

## 7. Visual design

Use the existing restrained site language:

- no decorative stock illustration;
- no fake clinical flowchart;
- clear numbered task blocks with connecting rhythm;
- cross-cutting methods visually separated;
- mobile layout must become a simple vertical sequence;
- no horizontal scroll at 390×844.

## 8. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open the feature PR with this plan as the first commit.

### B. Map model
- [x] Define bilingual research-map node data.
- [x] Separate main task path from cross-cutting methods.
- [x] Connect map nodes to canonical paper categories/counts.
- [x] Represent empty areas as explicit coverage gaps rather than inventing papers.

### C. Page implementation
- [x] Add Chinese `/map/`.
- [x] Add English `/en/map/`.
- [x] Render six main research-task nodes.
- [x] Render Generation and Domain Generalization as cross-cutting methods.
- [x] Show current paper counts and relevant catalog links.
- [x] Add a clear “research map, not clinical workflow” note.

### D. Navigation
- [x] Add Map to shared navigation.
- [x] Preserve Home / Papers / Metrics navigation.
- [x] Preserve Chinese/English route switching.
- [x] Highlight Map as active on Map routes.

### E. Validation
- [x] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [x] Chinese Map page renders all six main nodes.
- [x] English Map page renders all six main nodes.
- [x] Cross-cutting section renders Generation and Domain Generalization.
- [x] Segmentation/Quantification/Disease/Representation counts match canonical paper data.
- [x] Acquisition and Reporting show explicit coverage gaps.
- [x] Mobile viewport has no horizontal overflow.
- [x] Homepage remains 3 featured papers.
- [x] Papers page remains 10 public papers.
- [x] Metrics routes still build and retain KaTeX output.

### F. Delivery
- [ ] Push implementation to the feature branch.
- [ ] PR build CI passes.
- [ ] Reference-metrics regression remains green.
- [ ] Vercel Preview passes.
- [ ] Preview content verified before merge.
- [ ] Squash-merge only on clean exact head.
- [ ] Production deployment succeeds.
- [ ] Production `/map/` and `/en/map/` return HTTP 200.
- [ ] Close checklist with delivery evidence.

## 9. Delivery standard

Complete only when:

1. a newcomer can see the major echocardiography-AI research areas without reading the entire paper list;
2. the map does not pretend to be a clinical pathway;
3. paper counts come from the canonical catalog rather than duplicated metadata;
4. current coverage gaps are shown honestly;
5. Chinese and English are functionally equivalent;
6. mobile and desktop layouts are readable;
7. all CI/Preview/Production gates are green.

## 10. Rollback conditions

Do not merge if:

- the map implies a medical/clinical recommendation;
- paper counts are hard-coded inconsistently with `src/papers.ts`;
- a paper is added or removed from the catalog as a side effect;
- metrics/reference CI regresses;
- mobile layout horizontally overflows.
