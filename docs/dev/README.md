# Awesome Echocardiography Dev

This folder explains this repository's current development direction and why its CI and hosting roles fit a curated research resource. The shared lifecycle is [Dev folder protocol](https://github.com/mykcs/.agents/blob/main/docs/agents/DEV_PROTOCOL.md).

- [Account-level CI standard](https://github.com/mykcs/.agents/blob/main/docs/agents/CI_STANDARD.md): shared CI semantics and acceptance rules. The repository's current mode and provider contract remain in the local [operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract).

- [LATEST.md](LATEST.md): current development direction and provider roles.
- [DESIGN.md](DESIGN.md): reasoning, validation routing and migration conditions.
- [ARCHIVE.md](ARCHIVE.md): superseded directions, when they exist.

The **one current CI and deployment operating contract** remains [CI / Vercel deploy de-duplication — Current operating contract](../plans/CI_DEPLOY_DEDUP_PLAN_20260921.md#current-operating-contract). Workflow YAML in [`.github/workflows/`](../../.github/workflows/) owns triggers and commands. [`AGENTS.md`](../../AGENTS.md) is the Agent entrypoint; the [Wish](../wish/README.md) owns product intent. Dev does not duplicate these owners.
