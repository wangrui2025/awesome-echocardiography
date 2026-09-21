# Dataset + metrics standardization conversation closeout

Status: **historical evidence; not normative authority**  
Date: **2026-09-21**  
Canonical mutable rules live in `CONTRIBUTING.md`, `reference/metrics_v1/README.md`, and root `AGENTS.md`.

## Scope reviewed

This closeout covers the accessible conversation that:
- expanded CAMUS and EchoNet-Dynamic from link cards into explanatory dataset guides;
- traced several historical metric implementations and selected the later MONAI-based semantics as the starting point;
- created and expanded Reference Metrics through v1.1;
- reworked the public metrics page into task-based, KaTeX-rendered guidance;
- corrected the public standard from project-centered examples to field-neutral language.

The closeout intentionally does **not** preserve temporary PIDs, ports, worktree paths, Preview URLs, live CI wait states, or transient branch heads.

## Durable lessons

### 1. Dataset pages should explain research utility, not merely provide downloads

A useful dataset guide states the acquisition/view scope, annotation density, structures/phases, scale, suitable research tasks, complementary datasets, and limitations. Download links remain secondary.

### 2. Repository identity is not scientific implementation identity

A public release, an older private repository, and a later experimental evaluator can legitimately differ. When reproducing or standardizing a metric, trace the exact evaluator version and call path that produced the intended semantics instead of inferring authority from the repository name.

### 3. Freeze semantics before optimizing implementation

The successful sequence was:
1. write a transparent CPU reference;
2. define edge cases and units;
3. compare deterministic fixtures against the intended historical/library semantics;
4. only then consider a GPU implementation.

This avoided consuming GPU time before the mathematical contract was stable. Future GPU code must prove equivalence to the CPU reference rather than becoming a second authority.

### 4. Metric names are insufficient without implementation contracts

The conversation exposed several places where the same label could hide different numbers:
- HD95: directional quantiles then max vs pooled-direction percentile;
- ASD: pooled symmetric surface mean vs equal-weight mean of two directional means;
- Bland–Altman: prediction−reference vs reference−prediction;
- SD: population `ddof=0` vs sample `ddof=1`;
- boundary distance: px vs mm;
- AP vs trapezoidal PR-AUC;
- threshold-dependent classification metrics with undeclared threshold selection.

Therefore every public metric contract must make these choices explicit.

### 5. Empty masks must be a benchmark rule, not a library accident

A library can emit NaN or Infinity for one-empty surface-distance cases, and a later reduction can silently improve the reported average by dropping them. Reference Metrics therefore defines empty-mask behavior explicitly and tests it.

### 6. Organize metrics by the question they answer

Do not present metrics as a flat alphabetic list. The stable structure is:
- segmentation;
- classification / diagnosis;
- continuous prediction / cardiac function;
- clinical agreement.

Within segmentation, HD95 immediately follows HD because it is the robust percentile variant of the same boundary concept.

### 7. Public standards must be field-neutral

A public community benchmark should not use this project's own papers as the rhetorical center of the standard. Project-specific incidents can motivate internal auditing, but normative public prose should justify rules through mathematics, statistics, reproducibility, and general methodological evidence.

### 8. Teach every metric in the same order

The metrics page became easier to audit after adopting one repeated structure:

**what it is → mathematical formula → recommended implementation → rationale**

Formulas should use the site's KaTeX path. A code recommendation without a reason is too easy to cargo-cult; a formula without implementation semantics is too easy to reproduce differently.

### 9. Keep curation and code-status evidence separate

A repository link is not evidence that runnable method code exists. Project pages, placeholder repositories, actual implementation repositories, dataset repositories, and unofficial reproductions must stay distinct. This rule already lives in `CONTRIBUTING.md`; closeout should route to it rather than create another code-status policy.

## Engineering friction that should not repeat

