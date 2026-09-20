# Awesome Echocardiography Reference Metrics v1.1

This directory is the normative, executable reference for evaluation metrics used by Awesome Echocardiography.

The goal is simple: if two papers claim to report the same metric, they should be able to feed the same predictions and references into this code and obtain the same number.

## Status

**Version:** 1.1.0
**Scope:** 2-D binary segmentation, binary classification, continuous regression / cardiac-function prediction, and clinical agreement.
**Reference implementation:** `reference_metrics.py`
**Regression tests:** `test_reference_metrics.py`
**MONAI segmentation compatibility audit:** `monai_1_5_1_cpu_audit.json`

The implementation is intentionally CPU-first. Faster CPU/GPU implementations are welcome, but they must reproduce this reference within the declared numerical tolerance before they are called compliant.

## What changed from v1.0

v1.0 fixed Dice, IoU, HD, HD95, symmetric ASD, spacing, empty-mask, aggregation, and basic LVEF reporting.

v1.1 preserves those segmentation semantics and adds:

- threshold-dependent classification metrics: sensitivity/recall, specificity, precision, F1, accuracy;
- threshold-free binary ranking metrics: AUROC and non-interpolated Average Precision (AP);
- continuous prediction metrics: MAE, RMSE, Pearson `r`, and R²;
- a normative Bland–Altman agreement protocol;
- an explicit **prediction − reference** difference direction;
- **sample SD (`ddof=1`)** for Bland–Altman limits of agreement;
- LVEF error/agreement reporting in percentage points.

The sample-SD choice is intentionally more explicit than historical experiment code that used NumPy's default `std()` (`ddof=0`). Published historical numbers remain historical evidence; v1.1 defines the standard for future comparable evaluation.

---

# A. Segmentation

## A1. Atomic evaluation item

The atomic segmentation item is **one prediction mask and one ground-truth mask for one image/frame, structure, view, and phase**.

Do not let batch size, number of GPUs, or distributed-worker boundaries change metric weighting.

Preserve relevant axes before any global mean:

- dataset;
- structure (for example LV endocardium, LV epicardium, LA);
- view (for example A2C, A4C);
- phase/frame (for example ED, ES).

## A2. Binary masks and post-processing

Metric inputs are already-binarized masks with identical 2-D shape.

Thresholding, resize/interpolation, connected-component filtering, temporal frame selection, and other post-processing are **outside** the metric definition. They must be reported as part of the experimental protocol.

## A3. Dice and IoU

For foreground sets `P` and `G`:

```text
Dice = 2 |P ∩ G| / (|P| + |G|)
IoU  = |P ∩ G| / |P ∪ G|
```

Empty behavior:

- both empty: **N/A** (`NaN`) and counted as `both_empty`;
- exactly one empty: Dice = 0, IoU = 0.

Do not import smoothing constants from a training Dice loss into the benchmark Dice metric.

## A4. Surface definition

For normal non-empty masks, v1.1 preserves the MONAI 1.5.1-compatible 2-D pixel-surface semantics:

```text
surface(mask) = binary_erosion(mask) XOR mask
```

SciPy's default connectivity-1 erosion is used. In 2-D this corresponds to the four-connected erosion neighborhood.

Let:

- `D(P→G)` be the nearest ground-truth-surface distance for every prediction-surface pixel;
- `D(G→P)` be the reverse direction.

Distances are Euclidean.

## A5. HD → HD95 → ASD

### HD

```text
HD = max(max D(P→G), max D(G→P))
```

### HD95

HD95 immediately follows HD because it is its robust percentile variant.

```text
HD95 = max(
  Q_0.95(D(P→G)),
  Q_0.95(D(G→P))
)
```

The percentile is computed **separately in both directions**, then the larger value is used. `Q_0.95` uses linear interpolation.

### Symmetric ASD

```text
ASD = mean(concat(D(P→G), D(G→P)))
```

This is a surface-point-count-weighted pooled symmetric mean. It is not necessarily equal to:

```text
(mean D(P→G) + mean D(G→P)) / 2
```

when the two surfaces contain different numbers of pixels.

## A6. Spacing and units

For 2-D masks, spacing is ordered as:

```text
(y_spacing, x_spacing)
```

Rules:

