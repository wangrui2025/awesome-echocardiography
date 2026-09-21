# Candidate Paper Code Audit

Last verified: **2026-09-21**

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

### Echocardiography Video Segmentation via Mamba-Based Spatiotemporal Synergistic Network and Adaptive-Dynamic Learning — TMI 2026

- Paper: https://doi.org/10.1109/TMI.2026.3697520
- Author-declared repository: https://github.com/SSS666-klk/MSSNet
- **Status: Partial code**
- Evidence: the repository contains the paper-specific `SSG.py`, `RAC.py`, and `DOC.py` modules plus `requirements.txt`, but no public training entry point, evaluation/inference script, dataset pipeline, or experiment configuration sufficient for end-to-end reproduction.
- Alternate-repository check: the repository owner's public account was searched; the only method-matching repository is `SSS666-klk/MSSNet`, with no separate complete MSSNet implementation found.
- Important discrepancy: the paper states that code is available, but the current public repository exposes only part of the implementation. Repository contents govern our label.
- Editorial decision: pending.

### Robust fine-grained echocardiographic view classification with supervised contrastive learning — MedIA 2026

- Paper: https://doi.org/10.1016/j.media.2026.104006
- Official implementation: https://github.com/PreshenNaidoo/EchoFine
- Dataset: https://www.thrive-centre.com/datasets/TTE47
- Pretrained/fine-tuned model library: https://github.com/thrive-centre/EchoForge/tree/main/echoforge/classification/models/EchoView47
- **Status: Code available**
- Evidence: the repository contains the main `view_classification_with_noise.py` training/evaluation pipeline, experiment launch/orchestration utilities, downstream fine-tuning, robustness experiments, expert-agreement analysis, statistical tests, metadata/splits, and result-generation code. The README documents runnable commands and required path configuration.
- Important distinction: the TTE47 dataset and released models are separate resources. The `thrive-centre/EchoForge` model library is not the same project as the CVPR 2026 paper repository `YunPeng-Fang/EchoForge`.
- Alternate-repository check: the author's public repositories were searched; `PreshenNaidoo/EchoFine` is the paper-specific implementation repository.
- Editorial decision: pending.

### Echocardiography Video Segmentation via Neighborhood Correlation Mining — TMI 2025

- Paper: https://doi.org/10.1109/TMI.2025.3588157
- Author-declared repository: https://github.com/dengxl0520/NCMNet
- **Status: Partial code**
- Evidence: the repository contains paper-specific implementation modules including `model.py`, `ncm.py`, `uma.py`, `loss.py`, utilities, dependencies, and deformable-attention code, but it does not expose a complete training/evaluation entry point. Its README still states **“Other codes coming soon.”**
- Alternate-repository check: the author's public repositories were searched; no second complete NCM-Net implementation repository was found.
- Important discrepancy: the paper states that codes are available, but the current repository remains incomplete for end-to-end reproduction.
- Editorial decision: pending.

### EchoFM: Foundation Model for Generalizable Echocardiogram Analysis — TMI 2025

- Paper: https://doi.org/10.1109/TMI.2025.3580713
- Official implementation: https://github.com/SekeunKim/EchoFM
- Pretrained weights: https://huggingface.co/sekeun/EchoFM
- **Status: Code available**
- Evidence: the repository contains self-supervised pretraining (`main_pretrain.py`), model and pretraining-engine code, dataset loading, environment setup, tests, analysis tools, a usage notebook, cluster launch material, and documented pretraining commands. Pretrained weights are separately released on Hugging Face.
- Alternate-repository check: the author's public repositories were searched; `SekeunKim/EchoFM` is the paper-specific official implementation.
- Editorial decision: pending.

### EchoONE: Segmenting Multiple Echocardiography Planes in One Model — CVPR 2025

- Paper: https://openaccess.thecvf.com/content/CVPR2025/html/Hu_EchoONE_Segmenting_Multiple_Echocardiography_Planes_in_One_Model_CVPR_2025_paper.html
- Official implementation: https://github.com/a2502503/EchoONE
- **Status: Code available**
- Evidence: the current repository contains `train.py`, `test.py`, the EchoONE-specific model implementation under `models/segment_anything_echoone/`, configuration/data/evaluation utilities, losses, metrics, and visualization code.
- Time-sensitive note: the CVPR paper says the code **“will be available”**, but that statement reflected the publication-time state. The repository has since been populated with runnable training/testing implementation, so the current label is Code available.
- Alternate-repository check: the author's public repositories were searched; `a2502503/EchoONE` is the only EchoONE repository and contains the real implementation.
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
| MSSNet | TMI 2026 | Partial code |
| EchoFine | MedIA 2026 | Code available |
| NCM-Net | TMI 2025 | Partial code |
| EchoFM | TMI 2025 | Code available |
| EchoONE | CVPR 2025 | Code available |
