import math
import unittest

import numpy as np

from reference_metrics import (
    REFERENCE_VERSION,
    aggregate_cases,
    average_precision_binary,
    binary_classification_at_threshold,
    bland_altman_points,
    bland_altman_summary,
    directed_surface_distances,
    evaluate_case,
    image_diagonal_penalty,
    lvef_error_summary,
    lvef_from_volumes,
    regression_summary,
    roc_auc_binary,
)


class ReferenceMetricsV11Tests(unittest.TestCase):
    def test_version(self):
        self.assertEqual(REFERENCE_VERSION, "1.1.0")

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
        pred[2, 2] = True
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

    def test_binary_classification_at_declared_threshold(self):
        m = binary_classification_at_threshold(
            [1, 1, 0, 0],
            [0.9, 0.4, 0.8, 0.1],
            threshold=0.5,
        )
        self.assertEqual((m["tp"], m["fp"], m["tn"], m["fn"]), (1, 1, 1, 1))
        self.assertAlmostEqual(m["sensitivity"], 0.5)
        self.assertAlmostEqual(m["specificity"], 0.5)
        self.assertAlmostEqual(m["precision"], 0.5)
        self.assertAlmostEqual(m["f1"], 0.5)
        self.assertAlmostEqual(m["accuracy"], 0.5)

    def test_roc_auc_ranking_and_ties(self):
        self.assertAlmostEqual(roc_auc_binary([1, 1, 0, 0], [0.9, 0.8, 0.2, 0.1]), 1.0)
        self.assertAlmostEqual(roc_auc_binary([1, 0], [0.5, 0.5]), 0.5)

    def test_average_precision_is_noninterpolated_ap(self):
        ap = average_precision_binary([1, 0, 1, 0], [0.9, 0.8, 0.7, 0.1])
        self.assertAlmostEqual(ap, 5.0 / 6.0)

    def test_regression_summary(self):
        m = regression_summary([1.0, 2.0, 3.0], [1.0, 2.0, 4.0])
        self.assertEqual(m["n"], 3)
        self.assertAlmostEqual(m["mae"], 1.0 / 3.0)
        self.assertAlmostEqual(m["rmse"], math.sqrt(1.0 / 3.0))
        self.assertAlmostEqual(m["r2"], 11.0 / 14.0)

    def test_bland_altman_uses_prediction_minus_reference_and_sample_sd(self):
        pred = [60.0, 50.0, 70.0]
        ref = [55.0, 52.0, 68.0]
        x, d = bland_altman_points(pred, ref)
        np.testing.assert_allclose(x, [57.5, 51.0, 69.0])
        np.testing.assert_allclose(d, [5.0, -2.0, 2.0])

        m = bland_altman_summary(pred, ref)
        expected_sd = float(np.std([5.0, -2.0, 2.0], ddof=1))
        self.assertEqual(m["difference"], "prediction-reference")
        self.assertAlmostEqual(m["bias"], 5.0 / 3.0)
        self.assertAlmostEqual(m["sample_sd"], expected_sd)
        self.assertAlmostEqual(m["loa_low"], 5.0 / 3.0 - 1.96 * expected_sd)
        self.assertAlmostEqual(m["loa_high"], 5.0 / 3.0 + 1.96 * expected_sd)

    def test_lvef_is_percent_and_agreement_is_percentage_points(self):
        self.assertAlmostEqual(lvef_from_volumes(120.0, 48.0), 60.0)
        s = lvef_error_summary([60.0, 50.0], [55.0, 52.0])
        self.assertEqual(s["n"], 2)
        self.assertAlmostEqual(s["mae_pp"], 3.5)
        self.assertAlmostEqual(s["bias_pp"], 1.5)
        self.assertAlmostEqual(s["sd_pp"], np.std([5.0, -2.0], ddof=1))
        self.assertAlmostEqual(s["loa_low_pp"], 1.5 - 1.96 * s["sd_pp"])
        self.assertAlmostEqual(s["loa_high_pp"], 1.5 + 1.96 * s["sd_pp"])


if __name__ == "__main__":
    unittest.main()
