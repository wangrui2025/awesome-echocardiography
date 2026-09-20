# Contributing to Awesome Echocardiography

Awesome Echocardiography is a **curated** research index, not an exhaustive bibliography. We prioritize work that is directly relevant to echocardiography, scientifically useful to the community, and clearly documented.

## What belongs here

A paper, dataset, model, benchmark, or tool may be included when it is directly relevant to echocardiography and is useful as a research reference. Publication venue, scientific contribution, benchmark relevance, community use, and reproducibility all matter, but no single signal is an automatic admission rule.

The project does **not** require every included paper to have public code. Important work without code can still be listed.

## Code availability is verified, not inferred from a link

A repository URL alone does **not** count as released code.

We use the following states:

- **Code available** — the public repository contains the core implementation needed to meaningfully run, train, evaluate, or reproduce the method.
- **Partial code** — useful implementation is public, but important parts required for faithful reproduction are still missing.
- **Code announced** — an official repository exists, but it is a placeholder, says “coming soon”, or does not yet contain the paper's core runnable implementation.
- **No public code** — no official public implementation was found.
- **Unofficial implementation** — a third-party reproduction exists, but it is not the authors' official release.

Weights, training scripts, preprocessing, inference/evaluation code, configs, and environment instructions are recorded separately when useful. A README claim such as “code available” is not sufficient by itself; the repository contents should support the status.

## Status verification

Code status is a time-sensitive fact. Each status should include a verification date and may be updated when a repository changes.

### Required repository-source check

Do **not** assume that the first GitHub link attached to a paper is the implementation repository. Before assigning a code status:

1. verify the paper identity and its official publication page;
2. inspect the linked repository's actual file tree, not only its README or badges;
3. search GitHub using the exact paper title and method name;
4. inspect the first/corresponding authors' and lab/organization's other public repositories for a separate implementation repository;
5. distinguish project/page repositories, implementation repositories, dataset repositories, and third-party reproductions;
6. check for runnable training, inference/evaluation, configs, dependencies, preprocessing, and weights as appropriate;
7. record the verification date and any missing components.

If the paper says “code available” but the linked repository is empty, a placeholder, or “coming soon”, the repository's current contents determine our status. If a separate real implementation repository exists, link that implementation repository instead of the project-page repository.

When proposing a status change, please include:
1. the verified implementation repository URL;
2. any separate project/page or dataset repository URL that could be confused with it;
3. what runnable components are actually present;
4. what important components are still missing, if any;
5. the date checked.

## Pull requests

Keep additions focused. A useful PR should explain why the resource belongs in an echocardiography research index and provide authoritative links. Please avoid bulk-generated bibliography additions without manual review.
