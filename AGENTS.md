# Agent entrypoint

This repository is a curated public research resource. Keep startup rules short and route to the canonical owners below.

## Current wish / product intent

Before any user-facing product, copy, navigation, information-architecture, page-role, or major interaction decision, read [`docs/wish/LATEST.md`](docs/wish/LATEST.md).

- Read [`docs/wish/DESIGN.md`](docs/wish/DESIGN.md) for homepage, navigation, information architecture, major route-role, interaction, curation-direction, or product-direction changes.
- Do not read [`docs/wish/ARCHIVE.md`](docs/wish/ARCHIVE.md) by default; use it only to trace historical intent.
- Shared Wish lifecycle/update rules are owned by https://github.com/mykcs/.codex/blob/main/website-governance/WISH_PROTOCOL.md; [`docs/wish/README.md`](docs/wish/README.md) is a local navigation entrypoint only.
- Current owner instructions, curation evidence, metric semantics, safety boundaries, and executable truth outrank the wish. The wish owns what the resource should become, not whether a paper/code/metric claim is factually true.

Do not duplicate the wish text into this root file.

## Current development direction

Before changing CI, deployment, hosting, or the local validation loop, read [`docs/dev/LATEST.md`](docs/dev/LATEST.md) and [`docs/dev/DESIGN.md`](docs/dev/DESIGN.md). [`docs/dev/README.md`](docs/dev/README.md) routes to the one current CI contract and executable owners; consult [`docs/dev/ARCHIVE.md`](docs/dev/ARCHIVE.md) only for earlier decisions. The shared Dev lifecycle is owned by https://github.com/mykcs/.codex/blob/main/engineering/DEV_PROTOCOL.md.

## Central website learning

Before human-facing copy work, read the current shared human-expression standard:

- https://github.com/mykcs/.codex/blob/main/website-governance/HUMAN_EXPRESSION_STANDARD.md

When prior owner feedback/evidence matters, also read:

- https://github.com/mykcs/.codex/blob/main/website-learning/shared/content/HUMAN_EXPRESSION.md

For material design work, read the shared semantic web-expression / information-flow lens first:

- https://github.com/mykcs/myk-skills/blob/main/website-improve/references/human-thinking-web-expression.md

When prior owner feedback or design failure evidence matters, also read:

- https://github.com/mykcs/.codex/blob/main/website-learning/shared/design/LEARNED_PREFERENCES.md

For material website-engineering work, read the current shared Engineering Standard first:

- https://github.com/mykcs/.codex/blob/main/website-governance/ENGINEERING_STANDARD.md

When prior engineering failure evidence matters, also read:

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
- CI/provider roles, hosted-build triggers, cancellation, and rollback: the [current operating contract](docs/plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract). Keep Action implementation runtimes separate from application Node/Python versions.
- Dated closeouts under `docs/closeouts/` are historical evidence, not mutable policy.

## Public-standard rules

- Keep benchmark and metric guidance field-neutral. Do not justify normative rules by centering this project's own papers.
- Do not infer evaluator semantics from a repository name, public release, or legacy code path. Trace the exact implementation/version actually used.
- CPU Reference Metrics is the semantic authority. Faster/GPU implementations must prove numerical equivalence; speedups do not redefine a metric.
- Metric explanations should follow: what it is → mathematical formula → recommended implementation → rationale, with math rendered through KaTeX on the site.
