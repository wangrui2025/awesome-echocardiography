# Current development direction

This repository develops two related public resources: a small bilingual Astro research index and a field-neutral, executable CPU Reference Metrics standard. Development favors verifiable curation and metric behavior over rapid catalog growth. The [Wish](../wish/LATEST.md) defines the product aim; [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`src/papers.ts`](../../src/papers.ts), and the [reference specification](../../reference/metrics_v1/README.md) own their respective facts and semantics.

GitHub owns source, review, repository CI and scheduled candidate-review workflows. Repository CI checks the site build and the CPU reference independently. Vercel builds and serves Preview and Production for site-relevant changes. Candidate discovery and code-status monitoring create human review issues; they do not approve papers or metrics automatically. Cloudflare, GitHub Pages and CircleCI have no current delivery role.

The [current CI operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract) names exact triggers, secret boundaries, cancellation and rollback. The workflows and live provider settings remain executable truth. This Dev view explains the direction and is updated when that contract materially changes.
