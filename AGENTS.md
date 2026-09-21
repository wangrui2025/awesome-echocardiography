# Agent entrypoint

This repository is a curated public research resource. Keep startup rules short and route to the canonical owners below.

## Current wish / product intent

Before any user-facing product, copy, navigation, information-architecture, page-role, or major interaction decision, read [`docs/wish/LATEST.md`](docs/wish/LATEST.md).

- Read [`docs/wish/DESIGN.md`](docs/wish/DESIGN.md) for homepage, navigation, information architecture, major route-role, interaction, curation-direction, or product-direction changes.
- Do not read [`docs/wish/ARCHIVE.md`](docs/wish/ARCHIVE.md) by default; use it only to trace historical intent.
- [`docs/wish/README.md`](docs/wish/README.md) owns the wish-system lifecycle.
- Current owner instructions, curation evidence, metric semantics, safety boundaries, and executable truth outrank the wish. The wish owns what the resource should become, not whether a paper/code/metric claim is factually true.

Do not duplicate the wish text into this root file.

## Central website learning

Before human-facing copy work, read:

- https://github.com/mykcs/.codex/blob/main/website-learning/shared/content/HUMAN_EXPRESSION.md

For material design or website-engineering work, also read the matching shared file and this site's learned experience:

- https://github.com/mykcs/.codex/blob/main/website-learning/shared/design/LEARNED_PREFERENCES.md
- https://github.com/mykcs/.codex/blob/main/website-learning/shared/engineering/LEARNED_PRACTICES.md
- https://github.com/mykcs/.codex/tree/main/website-learning/sites/awesome-echocardiography

Conversation closeout uses:

- https://github.com/mykcs/.codex/blob/main/website-learning/CONVERSATION_CLOSEOUT.md

The central system stores experience, not live paper/code-status facts or metric authority. Those remain in this repository.

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
