# Agent documentation router

This repository is a curated public research resource for echocardiography papers, datasets, and reproducible evaluation guidance.

## Read order

1. [`AGENTS.md`](../../AGENTS.md) — repository-wide curation, metric, editing, and authority rules.
2. [`../wish/LATEST.md`](../wish/LATEST.md) — current product/curation intent; add `DESIGN.md` for information architecture or major product-direction changes.
3. [`../dev/LATEST.md`](../dev/LATEST.md) — current development direction; add `DESIGN.md` and the local operating contract for CI/hosting changes.
4. Task-relevant canonical owners such as `CONTRIBUTING.md`, `src/papers.ts`, or `reference/metrics_v1/`.
5. Executable workflow/config plus live provider state for deployment or CI claims.

## Ownership map

- Wish owns what the resource should become; it does not decide whether a paper, code-status, or metric claim is factually true.
- `CONTRIBUTING.md` and `src/papers.ts` own curation/code-status semantics and data.
- `reference/metrics_v1/` owns metric semantics and executable reference behavior.
- `docs/dev/` owns development direction, while the linked local operating contract and workflow YAML own current CI/deployment implementation.
- Dated closeouts and archives are historical evidence only.

Shared lifecycle owners: [`WISH_PROTOCOL.md`](https://github.com/mykcs/.agents/blob/main/docs/agents/WISH_PROTOCOL.md) and [`DEV_PROTOCOL.md`](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).
