# Agent entrypoint

This repository is a curated public research resource. Keep startup rules short and route to the canonical owners below.

## Before editing

- Resolve the live `main` SHA first; concurrent PRs are common. Work from an isolated branch/worktree created from that exact SHA.
- Re-read current `main` before merging. A green check on an older base is stale evidence.
- The remote shell may be Fish. Do not assume Bash syntax; use structured file edits or invoke Bash explicitly for Bash-only commands.
- Before committing, inspect `git status` and `git diff --check`; do not commit generated caches or build output.

## Canonical owners

- Paper curation and code-status rules: `CONTRIBUTING.md`; canonical paper data: `src/papers.ts`.
- Metric semantics: `reference/metrics_v1/README.md`; executable reference: `reference/metrics_v1/reference_metrics.py`.
- Site deployment: `.github/workflows/deploy.yml`. Preserve its same-repository Preview secret boundary.
- Dated closeouts under `docs/closeouts/` are historical evidence, not mutable policy.

## Public-standard rules

- Keep benchmark and metric guidance field-neutral. Do not justify normative rules by centering this project's own papers.
- Do not infer evaluator semantics from a repository name, public release, or legacy code path. Trace the exact implementation/version actually used.
- CPU Reference Metrics is the semantic authority. Faster/GPU implementations must prove numerical equivalence; speedups do not redefine a metric.
- Metric explanations should follow: what it is → mathematical formula → recommended implementation → rationale, with math rendered through KaTeX on the site.