- if physical spacing is available, use it and report distance metrics in **mm**;
- if spacing is unavailable, use `(1, 1)` and report **px**;
- never relabel a pixel distance as millimetres;
- after resizing an image, update the physical spacing consistently;
- do not average distance metrics expressed in different units.

## A7. Empty-mask policy

Library defaults are not the benchmark definition.

### Both masks empty

There is no positive structure to compare:

- Dice / IoU / HD / HD95 / ASD = N/A;
- exclude from the positive-structure mean;
- report `n_both_empty`.

### Exactly one mask empty

This is a complete miss and must not disappear from the mean.

v1.1 preserves the v1.0 finite field-of-view penalty:

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

This deliberately avoids library-dependent NaN/Infinity reduction behavior.

## A8. Aggregation

Aggregate over actual atomic items, **not averages of batches or GPUs**.

Every published segmentation aggregate should include at least:

```text
n_total
n_valid
n_one_empty
n_both_empty
```

Grouped results by dataset / structure / view / phase should remain available even when a global mean is added.

---

# B. Binary classification / diagnosis

Classification uses a binary reference label `y ∈ {0,1}` and a **continuous model score** `s`.

## B1. Threshold-dependent metrics

A declared threshold `t` converts a score into a prediction:

```text
predicted positive ⇔ score >= t
```

Then:

```text
Sensitivity / Recall = TP / (TP + FN)
Specificity          = TN / (TN + FP)
Precision            = TP / (TP + FP)
F1                   = 2 * Precision * Recall / (Precision + Recall)
Accuracy             = (TP + TN) / N
```

Rules:

- always report the threshold or threshold-selection procedure;
- do not compare threshold-dependent numbers obtained from different hidden threshold-selection protocols;
- if a denominator is zero, the corresponding metric is N/A rather than silently forced to 0 or 1.

## B2. AUROC

Reference v1.1 computes binary AUROC from continuous scores using the Mann–Whitney ranking identity.

Interpretation:

```text
AUROC =
P(score_positive > score_negative)
+ 0.5 * P(score_positive = score_negative)
```

Rules:

- use continuous scores, not already-thresholded 0/1 predictions;
- tied positive-negative scores receive half credit;
- AUROC is N/A when the evaluation set contains only one class;
- report the evaluated population and prevalence.

## B3. Precision–Recall summary: Average Precision (AP)

Many papers loosely write “AUPRC”. Different numerical integrations of a PR curve are not identical.

Reference v1.1 recommends **non-interpolated Average Precision (AP)** as the scalar PR summary:

```text
AP = Σ_n (R_n - R_{n-1}) P_n
```

where `P_n` and `R_n` are precision and recall at score thresholds.

Rules:

- call this scalar **AP**;
- if trapezoidal PR-AUC is used instead, label it explicitly as trapezoidal PR-AUC;
- do not silently call AP and trapezoidal PR-AUC the same number;
- for strongly imbalanced diagnosis tasks, report AP/PR information alongside AUROC rather than relying on AUROC alone.

---

# C. Continuous prediction and cardiac function

## C1. MAE

```text
MAE = mean(|prediction - reference|)
```

MAE is in the **same unit as the target**.

## C2. RMSE

```text
RMSE = sqrt(mean((prediction - reference)^2))
```

RMSE penalizes large errors more strongly than MAE and uses the same target unit.

## C3. Pearson correlation

```text
r =
Σ (p_i - p̄)(g_i - ḡ)
/
sqrt(Σ(p_i-p̄)^2 Σ(g_i-ḡ)^2)
```

Pearson `r` describes linear association, **not agreement**.

A high `r` can coexist with a clinically important systematic bias.

## C4. R²

```text
R² = 1 - Σ(prediction - reference)^2 / Σ(reference - reference_mean)^2
```

R² is N/A when the reference has zero variance.

Do not confuse Pearson `r`, `r²`, and regression R².

## C5. LVEF

LVEF is a clinical quantity, not a mask-similarity metric:

```text
LVEF (%) = 100 * (EDV - ESV) / EDV
```

The method used to obtain EDV and ESV is a separate protocol and must be named. Examples include biplane Simpson / Method of Disks, single-plane methods, or clinically provided volumes.

For LVEF prediction:

- LVEF itself is in `%`;
- MAE / RMSE / bias / SD / limits of agreement are in **percentage points (pp)**;
- correlation may supplement, but must not replace, error/agreement metrics.

---

