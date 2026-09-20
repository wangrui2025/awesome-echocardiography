# Citation Infrastructure — Implementation Plan

Date: **2026-09-21**  
Branch: `feature/citation`

## 1. Goal

Make Awesome Echocardiography easy to cite as a maintained academic community resource.

This feature provides repository-native citation metadata and a human-readable citation guide without changing paper content, metrics, SEO, or site structure.

## 2. Non-goals

This PR will not:

- modify the curated paper catalog;
- modify Reference Metrics;
- add Search/SEO/Open Graph metadata;
- create scheduled monitoring;
- create paper discovery automation;
- add a Research Map feature;
- fabricate a DOI.

Zenodo archival/DOI is a **post-merge external integration step** and will only be claimed complete if a real Zenodo record/DOI is created.

## 3. Files

### `CITATION.cff`

Add GitHub-compatible Citation File Format metadata with:

- title;
- repository URL;
- website URL;
- maintainer/author;
- keywords;
- concise abstract/message;
- preferred citation.

Do not include a fake DOI.

### `CITATION.md`

Add a short human-readable citation guide with:

- recommended plain-text citation;
- BibTeX example;
- links to GitHub repository and public website;
- note that a DOI should be preferred once a real archival DOI exists.

### README integration

Add a small **Citing this project** section linking to `CITATION.cff` and `CITATION.md`.

## 4. GitHub behavior

With a valid `CITATION.cff`, GitHub should expose **Cite this repository** automatically.

Validation should confirm the file parses as YAML/CFF-compatible structure.

## 5. Post-merge Zenodo plan

After merge:

1. check whether the repository is already connected to Zenodo;
2. if not, attempt GitHub-authenticated Zenodo integration through the authorized browser;
3. enable only `wangrui2025/awesome-echocardiography`, not all repositories;
4. create a first archival GitHub release only after Zenodo integration is active;
5. verify a real Zenodo record and DOI exists;
6. if a DOI is minted, update citation metadata in a follow-up citation-only closeout commit/PR without inventing values.

If external account authentication cannot be completed safely, record the exact blocker instead of claiming a DOI.

## 6. Checklist

### A. Planning
- [x] Create isolated worktree from current `origin/main`.
- [x] Write this plan before implementation.
- [x] Open the feature PR with this plan as the first commit.

### B. Citation metadata
- [x] Add `CITATION.cff`.
- [x] Use real repository and website URLs.
- [x] Add author/maintainer metadata without inventing identifiers.
- [x] Add keywords relevant to echocardiography AI.
- [x] Do not include a fake DOI or version.

### C. Citation guide
- [x] Add `CITATION.md`.
- [x] Add plain-text citation format.
- [x] Add BibTeX example.
- [x] Explain DOI preference if/when a real Zenodo DOI exists.
- [x] Add README citation entry point.

### D. Validation
- [x] `CITATION.cff` parses as YAML.
- [x] Required citation fields are present.
- [x] `npm run build` returns 0 errors, 0 warnings, 0 hints.
- [x] Homepage remains 3 featured papers.
- [x] Papers page remains 10 public papers.
- [x] Research Map routes still build.
- [x] Reference Metrics routes/build remain unaffected.

### E. Delivery
- [x] Push implementation to feature branch.
- [x] PR build CI passes.
- [x] Reference-metrics regression remains green.
- [x] Vercel Preview passes.
- [x] Squash-merge only on clean exact head.
- [x] Production deployment succeeds.
- [x] GitHub default branch contains valid `CITATION.cff`.
- [x] Attempt Zenodo integration after merge.
- [x] Record real DOI if one is actually minted, otherwise record blocker.
- [x] Close checklist with delivery evidence.

## 7. Delivery standard

Complete only when:

1. GitHub has valid citation metadata;
2. the repository has a readable citation guide;
3. no DOI is invented;
4. current site/paper/metrics behavior is unchanged;
5. CI and production gates are green;
6. Zenodo outcome is recorded truthfully.

## 8. Rollback conditions

Do not merge if:

- citation metadata is syntactically invalid;
- author identity/identifier is guessed beyond available evidence;
- a DOI is fabricated;
- paper catalog or metrics content changes as a side effect;
- CI regresses.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.

## 9. Delivery evidence

- Feature PR: **#14 — feat: add citation infrastructure**
- Merge commit: `cf289b35378ff036e1f36a75d43df364cc9ed5e5`
- Main CI and Vercel Production: **SUCCESS**.
- Default branch contains valid `CITATION.cff` and `CITATION.md`; no DOI/ORCID/version was fabricated.
- Zenodo integration was attempted through Zenodo → GitHub OAuth using the `wangrui2025` account.
- External blocker: GitHub entered **Confirm access / sudo mode** and requires owner re-authentication by Passkey, authenticator app, or password before Zenodo authorization can complete. This credential step was not bypassed or automated.
- Therefore **no Zenodo DOI has been claimed or written**. After the owner completes GitHub re-authentication, the remaining sequence is: authorize Zenodo → enable only `wangrui2025/awesome-echocardiography` → create a GitHub release → wait for Zenodo archival → record the real DOI.
