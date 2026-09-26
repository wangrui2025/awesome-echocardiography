# Why this development loop fits this repository

## Local work and hosted checks

The Astro site and Python metric reference have different correctness owners. Run the relevant repository command locally before updating a PR; the [CI workflow](../../.github/workflows/ci.yml) then checks both on PRs and integrated `main`. The Python reference, fixtures and frozen audit preserve metric semantics; a successful site build cannot replace those checks. Provider execution on the current candidate is the evidence for a hosted result.

The [deploy workflow](../../.github/workflows/deploy.yml) routes site inputs to Vercel Preview or Production. Documentation, metric-reference code and review-automation changes continue through repository CI without a redundant site deployment. GitHub hands source to Vercel, whose own build decides whether the site is deployable. Same-repository PR Preview protects deployment secrets; an in-progress Production deployment is not canceled by a later push. The [operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract) is the current owner of these details.

## Provider choice and change condition

Vercel serves the Astro site and gives it a Preview/Production boundary. GitHub runs the source and metric checks, plus two small scheduled human-review aids. A second site builder or scheduler would add work without a distinct current responsibility. Reconsider the split only after measuring the remaining job and provider cost, proving replacement coverage on a real candidate and documenting rollback in the operating contract. [Central CI policy](https://github.com/mykcs/.codex/blob/main/engineering/CI_STANDARD.md) defines that qualification rule.

For a red run, start with the first failing job and step: runner allocation, checkout/setup, site/reference tests and Vercel build are different failure layers. Read the [operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#diagnose-and-roll-back) and the live provider result before changing product code. A dated portfolio estimate does not replace the current check or bill.