# D. Clinical agreement: Bias and Bland–Altman

Clinical measurement studies commonly report correlation, bias ± SD, and Bland–Altman agreement. Reference v1.1 turns these widely used reporting patterns into an explicit, reproducible protocol.

## D1. Difference direction

The sign convention is fixed:

```text
difference_i = prediction_i - reference_i
```

Positive bias therefore means the model tends to **overestimate** the reference. Negative bias means underestimation.

A paper using the opposite sign is not “wrong”, but must declare the sign explicitly and cannot compare signed bias values without conversion.

## D2. Bias

```text
bias = mean(difference_i)
```

Bias is a systematic offset, in the original measurement unit.

For LVEF, bias is in percentage points.

## D3. Standard deviation of paired differences

Reference v1.1 uses the **sample standard deviation**:

```text
s_d = sqrt( Σ(d_i - bias)^2 / (n - 1) )
```

This is intentionally `ddof=1`.

## D4. 95% Limits of Agreement

Under the conventional approximately-Normal-differences assumption:

```text
lower LoA = bias - 1.96 * s_d
upper LoA = bias + 1.96 * s_d
```

LoA describe expected **individual-level disagreement**, not uncertainty of the mean bias.

For small samples or formal method-comparison studies, confidence intervals around the bias and LoA should also be considered.

## D5. Bland–Altman plot

For each paired subject:

```text
x_i = (prediction_i + reference_i) / 2
y_i = prediction_i - reference_i
```

Plot `y_i` against `x_i`, with horizontal lines at:

- bias;
- lower 95% LoA;
- upper 95% LoA.

Recommended plot/report metadata:

- n paired subjects;
- difference direction;
- unit;
- bias;
- sample SD;
- lower / upper LoA;
- any excluded/non-finite pairs;
- whether differences show proportional bias or changing variance across the measurement range.

**Correlation and Bland–Altman answer different questions:** correlation asks whether values move together; Bland–Altman asks whether the two measurements agree closely enough.

---

# E. Compatibility and historical evidence

## E1. Segmentation audit

The frozen CPU audit compares the v1 segmentation reference with MONAI 1.5.1 on deterministic synthetic masks.

Observed on 2026-09-20:

- 5/5 non-empty fixtures matched;
- maximum absolute HD95 difference: about `2.3e-7`;
- maximum absolute ASD difference: about `2.1e-7`;
- MONAI 1.5.1 returned `NaN` for HD95 and `Infinity` for ASD on a prediction-empty / ground-truth-nonempty fixture;
- the reference intentionally replaces that ambiguous behavior with the explicit field-of-view penalty.

## E2. Historical implementation audit lesson

A historical implementation audit found that different evaluation paths can silently use opposite difference directions and different SD conventions—for example, `prediction - reference` with population SD (`ddof=0`) in one path versus `reference - prediction` with sample SD (`ddof=1`) in another. This is exactly the kind of silent mismatch v1.1 is designed to prevent.

Reference v1.1 therefore treats sign convention, SD definition, units, and the upstream volume-estimation protocol as explicit parts of the evaluation contract.

Reference v1.1 **does not retroactively rewrite published numbers**. It defines the future reproducible standard:

- prediction − reference;
- sample SD (`ddof=1`);
- LoA = bias ± 1.96 sample SD;
- percentage points for LVEF differences.

---

# F. Compliance

An implementation may call itself **Awesome Echocardiography Reference Metrics v1.1 compliant** only if:

1. segmentation semantics match the public fixtures within absolute tolerance `1e-6`;
2. classification and regression fixtures pass exactly within normal floating-point tolerance;
3. Bland–Altman uses the declared sign convention and sample SD;
4. preprocessing and threshold-selection procedures are outside the metric and explicitly documented;
5. batch size, GPU count, and distributed partitioning do not change per-item weighting;
6. any intentional deviation is named rather than silently reusing the same metric label.

Performance optimizations must not change metric meaning.

## Run the reference tests

```bash
cd reference/metrics_v1
python -m pip install -r requirements.txt
python -m unittest -v test_reference_metrics.py
```

## Re-run the MONAI 1.5.1 segmentation audit

Install MONAI 1.5.1 and PyTorch in a CPU-capable environment, then:

```bash
python compare_monai_1_5_1.py
```

The generated `monai_1_5_1_cpu_audit.json` records the segmentation comparison.
