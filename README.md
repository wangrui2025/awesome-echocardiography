# Awesome Echocardiography

A curated collection of papers, datasets, and reproducible evaluation resources for artificial intelligence in echocardiography.

> **v0.1** — intentionally small. The public collection currently includes three papers and two datasets, while the project is also establishing an executable evaluation standard.

## Papers

### Echocardiography Video Segmentation

- **OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement**  
  Rui Wang, Huisi Wu, Jing Qin — **CVPR 2026 Highlight**  
  [Paper](https://openaccess.thecvf.com/content/CVPR2026/html/Wang_OSA_Echocardiography_Video_Segmentation_via_Orthogonalized_State_Update_and_Anatomical_CVPR_2026_paper.html) · [Code](https://github.com/wangrui2025/osa) · [Project](https://wangrui2025.github.io/osa/en/)

- **GDKVM: Echocardiography Video Segmentation via Spatiotemporal Key-Value Memory with Gated Delta Rule**  
  Rui Wang, Yimu Sun, Jingxing Guo, Huisi Wu, Jing Qin — **ICCV 2025**  
  [Paper](https://openaccess.thecvf.com/content/ICCV2025/html/Wang_GDKVM_Echocardiography_Video_Segmentation_via_Spatiotemporal_Key-Value_Memory_with_Gated_ICCV_2025_paper.html) · [Code](https://github.com/wangrui2025/GDKVM) · [Project](https://wangrui2025.github.io/GDKVM/en/)

- **MemSAM: Taming Segment Anything Model for Echocardiography Video Segmentation**  
  Xiaolong Deng, Huisi Wu, Runhao Zeng, Jing Qin — **CVPR 2024 Oral**  
  [Paper](https://openaccess.thecvf.com/content/CVPR2024/html/Deng_MemSAM_Taming_Segment_Anything_Model_for_Echocardiography_Video_Segmentation_CVPR_2024_paper.html) · [Code](https://github.com/dengxl0520/MemSAM)

## Datasets

- **CAMUS — Cardiac Acquisitions for Multi-structure Ultrasound Segmentation**  
  2D apical two-chamber and four-chamber echocardiography sequences from 500 patients, with expert annotations for cardiac structure segmentation and functional assessment.  
  [Dataset](https://www.creatis.insa-lyon.fr/Challenge/camus/) · [Paper](https://doi.org/10.1109/TMI.2019.2900516) · [Dataset guide](https://awesome-echocardiography.vercel.app/datasets/camus/)

- **EchoNet-Dynamic**  
  10,030 apical four-chamber echocardiography videos with measurements and expert left-ventricular tracings, introduced for video-based cardiac function assessment.  
  [Dataset](https://echonet.github.io/dynamic/) · [Paper](https://doi.org/10.1038/s41586-020-2145-8) · [Code](https://github.com/echonet/dynamic) · [Dataset guide](https://awesome-echocardiography.vercel.app/datasets/echonet-dynamic/)

## Reference Metrics v1.0

The repository includes an executable consistency standard for **Dice · IoU · HD · HD95 · symmetric ASD · LVEF reporting**.

The CPU reference implementation is the semantic authority. Accelerated CPU/GPU implementations should reproduce it rather than redefine the metric.

Key choices include:

- HD95 = max(Q95(P→G), Q95(G→P));
- symmetric ASD = mean(concat(D(P→G), D(G→P)));
- physical spacing in mm when available, otherwise explicitly reported px;
- an explicit one-empty-mask field-of-view diagonal penalty instead of silently dropping NaN failures;
- item-level aggregation independent of batch size or GPU partitioning;
- LVEF in %, with prediction error in percentage points.

See [the full v1 specification](reference/metrics_v1/README.md), the [reference implementation](reference/metrics_v1/reference_metrics.py), and the [metrics guide](https://awesome-echocardiography.vercel.app/metrics/).

The frozen CPU audit shows 5/5 normal non-empty fixtures matching MONAI 1.5.1 semantics within <1e-6, while deliberately replacing ambiguous empty-mask behavior.

## Website

The bilingual static website is built with Astro:

- Chinese default: https://awesome-echocardiography.vercel.app/
- English: https://awesome-echocardiography.vercel.app/en/
- Metrics standard: https://awesome-echocardiography.vercel.app/metrics/

## Scope

The project is being built incrementally. Broader coverage will be added only after the curation and evaluation contracts are stable.

## Contributing

Paper suggestions should use the structured [paper submission form](https://github.com/wangrui2025/awesome-echocardiography/issues/new?template=paper.yml), which separates project pages from actual implementation repositories and records code-status evidence. General site issues and focused pull requests are also welcome. Proposed benchmark or metric implementations should include reproducible fixtures and document any deviation from Reference Metrics v1.

## Curation and code-status policy

This is a curated research index, not an exhaustive bibliography. Important echocardiography work may be included even without public code. Repository links are verified separately from code availability: placeholder or “coming soon” repositories are not labeled as released code. See [CONTRIBUTING.md](CONTRIBUTING.md) for the status definitions and review rules.
