# Awesome Echocardiography Dev

This folder explains this repository's current development direction and why its CI and hosting roles fit a curated research resource. The shared lifecycle is [Dev folder protocol](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).

- [Account-level CI standard](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md): shared CI semantics and acceptance rules. The repository's current mode and provider contract remain in the local [operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract).

- [LATEST.md](LATEST.md): current development direction and provider roles.
- [DESIGN.md](DESIGN.md): reasoning, validation routing and migration conditions.
- [ARCHIVE.md](ARCHIVE.md): superseded directions, when they exist.

The **one current CI and deployment operating contract** remains [CI / Vercel deploy de-duplication — Current operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract). Workflow YAML in [`.github/workflows/`](../../.github/workflows/) owns triggers and commands. [`AGENTS.md`](../../AGENTS.md) is the Agent entrypoint; the [Wish](../wish/README.md) owns product intent. Dev does not duplicate these owners.

## Website acceptance map

| Area | Local owner and acceptance |
| --- | --- |
| Agent reading | src/lib/agent-reader.ts and the generated public catalog; scripts/check-agent-reader.mjs and e2e reader checks validate source links and use. |
| Design | [Sitewide design](../workstreams/SITEWIDE-DESIGN-20261120.md), src/styles/tokens.css, actual rendered consumers and existing design tests. |
| Responsive | Existing desktop and mobile Chromium/WebKit checks; use 440×956 DPR3/touch when emulating phone. |
| Expression | Curation source, original papers and reference metrics; retain evidence date and code-status caveats. |
| Engineering | npm ci and npm run build; no new framework. |
| CI | [LATEST](LATEST.md), [DESIGN](DESIGN.md), existing site build/browser and separate scientific reference jobs; exact deployment readback. |
| Public output | Only approved public sources; no account/private/patient records or clinical inference. |
| Accessibility/performance | Semantic navigation, contrast, keyboard and reader controls; report relevant actual browser/measurement evidence separately. |
| Governance | Existing AGENTS, Wish, Dev and design/code owners. |

This is a local acceptance route, not an assertion that every test has passed.

Feature-level goals and protected semantics: [Feature Design](../design/features/README.md). This file retains its existing ownership and history.
