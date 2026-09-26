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


## Current operating contract

The de-duplication above is implemented. Workflow YAML owns triggers and commands; this section explains the current CI passport and how to operate it.

| Responsibility | Owner | Evidence / boundary |
| --- | --- | --- |
| Source, history, PR and CI orchestration | GitHub | Public repository; inspect actual job/step results, not only check badges. |
| Site correctness and Reference Metrics | GitHub-hosted Ubuntu CI | `npm ci` + build; Python CPU reference regressions and frozen audit verification. |
| Preview and Production | Vercel, invoked by `deploy.yml` | Same-repository PR Preview only; eligible `main` pushes deploy Production. Vercel performs the provider build. |
| Paper/code-status monitoring | Two weekly GitHub Actions workflows | Candidate review issues only; no automatic scientific or catalog acceptance. |
| Cloudflare / Pages / CircleCI | No current role | Adding a provider requires a demonstrated responsibility and quota review. |

### Validation and spend boundaries

- Application Node remains 22, Python remains 3.12, and the Vercel CLI remains pinned in `deploy.yml`. GitHub-owned Actions run their own Node 24 implementation runtime and are pinned to reviewed full commit SHAs. An Action runtime update does not authorize a product/runtime dependency upgrade.
- CI currently covers every PR to `main` and every `main` push. These are distinct candidate and integrated-tree checks; feature-branch pushes do not have an additional push CI trigger. Keep build/reference acceptance semantics intact.
- Vercel deploy inputs are `src/**`, `public/**`, Astro/package/TypeScript config; PRs also watch `deploy.yml` itself. Documentation, Reference Metrics, and review automation changes alone skip deployment while retaining CI. A deploy-workflow-only merge does not deploy Production under the current push filter.
- PR CI and Preview use per-workflow, per-PR concurrency groups and cancel superseded in-progress work. Production shares its main-branch deployment group and does not cancel an in-progress deployment. GitHub's default concurrency queue may replace an older pending run with the newest one; it is not a promise to publish every intermediate commit.
- Preserve the same-repository Preview condition before using Vercel secrets. Fork PRs receive ordinary CI, not a secret-bearing deploy. Checkout stays shallow unless a specific job proves it needs history.
- Validate coherent changes locally before one final PR update. Read the actual latest-head CI and, for deploy-relevant changes, Vercel Preview evidence. A local pass does not prove provider execution. Editing `deploy.yml` intentionally spends a Preview build once the final PR is opened/updated.

### Diagnose and roll back

Read the first failing job and step: a runner that never starts indicates provider/allowance evidence; checkout/setup failure is CI tooling; build or reference-test failure after setup needs its concrete error; Vercel upload/build failure belongs to the deploy/provider layer. Confirm provider status/quota before altering application code or retrying. Count GitHub runner time and Vercel build usage separately; public standard GitHub-hosted minutes are not private-repository billed-minute estimates.

Use the owner-wide [CI portfolio audit](https://github.com/mykcs/.codex/tree/main/engineering) to rank runs/jobs by elapsed duration and distinguish failed-before-runner attempts. Refresh repository data and the exact head before diagnosing a current issue from historical totals.

For a regression, revert only the focused CI change through a PR and revalidate that head. Preserve deploy triggers, same-repository secret checks, runtime versions, and CPU metric authority. Avoid restoring a retired Action runtime merely to match an old file: select another verified supported Action commit if the implementation itself regressed. Production rollback remains a deliberate Vercel release operation; a CI fix does not authorize changing domains or publishing a different scientific artifact.
