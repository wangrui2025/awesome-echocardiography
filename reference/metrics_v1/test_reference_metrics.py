import math
import unittest

import numpy as np

from reference_metrics import (
    aggregate_cases,
    directed_surface_distances,
    evaluate_case,
    image_diagonal_penalty,
    lvef_error_summary,
    lvef_from_volumes,
)


class ReferenceMetricsV1Tests(unittest.TestCase):
    def test_identical_square(self):
        gt = np.zeros((16, 16), dtype=bool)
        gt[4:12, 5:11] = True
        m = evaluate_case(gt, gt)
        self.assertEqual(m.status, "ok")
        self.assertAlmostEqual(m.dice, 1.0)
        self.assertAlmostEqual(m.iou, 1.0)
        self.assertAlmostEqual(m.hd, 0.0)
        self.assertAlmostEqual(m.hd95, 0.0)
        self.assertAlmostEqual(m.asd, 0.0)

    def test_single_pixel_shift_is_exact(self):
        gt = np.zeros((8, 8), dtype=bool)
        pred = np.zeros_like(gt)
        gt[3, 3] = True
        pred[3, 4] = True
        m = evaluate_case(pred, gt)
        self.assertEqual(m.status, "ok")
        self.assertAlmostEqual(m.dice, 0.0)
        self.assertAlmostEqual(m.iou, 0.0)
        self.assertAlmostEqual(m.hd, 1.0)
        self.assertAlmostEqual(m.hd95, 1.0)
        self.assertAlmostEqual(m.asd, 1.0)

    def test_anisotropic_spacing_is_used(self):
        gt = np.zeros((8, 8), dtype=bool)
        pred = np.zeros_like(gt)
        gt[2, 3] = True
        pred[3, 3] = True
        m = evaluate_case(pred, gt, spacing=(2.0, 0.5), distance_unit="mm")
        self.assertAlmostEqual(m.hd, 2.0)
        self.assertAlmostEqual(m.hd95, 2.0)
        self.assertAlmostEqual(m.asd, 2.0)
        self.assertEqual(m.distance_unit, "mm")

    def test_hd95_is_max_of_directional_quantiles(self):
        gt = np.zeros((32, 32), dtype=bool)
        gt[8:24, 8:24] = True
        pred = gt.copy()
        pred[2, 2] = True  # isolated outlier
        d_pg = directed_surface_distances(pred, gt)
        d_gp = directed_surface_distances(gt, pred)
        expected = max(
            float(np.quantile(d_pg, 0.95, method="linear")),
            float(np.quantile(d_gp, 0.95, method="linear")),
        )
        m = evaluate_case(pred, gt)
        self.assertAlmostEqual(m.hd95, expected, places=12)
        self.assertGreater(m.hd, m.hd95)

    def test_asd_is_pooled_bidirectional_mean(self):
        gt = np.zeros((24, 24), dtype=bool)
        gt[5:18, 6:17] = True
        pred = np.zeros_like(gt)
        pred[6:16, 7:15] = True
        d_pg = directed_surface_distances(pred, gt)
        d_gp = directed_surface_distances(gt, pred)
        pooled = float(np.concatenate([d_pg, d_gp]).mean())
        equal_direction_weight = float((d_pg.mean() + d_gp.mean()) / 2.0)
        m = evaluate_case(pred, gt)
        self.assertAlmostEqual(m.asd, pooled, places=12)
        # This fixture intentionally has different surface cardinalities.
        self.assertNotAlmostEqual(pooled, equal_direction_weight, places=12)

    def test_one_empty_uses_fov_diagonal_penalty(self):
        gt = np.zeros((10, 20), dtype=bool)
        gt[3:7, 5:12] = True
        pred = np.zeros_like(gt)
        m = evaluate_case(pred, gt)
        expected = math.sqrt(9**2 + 19**2)
        self.assertEqual(m.status, "one_empty")
        self.assertAlmostEqual(m.dice, 0.0)
        self.assertAlmostEqual(m.iou, 0.0)
        self.assertAlmostEqual(m.hd, expected)
        self.assertAlmostEqual(m.hd95, expected)
        self.assertAlmostEqual(m.asd, expected)
        self.assertAlmostEqual(image_diagonal_penalty(gt.shape), expected)

    def test_both_empty_is_explicitly_not_applicable(self):
        empty = np.zeros((8, 8), dtype=bool)
        m = evaluate_case(empty, empty)
        self.assertEqual(m.status, "both_empty")
        self.assertTrue(math.isnan(m.dice))
        self.assertTrue(math.isnan(m.hd95))
        self.assertTrue(math.isnan(m.asd))

    def test_aggregation_keeps_one_empty_and_counts_both_empty(self):
        gt = np.zeros((8, 8), dtype=bool)
        gt[2:6, 2:6] = True
        identical = evaluate_case(gt, gt)
        missed = evaluate_case(np.zeros_like(gt), gt)
        absent = evaluate_case(np.zeros_like(gt), np.zeros_like(gt))
        agg = aggregate_cases([identical, missed, absent])
        self.assertEqual(agg["n_total"], 3)
        self.assertEqual(agg["n_valid"], 2)
        self.assertEqual(agg["n_one_empty"], 1)
        self.assertEqual(agg["n_both_empty"], 1)
        self.assertAlmostEqual(agg["dice_mean"], 0.5)

    def test_lvef_is_percent_not_fraction(self):
        self.assertAlmostEqual(lvef_from_volumes(120.0, 48.0), 60.0)
        s = lvef_error_summary([60.0, 50.0], [55.0, 52.0])
        self.assertEqual(s["n"], 2)
        self.assertAlmostEqual(s["mae_pp"], 3.5)
        self.assertAlmostEqual(s["bias_pp"], 1.5)


if __name__ == "__main__":
    unittest.main()
