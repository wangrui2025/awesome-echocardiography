# CI / Vercel deploy de-duplication — 2026-09-21

## Goal

Shorten Preview/Production delivery without weakening the existing site build or Reference Metrics checks.

## Control

Recent pull requests show:

- **CI** completes in roughly **18–24 seconds**.
- **Vercel Deploy** takes roughly **47–54 seconds**.
- Vercel's own provider BUILDING→READY phase is only about **10–13 seconds**.

The deploy workflow currently repeats `npm ci` and `npm run build` before invoking `vercel deploy`, and Vercel then performs its own provider build again.

## Treatment

- Keep `.github/workflows/ci.yml` unchanged as the repository/reference correctness lane.
- Remove the local dependency install and local site build from `.github/workflows/deploy.yml`.
- Let the deploy job only check out the exact source, pin Node, and hand that source to Vercel.
- Trigger Vercel deploy only for site/deploy inputs: `src/**`, `public/**`, Astro/package/TypeScript config, or the deploy workflow itself.
- Docs, audit evidence, Reference Metrics code, and review automation should not spend a Vercel deployment when they cannot change the public site.

## Safety boundary

- The same-repository Preview secret boundary stays unchanged.
- Vercel still performs the real provider build and refuses deployment on build failure.
- `CI/build` and `reference-metrics` semantics stay unchanged.
- No catalog, metric, scientific, or public-content semantics change.

## Acceptance

- Existing CI remains green.
- GitHub accepts the workflow.
- This PR still produces a real Preview because the deploy workflow itself is deploy-relevant.
- Compare the new Vercel Deploy wall time with the **47–54 second** recent control; retain only if materially lower.
