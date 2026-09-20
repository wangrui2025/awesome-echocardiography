# Awesome Echocardiography Reference Metrics v1.0

This directory is the normative, executable reference for 2-D binary echocardiography segmentation metrics used by Awesome Echocardiography.

The goal is simple: if two papers claim to report the same metric, they should be able to run the same masks through this code and obtain the same number.

## Status

**Version:** 1.0.0  
**Scope:** 2-D binary masks; Dice, IoU, HD, HD95, symmetric ASD, and LVEF-from-volumes reporting.  
**Reference implementation:** `reference_metrics.py`  
**Regression tests:** `test_reference_metrics.py`  
**MONAI compatibility audit:** `monai_1_5_1_cpu_audit.json`

The reference implementation is intentionally CPU-first. GPU implementations are welcome, but they must reproduce this reference within the declared numerical tolerance before they are called compliant.

## 1. Evaluation item

The atomic evaluation item is **one prediction mask and one ground-truth mask for one image/frame, structure, view, and phase**.

Do not let batch size, number of GPUs, or distributed-worker boundaries change metric weighting.

For echocardiography, reports should preserve the relevant axes instead of silently collapsing them:

- dataset;
- structure (for example LV endocardium, LV epicardium, LA);
- view (for example A2C, A4C);
- phase/frame (for example ED, ES).

A global mean may be added, but the grouped results remain part of the report.

## 2. Binary masks and post-processing

Metric inputs are already-binarized masks with identical 2-D shape.

Thresholding, resize/interpolation, connected-component filtering, temporal frame selection, and other post-processing are **outside** the metric definition. They must be reported as part of the experimental protocol.

## 3. Region metrics

For foreground sets `P` and `G`:

```text
Dice = 2 |P ∩ G| / (|P| + |G|)
IoU  = |P ∩ G| / |P ∪ G|
```

Empty behavior:

- both empty: **N/A** (`NaN`) and counted as `both_empty`;
- exactly one empty: Dice = 0, IoU = 0.

Both-empty cases are excluded from the positive-structure mean but their count must be reported.

## 4. Surface definition

For normal non-empty masks, v1 uses the same pixel-surface semantics as the MONAI 1.5.1 CPU path:

```text
surface(mask) = binary_erosion(mask) XOR mask
```

SciPy's default connectivity-1 erosion is used. For 2-D masks this corresponds to the four-connected erosion neighborhood.

Let:

- `D(P→G)` be the nearest ground-truth-surface distance for every prediction-surface pixel;
- `D(G→P)` be the reverse direction.

Distances are Euclidean.

## 5. HD, HD95, and symmetric ASD

### HD

```text
HD = max(max D(P→G), max D(G→P))
```

### HD95

**Important:** v1 does not pool both directions before taking the percentile.

```text
HD95 = max(
  Q_0.95(D(P→G)),
  Q_0.95(D(G→P))
)
```

`Q_0.95` uses linear quantile interpolation, matching the default `torch.quantile` semantics used by MONAI 1.5.1.

### ASD

v1 uses the later-GDKVM / MONAI symmetric surface-distance semantics:

```text
ASD = mean(concat(D(P→G), D(G→P)))
```

This is a **surface-point-count-weighted** symmetric mean. It is not necessarily equal to:

```text
(mean D(P→G) + mean D(G→P)) / 2
```

when the two surfaces contain different numbers of pixels.

## 6. Spacing and units

For 2-D masks, spacing is ordered as:

```text
(y_spacing, x_spacing)
```

Rules:

- if physical spacing is available, use it and report distances in **mm**;
- if spacing is unavailable, use `(1, 1)` and label the result **px**;
- never relabel a pixel distance as millimetres;
- after resizing an image, update the physical spacing consistently;
- do not average distance metrics expressed in different units.

## 7. Empty-mask policy

Library defaults are not the benchmark definition.

### Both masks empty

There is no positive structure to compare:

- Dice / IoU / HD / HD95 / ASD = N/A;
- exclude from the positive-structure mean;
- report `n_both_empty`.

### Exactly one mask empty

This is a complete detection/segmentation miss and must not disappear from the mean.

v1 assigns a finite field-of-view penalty:

```text
penalty = sqrt(((H - 1) * y_spacing)^2 + ((W - 1) * x_spacing)^2)
```

Then:

- Dice = 0;
- IoU = 0;
- HD = penalty;
- HD95 = penalty;
- ASD = penalty;
- increment `n_one_empty`.

This deliberately differs from MONAI 1.5.1's default percentile-Hausdorff empty behavior, which can yield `NaN`, while symmetric surface distance can yield `Infinity`.

## 8. Aggregation

The reference aggregate is the arithmetic mean over valid atomic evaluation items.

- one-empty items remain in the mean via the explicit penalty;
- both-empty items are excluded and counted;
- aggregate across actual items, **not averages of batches or GPUs**.

Every published aggregate should include at least:

```text
n_total
n_valid
n_one_empty
n_both_empty
```

For scientific reporting, also provide distribution summaries such as mean ± SD or median [IQR] as appropriate.

## 9. LVEF

LVEF is a clinical quantity, not a mask-similarity metric:

```text
LVEF (%) = 100 * (EDV - ESV) / EDV
```

The method used to obtain EDV and ESV is part of the experimental protocol and is **not** hidden inside the LVEF metric. For example, single-plane area-length and biplane Simpson methods are different protocols and must be named.

For LVEF prediction, v1 reports errors in **percentage points (pp)**:

- MAE (pp);
- bias = prediction − ground truth (pp);
- SD of the errors (pp);
- optional 95% limits of agreement = bias ± 1.96 SD;
- Pearson `r` may be reported, but should not replace an error metric.

## 10. Compatibility audit

The CPU audit compares this reference with MONAI 1.5.1 on deterministic synthetic masks.

Observed on 2026-09-20:

- 5/5 non-empty fixtures matched;
- maximum absolute HD95 difference: about `2.3e-7`;
- maximum absolute ASD difference: about `2.1e-7`;
- MONAI 1.5.1 returned `NaN` for HD95 and `Infinity` for ASD on a prediction-empty / ground-truth-nonempty fixture;
- v1 intentionally replaces that ambiguous library behavior with the explicit field-of-view penalty above.

The audit is CPU-only and does not require a GPU.

## 11. Compliance

An accelerated CPU or GPU implementation may call itself **Awesome Echocardiography Reference Metrics v1 compliant** only if:

1. it matches the normal-case reference fixtures within absolute tolerance `1e-6`;
2. it implements the same surface, directional-HD95, pooled-symmetric-ASD, spacing, empty-mask, and aggregation semantics;
3. it passes the public regression suite;
4. it declares any additional preprocessing outside the metric implementation.

Performance optimizations must not change the metric meaning.

## Run the reference tests

```bash
cd reference/metrics_v1
python -m pip install -r requirements.txt
python -m unittest -v test_reference_metrics.py
```

## Re-run the MONAI 1.5.1 audit

Install MONAI 1.5.1 and PyTorch in a CPU-capable environment, then:

```bash
python compare_monai_1_5_1.py
```

The generated `monai_1_5_1_cpu_audit.json` records the comparison.