- The remote shell can be Fish. Bash heredocs / Bash-only syntax should use explicit Bash or structured file tools.
- After the first quoting/parser failure, switch to structured edits rather than repeatedly fighting nested shell/JavaScript quoting.
- Run `git status` before commit. Generated Python caches and build output do not belong in the public repository.
- Verify generated line-oriented files as real lines; escaped `\n` text can produce a syntactically wrong requirements/config file.
- Concurrent agents frequently move `main`. Exact live-main SHA must be checked before branch creation and again before merge; green checks against an older base are stale.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Dataset cards were too shallow for a field resource | No | Explain annotation/view/scale/use cases/limitations, not just links | Dataset pages + this historical record | Page content owns dataset teaching |
| A repository/project page was confused with the implementation actually meant by the owner | **Yes** | Verify repository role and exact implementation path before assigning authority | `CONTRIBUTING.md` + root `AGENTS.md` | The code-source rule already existed; startup routing was missing |
| Public/legacy GDKVM code was initially treated as a comparison oracle | Yes, same failure family | Historical/public code is not automatically the metric oracle; trace the intended evaluator version | `reference/metrics_v1/README.md` + `AGENTS.md` | Metric migration needs an explicit authority rule |
| GPU was considered before metric semantics were fully frozen | No | Use a CPU oracle first; GPU is for equivalence/performance after semantics freeze | `reference/metrics_v1/README.md` | This is a metric-maintenance rule |
| HD95 appeared after ASD | No | Teach HD → HD95 → ASD by conceptual dependency | Metrics spec/page + this record | Presentation should reflect mathematical relationships |
| Formula text was not enough | No | Use KaTeX and the four-part teaching contract | `CONTRIBUTING.md` + `AGENTS.md` | Future metric contributions need the same structure |
| AUC-like metrics were mixed conceptually with segmentation metrics | No | Organize metrics by task family and distinguish thresholded vs ranking metrics | Reference Metrics v1.1 | Scientific semantics belong in the metric authority |
| Historical agreement code had implicit sign / SD choices | No | Pin difference direction, SD convention, units, and LoA formula | Reference Metrics v1.1 | Prevents same-name/different-number results |
| Public standard page centered GDKVM / OSA | No | Community standards must be field-neutral | `CONTRIBUTING.md`, `reference/metrics_v1/README.md`, `AGENTS.md` | This is a durable editorial rule |
| Shell / quoting failures recurred | **Yes** | Do not assume Bash; switch to structured edits after first parser/quoting failure | root `AGENTS.md` | Startup-level execution safety |
| Generated cache briefly entered a commit candidate | No | Inspect status before commit; exclude generated files | root `AGENTS.md` + existing `.gitignore` | Use-site check plus existing enforcement |
| `main` moved repeatedly under concurrent work | Recurrent environment fact | Resolve exact live main before branch and re-check before merge | root `AGENTS.md` | Future Agents need this before any write |

## Repeated-mistake check

Two failure families were repeated enough to require a routing fix rather than another reminder:

1. **Repository / implementation identity.** The repository already had a curation rule distinguishing project pages from runnable code, but metric-standardization work could still miss it because no root agent entrypoint routed maintainers to that rule. The closeout adds that route and extends the same principle to evaluator-version authority.
2. **Shell / quoting assumptions.** Parser and quoting friction occurred more than once. The durable fix is a startup rule: do not assume Bash on the remote Mac, and move to structured file tools after the first quoting failure.

The user's field-neutrality correction was not a repeated mistake in this conversation. The fix is nevertheless promoted because a public benchmark can easily drift back toward self-referential examples.

## Future-Agent test

A new Agent starting from root `AGENTS.md` should now be able to answer before acting:

- Where is paper/code-status authority? → `CONTRIBUTING.md` / `src/papers.ts`.
- Where is metric authority? → `reference/metrics_v1/README.md` and the CPU reference implementation.
- Can a public or older repo silently become the metric oracle? → No; trace the exact evaluator version/call path.
- Can a GPU implementation redefine the metric? → No; it must match the CPU reference.
- Can benchmark prose center the project's own papers? → No; normative guidance stays field-neutral.
- What should happen after a Fish/Bash quoting failure? → Use explicit Bash or structured edits rather than repeating fragile quoting.
- What live state must be refreshed? → exact current `main` before branch creation and before merge.

## Intentionally not promoted

The following were useful while executing but are not durable knowledge:

- one-time PR/head/merge SHA values;
- Vercel Preview URLs and deployment IDs;
- temporary worktree paths;
- process IDs and local ports;
- transient CI waiting states;
- one-time dependency download/cache state.

The durable deployment fact is only that the repository's current deployment contract lives in `.github/workflows/deploy.yml`, including the same-repository Preview secret boundary.
