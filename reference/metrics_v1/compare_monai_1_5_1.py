"""CPU audit: Reference Metrics v1.1 segmentation semantics vs MONAI 1.5.1.

No GPU is used. This script exists to pin the historical semantics of the later
private GDKVM evaluator and to document the deliberate v1 empty-mask override.
"""

from __future__ import annotations

import json
import math
import warnings
from pathlib import Path

import monai
import numpy as np
import torch
from monai.metrics import compute_average_surface_distance, compute_hausdorff_distance

from reference_metrics import evaluate_case


def t(mask: np.ndarray) -> torch.Tensor:
    return torch.as_tensor(mask, dtype=torch.float32, device="cpu")[None, None]


def fixture_cases():
    cases = {}

    a = np.zeros((32, 32), dtype=bool)
    a[8:24, 8:24] = True
    cases["identical_square"] = (a.copy(), a.copy(), (1.0, 1.0), "px")

    gt = np.zeros((12, 12), dtype=bool)
    pred = np.zeros_like(gt)
    gt[5, 5] = True
    pred[5, 6] = True
    cases["single_pixel_x_shift"] = (pred, gt, (1.0, 1.0), "px")

    gt = np.zeros((12, 12), dtype=bool)
    pred = np.zeros_like(gt)
    gt[5, 5] = True
    pred[6, 5] = True
    cases["anisotropic_y_shift"] = (pred, gt, (2.0, 0.5), "mm")

    gt = np.zeros((32, 32), dtype=bool)
    gt[8:24, 8:24] = True
    pred = gt.copy()
    pred[2, 2] = True
    cases["isolated_outlier"] = (pred, gt, (1.0, 1.0), "px")

    gt = np.zeros((32, 32), dtype=bool)
    gt[6:26, 6:26] = True
    pred = np.zeros_like(gt)
    pred[9:23, 10:22] = True
    cases["nested_rectangles"] = (pred, gt, (0.8, 0.6), "mm")

    gt = np.zeros((20, 30), dtype=bool)
    gt[6:14, 9:21] = True
    pred = np.zeros_like(gt)
    cases["prediction_empty"] = (pred, gt, (1.0, 1.0), "px")

    empty = np.zeros((20, 30), dtype=bool)
    cases["both_empty"] = (empty.copy(), empty.copy(), (1.0, 1.0), "px")

    return cases


def scalar(x: torch.Tensor) -> float:
    return float(x.detach().cpu().reshape(-1)[0].item())


def finite_or_string(x: float):
    if math.isnan(x):
        return "NaN"
    if math.isinf(x):
        return "Infinity" if x > 0 else "-Infinity"
    return x


def main():
    assert monai.__version__ == "1.5.1", monai.__version__
    assert not torch.cuda.is_available() or torch.tensor(0).device.type == "cpu"

    report = {
        "runtime": {
            "monai": monai.__version__,
            "torch": torch.__version__,
            "device": "cpu",
        },
        "cases": {},
    }

    normal_max_abs_diff_hd95 = 0.0
    normal_max_abs_diff_asd = 0.0
    normal_cases = 0

    for name, (pred, gt, spacing, unit) in fixture_cases().items():
        ref = evaluate_case(pred, gt, spacing=spacing, distance_unit=unit)

        with warnings.catch_warnings(record=True) as ws:
            warnings.simplefilter("always")
            monai_hd95 = scalar(
                compute_hausdorff_distance(
                    t(pred),
                    t(gt),
                    include_background=False,
                    percentile=95,
                    directed=False,
                    spacing=spacing,
                )
            )
            monai_asd = scalar(
                compute_average_surface_distance(
                    t(pred),
                    t(gt),
                    include_background=False,
                    symmetric=True,
                    spacing=spacing,
                )
            )

        row = {
            "reference": {
                "status": ref.status,
                "hd95": finite_or_string(ref.hd95),
                "asd": finite_or_string(ref.asd),
            },
            "monai_1_5_1": {
                "hd95": finite_or_string(monai_hd95),
                "asd": finite_or_string(monai_asd),
                "warnings": [str(w.message) for w in ws],
            },
        }

        if ref.status == "ok":
            row["abs_diff"] = {
                "hd95": abs(ref.hd95 - monai_hd95),
                "asd": abs(ref.asd - monai_asd),
            }
            normal_max_abs_diff_hd95 = max(normal_max_abs_diff_hd95, row["abs_diff"]["hd95"])
            normal_max_abs_diff_asd = max(normal_max_abs_diff_asd, row["abs_diff"]["asd"])
            normal_cases += 1

        report["cases"][name] = row

    report["summary"] = {
        "normal_cases_compared": normal_cases,
        "max_abs_diff_hd95": normal_max_abs_diff_hd95,
        "max_abs_diff_asd": normal_max_abs_diff_asd,
        "normal_semantics_match": normal_max_abs_diff_hd95 < 1e-6 and normal_max_abs_diff_asd < 1e-6,
        "empty_policy_intentionally_differs": True,
    }

    out = Path(__file__).with_name("monai_1_5_1_cpu_audit.json")
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
