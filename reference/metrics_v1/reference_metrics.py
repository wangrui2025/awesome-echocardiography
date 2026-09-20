"""Awesome Echocardiography Reference Metrics v1.1.

Normative CPU reference implementation for 2-D binary echocardiography
segmentation, classification, regression, and clinical-agreement metrics. The implementation is intentionally small and explicit.

The standard is designed to match the *non-empty* mathematical semantics of the
later private GDKVM evaluator based on MONAI 1.5.1:
- surface = binary erosion XOR mask
- symmetric HD95 = max(q95(pred->gt), q95(gt->pred))
- symmetric ASD = mean(concat(pred->gt, gt->pred))

It deliberately overrides library-dependent empty-mask behavior with an
explicit finite benchmark policy.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from math import sqrt
from typing import Iterable, Sequence

import numpy as np
from scipy.ndimage import binary_erosion, distance_transform_edt
from scipy.stats import rankdata


ArrayLike = np.ndarray | Sequence[Sequence[int | bool | float]]


@dataclass(frozen=True)
class CaseMetrics:
    dice: float
    iou: float
    hd: float
    hd95: float
    asd: float
    status: str
    spacing_y: float
    spacing_x: float
    distance_unit: str

    def to_dict(self) -> dict:
        return asdict(self)


def _mask2d(mask: ArrayLike, name: str) -> np.ndarray:
    arr = np.asarray(mask)
    if arr.ndim != 2:
        raise ValueError(f"{name} must be 2-D, got shape {arr.shape}.")
    return arr.astype(bool, copy=False)


def _spacing2d(spacing: Sequence[float] | float | None) -> tuple[float, float]:
    if spacing is None:
        return (1.0, 1.0)
    if isinstance(spacing, (int, float)):
        s = float(spacing)
        if not np.isfinite(s) or s <= 0:
            raise ValueError("spacing must be finite and > 0.")
        return (s, s)
    if len(spacing) != 2:
        raise ValueError("2-D spacing must contain exactly (y, x).")
    sy, sx = float(spacing[0]), float(spacing[1])
    if not np.isfinite([sy, sx]).all() or sy <= 0 or sx <= 0:
        raise ValueError("spacing values must be finite and > 0.")
    return (sy, sx)


def surface(mask: ArrayLike) -> np.ndarray:
    """Return the 4-connected pixel surface used by MONAI's CPU path.

    scipy.ndimage.binary_erosion uses connectivity-1 by default. XOR with the
    original foreground leaves foreground pixels that touch background.
    """
    m = _mask2d(mask, "mask")
    return binary_erosion(m) ^ m


def directed_surface_distances(
    source: ArrayLike,
    target: ArrayLike,
    spacing: Sequence[float] | float | None = None,
) -> np.ndarray:
    """Nearest target-surface distance for every source-surface pixel."""
    src = surface(source)
    dst = surface(target)
    if not src.any():
        return np.empty((0,), dtype=np.float64)
    if not dst.any():
        return np.full((int(src.sum()),), np.inf, dtype=np.float64)
    sampling = _spacing2d(spacing)
    distances = distance_transform_edt(~dst, sampling=sampling)
    return np.asarray(distances[src], dtype=np.float64)


def image_diagonal_penalty(
    shape: Sequence[int],
    spacing: Sequence[float] | float | None = None,
) -> float:
    """Maximum center-to-center distance inside the 2-D field of view."""
    if len(shape) != 2:
        raise ValueError("shape must contain exactly (H, W).")
    h, w = int(shape[0]), int(shape[1])
    if h < 1 or w < 1:
        raise ValueError("shape dimensions must be >= 1.")
    sy, sx = _spacing2d(spacing)
    return sqrt(((h - 1) * sy) ** 2 + ((w - 1) * sx) ** 2)


def dice_score(pred: ArrayLike, gt: ArrayLike) -> float:
    """Dice for a single binary mask pair.

    Both-empty is not a valid positive-structure case and returns NaN so that
    an aggregator can exclude it while reporting the count explicitly.
    """
    p = _mask2d(pred, "pred")
    g = _mask2d(gt, "gt")
    if p.shape != g.shape:
        raise ValueError("pred and gt must have the same shape.")
    ps, gs = int(p.sum()), int(g.sum())
    if ps == 0 and gs == 0:
        return float("nan")
    if ps == 0 or gs == 0:
        return 0.0
    return float(2.0 * np.logical_and(p, g).sum() / (ps + gs))


def iou_score(pred: ArrayLike, gt: ArrayLike) -> float:
    """Intersection-over-Union for a single binary mask pair."""
    p = _mask2d(pred, "pred")
    g = _mask2d(gt, "gt")
    if p.shape != g.shape:
        raise ValueError("pred and gt must have the same shape.")
    union = int(np.logical_or(p, g).sum())
    if union == 0:
        return float("nan")
    return float(np.logical_and(p, g).sum() / union)


def evaluate_case(
    pred: ArrayLike,
    gt: ArrayLike,
    *,
    spacing: Sequence[float] | float | None = None,
    distance_unit: str = "px",
    empty_policy: str = "image_diagonal",
) -> CaseMetrics:
    """Evaluate one 2-D binary prediction/ground-truth pair.

    Empty-mask policy v1:
    - both empty: all metrics are NaN and status="both_empty"; exclude from
      positive-structure aggregates but report the count.
    - exactly one empty: Dice/IoU=0. Surface metrics receive the maximum
      center-to-center field-of-view diagonal and status="one_empty".
      This is a finite benchmark penalty that prevents silent NaN dropping.
    """
    p = _mask2d(pred, "pred")
    g = _mask2d(gt, "gt")
    if p.shape != g.shape:
        raise ValueError("pred and gt must have the same shape.")
    sy, sx = _spacing2d(spacing)

    p_nonempty, g_nonempty = bool(p.any()), bool(g.any())
    if not p_nonempty and not g_nonempty:
        nan = float("nan")
        return CaseMetrics(nan, nan, nan, nan, nan, "both_empty", sy, sx, distance_unit)

    if p_nonempty != g_nonempty:
        if empty_policy != "image_diagonal":
            raise ValueError("Reference Metrics v1.1 requires empty_policy='image_diagonal'.")
        penalty = image_diagonal_penalty(p.shape, (sy, sx))
        return CaseMetrics(0.0, 0.0, penalty, penalty, penalty, "one_empty", sy, sx, distance_unit)

    d_pg = directed_surface_distances(p, g, (sy, sx))
    d_gp = directed_surface_distances(g, p, (sy, sx))

    # Non-empty masks always yield non-empty surfaces in this 2-D definition.
    hd = float(max(d_pg.max(), d_gp.max()))

    # Match MONAI 1.5.1 / torch.quantile default linear interpolation semantics:
    # percentile is computed independently per direction, then the larger is HD95.
    q_pg = float(np.quantile(d_pg, 0.95, method="linear"))
    q_gp = float(np.quantile(d_gp, 0.95, method="linear"))
    hd95 = max(q_pg, q_gp)

    # Match MONAI SurfaceDistanceMetric(symmetric=True): concatenate both
    # directional surface-distance vectors, then take one mean.
    asd = float(np.concatenate([d_pg, d_gp]).mean())

    return CaseMetrics(
        dice_score(p, g),
        iou_score(p, g),
        hd,
        hd95,
        asd,
        "ok",
        sy,
        sx,
        distance_unit,
    )


def aggregate_cases(cases: Iterable[CaseMetrics]) -> dict[str, float | int]:
    """Arithmetic mean over valid case×phase×structure records.

    Both-empty records are excluded but counted. One-empty records remain in
    the mean through the explicit finite penalty.
    """
    rows = list(cases)
    valid = [x for x in rows if x.status != "both_empty"]
    if not valid:
        return {
            "n_total": len(rows),
            "n_valid": 0,
            "n_one_empty": sum(x.status == "one_empty" for x in rows),
            "n_both_empty": sum(x.status == "both_empty" for x in rows),
            "dice_mean": float("nan"),
            "iou_mean": float("nan"),
            "hd_mean": float("nan"),
            "hd95_mean": float("nan"),
            "asd_mean": float("nan"),
        }

    return {
        "n_total": len(rows),
        "n_valid": len(valid),
        "n_one_empty": sum(x.status == "one_empty" for x in rows),
        "n_both_empty": sum(x.status == "both_empty" for x in rows),
        "dice_mean": float(np.mean([x.dice for x in valid])),
        "iou_mean": float(np.mean([x.iou for x in valid])),
        "hd_mean": float(np.mean([x.hd for x in valid])),
        "hd95_mean": float(np.mean([x.hd95 for x in valid])),
        "asd_mean": float(np.mean([x.asd for x in valid])),
    }


def lvef_from_volumes(edv: float, esv: float) -> float:
    """Return LVEF in percent from end-diastolic and end-systolic volumes."""
    edv, esv = float(edv), float(esv)
    if not np.isfinite([edv, esv]).all():
        raise ValueError("EDV and ESV must be finite.")
    if edv <= 0:
        raise ValueError("EDV must be > 0.")
    if esv < 0:
        raise ValueError("ESV must be >= 0.")
    return 100.0 * (edv - esv) / edv


REFERENCE_VERSION = "1.1.0"


def _paired_finite(
    pred: Sequence[float],
    reference: Sequence[float],
) -> tuple[np.ndarray, np.ndarray]:
    """Return finite paired 1-D arrays with identical shape."""
    p = np.asarray(pred, dtype=np.float64)
    r = np.asarray(reference, dtype=np.float64)
    if p.ndim != 1 or r.ndim != 1:
        raise ValueError("pred and reference must be 1-D sequences.")
    if p.shape != r.shape:
        raise ValueError("pred and reference must have the same shape.")
    valid = np.isfinite(p) & np.isfinite(r)
    return p[valid], r[valid]


def pearson_r(pred: Sequence[float], reference: Sequence[float]) -> float:
    """Pearson correlation on finite paired values."""
    p, r = _paired_finite(pred, reference)
    if len(p) < 2 or np.std(p) == 0 or np.std(r) == 0:
        return float("nan")
    return float(np.corrcoef(p, r)[0, 1])


def regression_summary(
    pred: Sequence[float],
    reference: Sequence[float],
) -> dict[str, float | int]:
    """MAE, RMSE, Pearson r and R² for continuous predictions."""
    p, r = _paired_finite(pred, reference)
    if len(p) == 0:
        return {
            "n": 0,
            "mae": float("nan"),
            "rmse": float("nan"),
            "pearson_r": float("nan"),
            "r2": float("nan"),
        }
    err = p - r
    sst = float(np.sum((r - r.mean()) ** 2))
    r2 = float(1.0 - np.sum(err**2) / sst) if sst > 0 else float("nan")
    return {
        "n": int(len(p)),
        "mae": float(np.mean(np.abs(err))),
        "rmse": float(np.sqrt(np.mean(err**2))),
        "pearson_r": pearson_r(p, r),
        "r2": r2,
    }


def bland_altman_points(
    pred: Sequence[float],
    reference: Sequence[float],
) -> tuple[np.ndarray, np.ndarray]:
    """Return x=(pred+reference)/2 and y=pred-reference for a BA plot."""
    p, r = _paired_finite(pred, reference)
    return (p + r) / 2.0, p - r


def bland_altman_summary(
    pred: Sequence[float],
    reference: Sequence[float],
    *,
    loa_multiplier: float = 1.96,
) -> dict[str, float | int | str]:
    """Classical Bland–Altman summary.

    Reference Metrics v1.1 fixes the sign convention as:
        difference = prediction - reference

    Standard deviation uses the sample definition (ddof=1), so the conventional
    95% limits of agreement are:
        bias ± 1.96 * sample_sd

    The 1.96 rule assumes the paired differences are approximately Normal.
    """
    p, r = _paired_finite(pred, reference)
    n = int(len(p))
    if n == 0:
        return {
            "n": 0,
            "difference": "prediction-reference",
            "bias": float("nan"),
            "sample_sd": float("nan"),
            "loa_low": float("nan"),
            "loa_high": float("nan"),
        }

    diff = p - r
    bias = float(np.mean(diff))
    if n < 2:
        sd = float("nan")
        loa_low = float("nan")
        loa_high = float("nan")
    else:
        sd = float(np.std(diff, ddof=1))
        loa_low = bias - float(loa_multiplier) * sd
        loa_high = bias + float(loa_multiplier) * sd

    return {
        "n": n,
        "difference": "prediction-reference",
        "bias": bias,
        "sample_sd": sd,
        "loa_low": loa_low,
        "loa_high": loa_high,
    }


def _binary_labels_scores(
    y_true: Sequence[int | bool],
    y_score: Sequence[float],
) -> tuple[np.ndarray, np.ndarray]:
    y = np.asarray(y_true)
    s = np.asarray(y_score, dtype=np.float64)
    if y.ndim != 1 or s.ndim != 1:
        raise ValueError("y_true and y_score must be 1-D.")
    if y.shape != s.shape:
        raise ValueError("y_true and y_score must have the same shape.")
    if not np.isfinite(s).all():
        raise ValueError("y_score must contain only finite values.")
    if not np.isin(y, [0, 1, False, True]).all():
        raise ValueError("y_true must contain only binary labels 0/1.")
    return y.astype(np.int8), s


def binary_classification_at_threshold(
    y_true: Sequence[int | bool],
    y_score: Sequence[float],
    *,
    threshold: float,
) -> dict[str, float | int]:
    """Threshold-dependent binary classification metrics.

    A score >= threshold is classified as positive.
    """
    y, s = _binary_labels_scores(y_true, y_score)
    pred = s >= float(threshold)

    tp = int(np.sum((y == 1) & pred))
    fp = int(np.sum((y == 0) & pred))
    tn = int(np.sum((y == 0) & ~pred))
    fn = int(np.sum((y == 1) & ~pred))

    def ratio(num: int, den: int) -> float:
        return float(num / den) if den > 0 else float("nan")

    sensitivity = ratio(tp, tp + fn)
    specificity = ratio(tn, tn + fp)
    precision = ratio(tp, tp + fp)
    f1 = (
        float(2 * precision * sensitivity / (precision + sensitivity))
        if np.isfinite(precision)
        and np.isfinite(sensitivity)
        and (precision + sensitivity) > 0
        else float("nan")
    )

    return {
        "n": int(len(y)),
        "threshold": float(threshold),
        "tp": tp,
        "fp": fp,
        "tn": tn,
        "fn": fn,
        "sensitivity": sensitivity,
        "specificity": specificity,
        "precision": precision,
        "recall": sensitivity,
        "f1": f1,
        "accuracy": ratio(tp + tn, len(y)),
    }


def roc_auc_binary(
    y_true: Sequence[int | bool],
    y_score: Sequence[float],
) -> float:
    """Binary AUROC using the Mann–Whitney ranking identity.

    Tied scores receive average ranks, equivalent to assigning half credit for a
    positive-negative tie. At least one positive and one negative are required.
    """
    y, s = _binary_labels_scores(y_true, y_score)
    n_pos = int(np.sum(y == 1))
    n_neg = int(np.sum(y == 0))
    if n_pos == 0 or n_neg == 0:
        return float("nan")

    ranks = rankdata(s, method="average")
    rank_sum_pos = float(np.sum(ranks[y == 1]))
    u = rank_sum_pos - n_pos * (n_pos + 1) / 2.0
    return float(u / (n_pos * n_neg))


def average_precision_binary(
    y_true: Sequence[int | bool],
    y_score: Sequence[float],
) -> float:
    """Non-interpolated Average Precision (AP) for binary classification.

    AP = sum_n (R_n - R_{n-1}) P_n

    This is intentionally named AP, not generic "PR-AUC": trapezoidal area
    under the precision-recall curve is a different numerical summary.
    """
    y, s = _binary_labels_scores(y_true, y_score)
    n_pos = int(np.sum(y == 1))
    if n_pos == 0:
        return float("nan")

    order = np.argsort(-s, kind="mergesort")
    y_sorted = y[order]
    s_sorted = s[order]

    tp_cum = np.cumsum(y_sorted == 1)
    fp_cum = np.cumsum(y_sorted == 0)

    # Evaluate only after the final item of each tied-score block.
    distinct_last = np.r_[np.where(np.diff(s_sorted) != 0)[0], len(s_sorted) - 1]
    tp = tp_cum[distinct_last].astype(np.float64)
    fp = fp_cum[distinct_last].astype(np.float64)

    recall = tp / n_pos
    precision = tp / (tp + fp)
    recall_prev = np.r_[0.0, recall[:-1]]
    return float(np.sum((recall - recall_prev) * precision))


def lvef_error_summary(
    pred_percent: Sequence[float],
    gt_percent: Sequence[float],
) -> dict[str, float | int]:
    """Reference Metrics v1.1 LVEF error and agreement summary.

    LVEF values are percentages. Errors, bias, SD, and LoA are therefore in
    percentage points. Bland–Altman SD uses the sample definition (ddof=1).
    """
    p, g = _paired_finite(pred_percent, gt_percent)
    if len(p) == 0:
        return {
            "n": 0,
            "mae_pp": float("nan"),
            "rmse_pp": float("nan"),
            "bias_pp": float("nan"),
            "sd_pp": float("nan"),
            "loa_low_pp": float("nan"),
            "loa_high_pp": float("nan"),
            "pearson_r": float("nan"),
        }

    err = p - g
    ba = bland_altman_summary(p, g)
    reg = regression_summary(p, g)
    return {
        "n": int(len(p)),
        "mae_pp": float(reg["mae"]),
        "rmse_pp": float(reg["rmse"]),
        "bias_pp": float(ba["bias"]),
        "sd_pp": float(ba["sample_sd"]),
        "loa_low_pp": float(ba["loa_low"]),
        "loa_high_pp": float(ba["loa_high"]),
        "pearson_r": float(reg["pearson_r"]),
    }
