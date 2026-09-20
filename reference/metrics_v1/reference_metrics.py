"""Awesome Echocardiography Reference Metrics v1.

Normative CPU reference implementation for 2-D binary echocardiography
segmentation metrics. The implementation is intentionally small and explicit.

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
            raise ValueError("Reference Metrics v1 requires empty_policy='image_diagonal'.")
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


def lvef_error_summary(pred_percent: Sequence[float], gt_percent: Sequence[float]) -> dict[str, float | int]:
    """Summarize LVEF prediction error in percentage points."""
    p = np.asarray(pred_percent, dtype=np.float64)
    g = np.asarray(gt_percent, dtype=np.float64)
    if p.shape != g.shape:
        raise ValueError("pred_percent and gt_percent must have the same shape.")
    valid = np.isfinite(p) & np.isfinite(g)
    if not valid.any():
        return {"n": 0, "mae_pp": float("nan"), "bias_pp": float("nan"), "sd_pp": float("nan"),
                "loa_low_pp": float("nan"), "loa_high_pp": float("nan"), "pearson_r": float("nan")}
    p, g = p[valid], g[valid]
    err = p - g
    bias = float(err.mean())
    sd = float(err.std(ddof=0))
    r = float(np.corrcoef(p, g)[0, 1]) if len(p) > 1 and p.std() > 0 and g.std() > 0 else float("nan")
    return {
        "n": int(len(p)),
        "mae_pp": float(np.abs(err).mean()),
        "bias_pp": bias,
        "sd_pp": sd,
        "loa_low_pp": bias - 1.96 * sd,
        "loa_high_pp": bias + 1.96 * sd,
        "pearson_r": r,
    }
