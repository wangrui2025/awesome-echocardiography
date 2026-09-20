# Candidate Paper Code Audit

Last verified: **2026-09-20**

This file records code-availability verification for candidate papers before any editorial decision to add them to the public paper list. **Audit status is not an inclusion decision.**

## Verification method

For every paper we check more than the repository linked by the paper:

1. confirm the paper identity and official publication page;
2. inspect the linked repository's actual file tree;
3. search GitHub by the exact paper title and method name;
4. search the first/corresponding author's and lab/organization's other public repositories;
5. distinguish the project/page repository, implementation repository, dataset repository, and third-party reproductions;
6. verify runnable components such as training, inference/evaluation, configs, dependencies, preprocessing, and weights;
7. record missing components and the verification date.

A paper or publisher saying “code available” does not override the repository's actual state.

## Audited candidates

### EchoForge — CVPR 2026

- Paper: https://openaccess.thecvf.com/content/CVPR2026/html/Fang_Semi-supervised_Echocardiography_Video_Segmentation_via_Anchor_Semantic_Awareness_and_Continuous_CVPR_2026_paper.html
- Official repository: https://github.com/YunPeng-Fang/EchoForge
- **Status: Code announced**
- Evidence: the repository currently contains README.md and assets; the README explicitly says **“The code is coming soon.”**
- Alternate-repository check: the author's public repositories were searched; no separate EchoForge implementation repository was found.
- Editorial decision: pending.

### CardiacNet — ECCV 2024

- Paper: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/3391_ECCV_2024_paper.php
- Implementation repository: https://github.com/xmed-lab/CardiacNet
- Dataset repository: https://github.com/XiaoweiXu/CardiacNet-dataset
- **Status: Code available**
- Evidence: the implementation repository contains train.py, evaluate.py, model/, data/, utils/, and requirements.yaml, with training and evaluation instructions.
- Important distinction: the CardiacNet dataset is maintained separately; the dataset repository should not be mistaken for the implementation repository.
- Editorial decision: pending.

### EchoCardMAE — MICCAI 2025

- Paper: https://papers.miccai.org/miccai-2025/0271-Paper2462.html
- Official implementation: https://github.com/m1dsolo/EchoCardMAE
- **Status: Partial code**
- Evidence: the repository includes pretrain.py, model/loss code, EchoNet-Dynamic preprocessing, EF training/validation, segmentation training, requirements, and a released pretraining checkpoint.
- Missing: the README still lists **“upload the code of CAMUS and HMC-QU”** as TODO. Therefore the repository does not yet cover faithful reproduction across all datasets reported in the paper.
- Alternate-repository check: no separate EchoCardMAE repository providing the missing CAMUS/HMC-QU code was found under the owner.
- Editorial decision: pending.

### HSS-Net — MICCAI 2025

- Paper: https://papers.miccai.org/miccai-2025/0410-Paper2745.html
- Official repository: https://github.com/DF-W/HSS-Net
- **Status: Code announced**
- Evidence: the repository currently contains only README.md and Imgs/; its Proposed Method section says **“Code coming soon!”**
- Alternate-repository check: the author's public repositories were checked. No second repository containing this echocardiography HSS-Net implementation was found.
- Name-collision warning: other unrelated projects also use the name **HSS-Net**; they must not be treated as this MICCAI paper's code.
- Editorial decision: pending.

### CoReEcho — MICCAI 2024

- Paper: https://papers.miccai.org/miccai-2024/164-Paper2916.html
- Official implementation: https://github.com/BioMedIA-MBZUAI/CoReEcho
- **Status: Code available**
- Evidence: the repository contains first- and second-stage training scripts, testing code, requirements, the coreecho/ implementation, test indexes, a pretrained checkpoint link, and CAMUS transfer-learning dataset support.
- The README marks transfer-learning code as released.
- Editorial decision: pending.

### Free-Echo — MICCAI 2024

- Paper: https://papers.miccai.org/miccai-2024/797-Paper1171.html
- Official implementation: https://github.com/gungui98/echo-free
- **Status: Code available**
- Evidence: the repository contains train.py, sample.py, the diffusion implementation, weights, example outputs, dataset layout, and training/sampling commands.
- Caveat: parts of the README installation text are rough/stale, but the core implementation is present; this is not a placeholder repository.
- Editorial decision: pending.

### Uncertainty-aware meta-weighted optimization (MLSW) — MICCAI 2024

- Paper: https://papers.miccai.org/miccai-2024/810-Paper0708.html
- Repository linked by the paper: https://github.com/Seokhwan-Oh/MLSW
- **Status: Code announced**
- Evidence: the repository currently contains only a six-byte README.md whose content is “# MLSW”; there are no runnable implementation files.
- Alternate-repository check: the author's public repositories were searched; no separate implementation for this paper was found.
- Important discrepancy: the MICCAI paper page says code is available, but the linked repository is presently only a placeholder. The repository state governs our label.
- Editorial decision: pending.

## Current audit summary

| Paper | Venue | Verified code state |
| --- | --- | --- |
| EchoForge | CVPR 2026 | Code announced |
| CardiacNet | ECCV 2024 | Code available |
| EchoCardMAE | MICCAI 2025 | Partial code |
| HSS-Net | MICCAI 2025 | Code announced |
| CoReEcho | MICCAI 2024 | Code available |
| Free-Echo | MICCAI 2024 | Code available |
| MLSW | MICCAI 2024 | Code announced |
