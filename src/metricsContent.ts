export type MetricGuide = {
  id: string;
  name: string;
  short: string;
  direction: string;
  unit: string;
  what: string;
  formula: string;
  formulaNote: string;
  rules: string[];
  reasons: string[];
};

export type MetricGroup = {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  metrics: MetricGuide[];
};

export const metricGroupsZh: MetricGroup[] = [
  {
    id: "segmentation",
    kicker: "分割",
    title: "Segmentation",
    intro: "先看区域是否重叠，再看边界误差。推荐顺序固定为 Dice → IoU → HD → HD95 → ASD，其中 HD95 紧跟 HD，因为它就是 HD 的稳健百分位版本。",
    metrics: [
      {
        id: "dice",
        name: "Dice",
        short: "区域重叠",
        direction: "越大越好",
        unit: "无",
        what: "Dice 衡量预测区域 P 与真值区域 G 的重叠程度。完全重合时为 1，完全不重叠时为 0。对于心腔分割，它回答“预测区域整体上和人工标注有多像”。",
        formula: "\\mathrm{Dice}(P,G)=\\frac{2\\lvert P\\cap G\\rvert}{\\lvert P\\rvert+\\lvert G\\rvert}",
        formulaNote: "P 和 G 是已经二值化后的 foreground pixel set。评估 Dice 不加入训练 loss 常用的 smoothing 常数。",
        rules: [
          "threshold、resize、connected-component filtering 等操作必须在进入指标函数前完成并记录。",
          "按 case × structure × view × phase 逐项计算后再聚合，不把整个数据集像素先混成一张大图。",
          "单边 empty：Dice=0；双边 empty：N/A，并统计 n_both_empty。"
        ],
        reasons: [
          "逐项计算避免大结构因为像素更多而获得额外权重。",
          "训练 Dice loss 可以加 smooth，但 benchmark Dice 应保持纯数学定义。"
        ]
      },
      {
        id: "iou",
        name: "IoU / Jaccard",
        short: "区域重叠",
        direction: "越大越好",
        unit: "无",
        what: "IoU 衡量交集占并集的比例。它和 Dice 属于同一类区域重叠指标，但数值更严格；相同预测下，IoU 通常低于 Dice。",
        formula: "\\mathrm{IoU}(P,G)=\\frac{\\lvert P\\cap G\\rvert}{\\lvert P\\cup G\\rvert},\\qquad \\mathrm{IoU}=\\frac{\\mathrm{Dice}}{2-\\mathrm{Dice}}",
        formulaNote: "Dice 和 IoU 单调对应，因此同时报告二者主要是为了兼容不同社区，而不是增加一个完全独立的信息维度。",
        rules: [
          "和 Dice 使用同一批二值 mask、同一原子样本和同一 empty-mask 规则。",
          "单边 empty：IoU=0；双边 empty：N/A。",
          "如果同时报告 Dice 与 IoU，用二者确定关系做自动一致性检查。"
        ],
        reasons: [
          "不同聚合方式会让本应一致的 Dice / IoU 看起来互相矛盾。",
          "确定关系可以快速发现 evaluator 的隐藏错误。"
        ]
      },
      {
        id: "hd",
        name: "HD",
        short: "最坏边界误差",
        direction: "越小越好",
        unit: "mm / px",
        what: "Hausdorff Distance 关注两条轮廓之间最糟糕的局部偏差。一个孤立错误点就可能显著拉高 HD，因此它适合暴露极端边界失败。",
        formula: "\\begin{aligned}d(p,\\partial G)&=\\min_{g\\in\\partial G}\\lVert p-g\\rVert_2\\\\[3pt]\\mathrm{HD}(P,G)&=\\max\\!\\left\\{\\max_{p\\in\\partial P}d(p,\\partial G),\\;\\max_{g\\in\\partial G}d(g,\\partial P)\\right\\}\\end{aligned}",
        formulaNote: "∂P 与 ∂G 表示预测和真值 surface。Reference v1.1 用 binary erosion XOR mask 提取 2D surface。",
        rules: [
          "只在 surface 上计算距离，不用全部 foreground pixels 代替边界。",
          "默认 Euclidean distance；有真实 pixel spacing 时映射到物理空间并报告 mm。",
          "单边 empty 使用 field-of-view 对角线惩罚；双边 empty 为 N/A。"
        ],
        reasons: [
          "HD 的临床含义来自几何边界误差，加入内部像素会改变指标。",
          "相同 2 px 在不同设备或 resize 后不代表相同毫米误差。"
        ]
      },
      {
        id: "hd95",
        name: "HD95",
        short: "稳健边界误差",
        direction: "越小越好",
        unit: "mm / px",
        what: "HD95 是 HD 的稳健版本。它仍关注较坏的边界误差，但不让极少数最极端离群点完全支配结果，因此医学分割里常比完整 HD 更适合作为主要边界指标。",
        formula: "\\mathrm{HD}_{95}(P,G)=\\max\\!\\left\\{Q_{0.95}\\!\\bigl(D(P\\!\\to\\!G)\\bigr),\\;Q_{0.95}\\!\\bigl(D(G\\!\\to\\!P)\\bigr)\\right\\}",
        formulaNote: "两个方向分别取 95% 分位数，再取较大值；不是把双向距离先混在一起再取一次 95%。分位数插值固定为 linear。",
        rules: [
          "分别计算 D(P→G) 与 D(G→P) 的 Q95，再取 max。",
          "quantile interpolation 固定为 linear。",
          "surface、spacing 和 empty-mask 规则与 HD / ASD 共用同一实现。"
        ],
        reasons: [
          "“双向合并后 Q95”和“分方向 Q95 后 max”不是同一指标。",
          "固定插值方式可以消除 NumPy / PyTorch / 第三方库默认差异。"
        ]
      },
      {
        id: "asd",
        name: "ASD",
        short: "平均边界误差",
        direction: "越小越好",
        unit: "mm / px",
        what: "Average Surface Distance 描述两条边界整体上平均相隔多远。它比 HD 更稳定，适合回答“轮廓平均偏了多少”。",
        formula: "\\mathrm{ASD}(P,G)=\\frac{\\displaystyle\\sum_{p\\in\\partial P}d(p,\\partial G)+\\displaystyle\\sum_{g\\in\\partial G}d(g,\\partial P)}{\\lvert\\partial P\\rvert+\\lvert\\partial G\\rvert}",
        formulaNote: "Reference v1.1 使用 pooled symmetric ASD：合并 P→G 与 G→P 的 surface distances 后一次求均值，按 surface 点数自然加权。",
        rules: [
          "采用 mean(concat(D(P→G), D(G→P)))。",
          "不要默认使用 (mean(P→G)+mean(G→P))/2；surface 点数不同两者就不同。",
          "与 HD / HD95 共用 surface、Euclidean distance、spacing 和 empty 规则。"
        ],
        reasons: [
          "不同库对 ASD 可能定义成单向、双向 50/50 或 pooled mean。",
          "这个定义与常用的 symmetric surface-distance 实现语义一致，并通过公开回归测试固定。"
        ]
      }
    ]
  },
  {
    id: "classification",
    kicker: "分类 / 诊断",
    title: "Classification / Diagnosis",
    intro: "分类指标分两类：Sensitivity、Specificity、Precision、F1 依赖一个明确阈值；AUROC 和 AP 使用连续分数，评价整个阈值范围。不要把两类数字混为一谈。",
    metrics: [
      {
        id: "sensitivity",
        name: "Sensitivity / Recall",
        short: "少漏诊",
        direction: "越大越好",
        unit: "无",
        what: "Sensitivity 看真正阳性的样本里，有多少被模型正确识别出来。医学诊断里它直接对应“漏掉多少真正有病的人”。",
        formula: "\\mathrm{Sensitivity}=\\mathrm{Recall}=\\frac{TP}{TP+FN}",
        formulaNote: "它依赖分类阈值。没有正样本时分母为 0，Reference v1.1 记为 N/A。",
        rules: [
          "必须报告 threshold 或 threshold-selection procedure。",
          "同一测试集上固定阈值后再计算 TP / FN。",
          "不能用测试集标签偷偷选一个最优阈值再当作无偏结果。"
        ],
        reasons: [
          "不同阈值可以让 sensitivity 大幅变化。",
          "阈值选择本身属于实验 protocol，而不是指标公式。"
        ]
      },
      {
        id: "specificity",
        name: "Specificity",
        short: "少误诊",
        direction: "越大越好",
        unit: "无",
        what: "Specificity 看真正阴性的样本里，有多少被正确排除。它回答“健康或阴性对象有多少不会被误报成阳性”。",
        formula: "\\mathrm{Specificity}=\\frac{TN}{TN+FP}",
        formulaNote: "没有负样本时该指标为 N/A。",
        rules: [
          "与 sensitivity 使用同一个已声明阈值。",
          "报告 TN、FP 或至少报告样本量和类别构成。",
          "不要跨论文比较隐藏阈值不同的 specificity。"
        ],
        reasons: [
          "Sensitivity 与 Specificity 是同一 threshold 下的 trade-off。",
          "只给其中一个很难判断模型到底是在少漏诊还是少误诊。"
        ]
      },
      {
        id: "precision",
        name: "Precision",
        short: "阳性预测可信度",
        direction: "越大越好",
        unit: "无",
        what: "Precision 看模型判为阳性的样本中，有多少真的阳性。它受阳性率影响很大，因此在稀有疾病或强类别不平衡场景尤其重要。",
        formula: "\\mathrm{Precision}=\\frac{TP}{TP+FP}",
        formulaNote: "没有预测阳性样本时分母为 0，Reference v1.1 记为 N/A。",
        rules: [
          "必须和 prevalence、threshold 一起解释。",
          "不要把不同阳性率人群上的 precision 直接当成可移植常数。",
          "和 recall / F1 共用同一 threshold。"
        ],
        reasons: [
          "相同模型在不同患病率人群里 precision 可以明显不同。",
          "这也是为什么极度不平衡任务需要 PR 曲线，而不能只看 AUROC。"
        ]
      },
      {
        id: "f1",
        name: "F1",
        short: "Precision–Recall 平衡",
        direction: "越大越好",
        unit: "无",
        what: "F1 是 Precision 与 Recall 的调和平均。当其中一个很差时，F1 不会因为另一个很高而看起来很好。",
        formula: "F_1=2\\frac{\\mathrm{Precision}\\cdot\\mathrm{Recall}}{\\mathrm{Precision}+\\mathrm{Recall}}",
        formulaNote: "F1 同样依赖已声明的分类 threshold。",
        rules: [
          "使用和 Precision / Recall 完全相同的 threshold。",
          "Precision 或 Recall 不可定义时，F1 也不应被强制填成一个漂亮数字。",
          "若临床上漏诊和误诊代价不同，不要默认 F1 的 50/50 权重就是最佳目标。"
        ],
        reasons: [
          "F1 适合需要同时顾及 precision 和 recall 的情况。",
          "但它没有利用 TN，也没有表达不同临床错误成本。"
        ]
      },
      {
        id: "auroc",
        name: "AUROC",
        short: "阈值无关的排序能力",
        direction: "越大越好",
        unit: "0–1",
        what: "AUROC 扫过所有分类阈值，衡量模型把阳性样本排在阴性样本前面的能力。可以把它理解成：随机拿一阳一阴，模型给阳性更高分的概率，平分时记半分。",
        formula: "\\mathrm{AUROC}=\\Pr(s^+>s^-)+\\tfrac12\\Pr(s^+=s^-)",
        formulaNote: "Reference v1.1 使用连续 score 的 Mann–Whitney ranking identity；测试集只有一个类别时为 N/A。",
        rules: [
          "必须输入 continuous score，不要输入已经 threshold 成 0/1 的预测。",
          "positive–negative tie 计 0.5。",
          "报告评价人群和阳性率；多分类时必须另行声明 one-vs-rest / macro / micro 等协议。"
        ],
        reasons: [
          "AUROC 把阈值选择从指标里拿掉，适合比较排序能力。",
          "类别严重不平衡时 AUROC 仍可能看起来不错，因此应同时看 PR 类指标。"
        ]
      },
      {
        id: "ap",
        name: "Average Precision (AP)",
        short: "Precision–Recall 曲线摘要",
        direction: "越大越好",
        unit: "0–1",
        what: "AP 总结 Precision–Recall 曲线，更关注阳性类别。在阳性稀少的诊断任务里，它通常比单独 AUROC 更能暴露大量 false positives 的问题。",
        formula: "\\mathrm{AP}=\\sum_n(R_n-R_{n-1})P_n",
        formulaNote: "Reference v1.1 采用 non-interpolated AP。AP 和 trapezoidal PR-AUC 不是同一个数；如果论文写 AUPRC，必须说明到底采用哪种积分。",
        rules: [
          "Reference 标准建议把标量明确叫 AP。",
          "若用 trapezoidal PR-AUC，就明确写 trapezoidal PR-AUC，不和 AP 混称。",
          "报告阳性 prevalence，因为随机基线随 prevalence 改变。"
        ],
        reasons: [
          "PR 曲线直接暴露 precision–recall trade-off。",
          "固定 AP 定义可以避免不同库的插值策略造成同名不同值。"
        ]
      }
    ]
  },
  {
    id: "regression",
    kicker: "连续值 / 心功能",
    title: "Regression & Cardiac Function",
    intro: "EF、EDV、ESV 等是连续量。误差大小、相关性和临床心功能公式回答不同问题，因此 MAE / RMSE、Pearson r、R²、LVEF 需要分开解释。",
    metrics: [
      {
        id: "mae",
        name: "MAE",
        short: "平均绝对误差",
        direction: "越小越好",
        unit: "与目标相同",
        what: "Mean Absolute Error 直接看预测值平均偏离参考值多少，单位与原始目标一致，直观且不特别放大极端误差。",
        formula: "\\mathrm{MAE}=\\frac1n\\sum_{i=1}^{n}|\\hat y_i-y_i|",
        formulaNote: "LVEF 的 MAE 应报告为 percentage points，而不是无量纲 fraction。",
        rules: [
          "只使用成对有限值，并报告有效 n。",
          "保留原始物理或临床单位。",
          "不要把经过标准化后的 MAE 和原单位 MAE 混报。"
        ],
        reasons: [
          "MAE 的单位容易解释，例如“平均差 3.2 个百分点”。",
          "它比 RMSE 对极端离群点更不敏感。"
        ]
      },
      {
        id: "rmse",
        name: "RMSE",
        short: "平方误差尺度",
        direction: "越小越好",
        unit: "与目标相同",
        what: "RMSE 对大误差惩罚更重，因此当少数严重预测失败很重要时，它可以补充 MAE。",
        formula: "\\mathrm{RMSE}=\\sqrt{\\frac1n\\sum_{i=1}^{n}(\\hat y_i-y_i)^2}",
        formulaNote: "开平方后单位重新回到目标的原始单位。",
        rules: [
          "与 MAE 使用相同配对样本。",
          "报告单位和有效 n。",
          "同时给 MAE 时，二者差距可以提示是否存在少数大误差。"
        ],
        reasons: [
          "平方项会放大大误差。",
          "只给 RMSE 有时难判断典型误差，因此推荐与 MAE 搭配。"
        ]
      },
      {
        id: "pearson",
        name: "Pearson r",
        short: "线性相关",
        direction: "越接近 1 越强正相关",
        unit: "−1–1",
        what: "Pearson correlation 看预测和参考值是否一起线性变化。它回答“趋势是否跟得上”，不回答“两种测量是否数值一致”。",
        formula: "r=\\frac{\\sum_i(\\hat y_i-\\bar{\\hat y})(y_i-\\bar y)}{\\sqrt{\\sum_i(\\hat y_i-\\bar{\\hat y})^2\\sum_i(y_i-\\bar y)^2}}",
        formulaNote: "任一变量为常数时 Pearson r 不可定义。",
        rules: [
          "只用配对有限样本并报告 n。",
          "不能用 r 替代 MAE / bias / Bland–Altman。",
          "不要把 Pearson r² 和 regression R² 当成同一东西。"
        ],
        reasons: [
          "预测整体偏高 10 个单位仍可能有接近 1 的相关系数。",
          "相关系数可以描述趋势，但必须结合误差与 agreement 指标一起解读。"
        ]
      },
      {
        id: "r2",
        name: "R²",
        short: "解释方差 / 预测拟合",
        direction: "越大越好",
        unit: "无",
        what: "R² 比较预测残差和“永远预测参考均值”这个基线。R²=1 是完美预测，R²=0 与均值基线相当，R² 也可以为负。",
        formula: "R^2=1-\\frac{\\sum_i(\\hat y_i-y_i)^2}{\\sum_i(y_i-\\bar y)^2}",
        formulaNote: "参考值没有方差时 R² 不可定义。",
        rules: [
          "在同一测试集上计算并报告 n。",
          "允许负值，不要把负 R² 截断为 0。",
          "不要把 R² 与 Pearson r² 混称。"
        ],
        reasons: [
          "负 R² 本身就是“比均值基线更差”的有效信息。",
          "它和相关性关注点不同：一个看预测误差相对基线，一个看线性共同变化。"
        ]
      },
      {
        id: "lvef",
        name: "LVEF",
        short: "左心室射血分数",
        direction: "临床量",
        unit: "% / percentage points",
        what: "LVEF 描述一次心搏中左心室从舒张末到收缩末排出多少比例的血液。它不是 segmentation similarity，而是由 EDV 和 ESV 推导出的临床心功能量。",
        formula: "\\mathrm{LVEF}(\\%)=100\\times\\frac{\\mathrm{EDV}-\\mathrm{ESV}}{\\mathrm{EDV}}",
        formulaNote: "LVEF 本身用 %；预测误差用 percentage points。EDV/ESV 的获得方法必须作为独立 protocol 说明。",
        rules: [
          "明确体积协议：例如 biplane Simpson / Method of Disks、single-plane 或临床机读值。",
          "不能把不同 volume protocol 的 LVEF 当成同一 evaluator。",
          "至少搭配 MAE 与 clinical agreement；correlation 只能补充。"
        ],
        reasons: [
          "相同 segmentation 采用不同体积估计方法也可能得到不同 LVEF。",
          "因此体积估计方法必须从隐式代码习惯升级成明确、可复现的 protocol。"
        ]
      }
    ]
  },
  {
    id: "agreement",
    kicker: "临床一致性",
    title: "Clinical Agreement",
    intro: "Correlation 看“是否一起变化”，agreement 看“数值是否足够接近”。Bias、SD 与 Bland–Altman / Limits of Agreement 都属于这一组。",
    metrics: [
      {
        id: "bias-sd",
        name: "Bias ± SD",
        short: "系统偏差与差值离散程度",
        direction: "Bias 越接近 0 越好；SD 越小越好",
        unit: "与测量相同",
        what: "先对每个受试者计算 prediction − reference。Bias 是这些配对差值的平均值，表示系统性高估或低估；SD 描述个体差值围绕 bias 的离散程度。",
        formula: "d_i=\\hat y_i-y_i,\\qquad \\mathrm{bias}=\\bar d,\\qquad s_d=\\sqrt{\\frac{\\sum_i(d_i-\\bar d)^2}{n-1}}",
        formulaNote: "Reference v1.1 固定差值方向为 prediction − reference，并使用 sample SD（ddof=1）。LVEF 的 bias / SD 单位是 percentage points。",
        rules: [
          "正 bias 表示模型高估 reference，负 bias 表示低估。",
          "标准差固定用 sample SD（n−1）；不沿用 NumPy 默认 ddof=0。",
          "历史论文数字不 retroactively 改写；未来结果按 v1.1 计算。"
        ],
        reasons: [
          "bias 的符号如果不固定，不同论文的正负号可能正好相反。",
          "经典 Bland–Altman LoA 使用配对差值的样本标准差。"
        ]
      },
      {
        id: "bland-altman",
        name: "Bland–Altman / 95% LoA",
        short: "个体层面一致性",
        direction: "LoA 越窄通常越好，但需结合临床可接受范围",
        unit: "与测量相同",
        what: "Bland–Altman 把每个受试者两种测量的平均值放在横轴，把两者差值放在纵轴。它同时显示系统偏差和个体差值范围，用来判断两种测量方法是否足够一致，而不是只看相关性。",
        formula: "m_i=\\frac{\\hat y_i+y_i}{2},\\qquad d_i=\\hat y_i-y_i,\\qquad \\mathrm{LoA}_{95\\%}=\\bar d\\pm1.96s_d",
        formulaNote: "1.96×SD 的经典 LoA 假设差值近似正态；正式 method-comparison 或小样本研究还应考虑 bias 和 LoA 的置信区间。",
        rules: [
          "横轴固定为 paired mean，纵轴固定为 prediction − reference。",
          "画三条水平线：bias、lower LoA、upper LoA。",
          "报告 n、单位、差值方向、bias、sample SD、上下 LoA 和剔除的非有限配对。",
          "检查 proportional bias 或随测量大小变化的方差；出现明显趋势时不能只报三条线就结束。"
        ],
        reasons: [
          "Pearson r 很高并不代表两种方法数值一致。",
          "把作图坐标、差值方向和 LoA 统计规则固定下来，才能让不同研究的 Bland–Altman 结果真正可比较。"
        ]
      }
    ]
  }
];

export const metricGroupsEn: MetricGroup[] = [
  {
    id: "segmentation",
    kicker: "Segmentation",
    title: "Segmentation",
    intro: "Start with region overlap, then examine boundary error. The recommended order is Dice → IoU → HD → HD95 → ASD. HD95 follows HD directly because it is the robust percentile variant of Hausdorff distance.",
    metrics: [
      {
        id: "dice",
        name: "Dice",
        short: "Region overlap",
        direction: "Higher is better",
        unit: "None",
        what: "Dice measures overlap between predicted foreground P and ground truth G. It is 1 for perfect overlap and 0 for disjoint masks. In chamber segmentation it answers how similar the predicted region is to the annotation overall.",
        formula: "\\mathrm{Dice}(P,G)=\\frac{2\\lvert P\\cap G\\rvert}{\\lvert P\\rvert+\\lvert G\\rvert}",
        formulaNote: "P and G are already-binarized foreground pixel sets. The benchmark formula does not include a training-loss smoothing constant.",
        rules: [
          "Apply thresholding, resize, connected-component filtering, and other post-processing before the metric function and record them separately.",
          "Compute per case × structure × view × phase, then aggregate; do not pool the entire dataset into one pixel set.",
          "Exactly one empty: Dice=0. Both empty: N/A and count n_both_empty."
        ],
        reasons: [
          "Per-item evaluation prevents large structures from receiving extra weight simply because they contain more pixels.",
          "Training Dice loss may use smoothing, but benchmark Dice should preserve the mathematical definition."
        ]
      },
      {
        id: "iou",
        name: "IoU / Jaccard",
        short: "Region overlap",
        direction: "Higher is better",
        unit: "None",
        what: "IoU is intersection divided by union. It belongs to the same overlap family as Dice but is numerically stricter; for the same prediction IoU is usually lower than Dice.",
        formula: "\\mathrm{IoU}(P,G)=\\frac{\\lvert P\\cap G\\rvert}{\\lvert P\\cup G\\rvert},\\qquad \\mathrm{IoU}=\\frac{\\mathrm{Dice}}{2-\\mathrm{Dice}}",
        formulaNote: "Dice and IoU are monotonically related, so reporting both mainly supports compatibility across communities rather than adding an independent dimension.",
        rules: [
          "Use the same binary masks, atomic items, and empty-mask policy as Dice.",
          "Exactly one empty: IoU=0. Both empty: N/A.",
          "When Dice and IoU are both reported, use their deterministic relationship as a consistency check."
        ],
        reasons: [
          "Different aggregation paths can make Dice and IoU appear inconsistent even though they measure the same overlap.",
          "The identity is a useful automatic evaluator check."
        ]
      },
      {
        id: "hd",
        name: "HD",
        short: "Worst boundary error",
        direction: "Lower is better",
        unit: "mm / px",
        what: "Hausdorff Distance focuses on the worst local disagreement between two contours. A single isolated boundary outlier can dominate the score, making HD useful for exposing extreme geometric failure.",
        formula: "\\begin{aligned}d(p,\\partial G)&=\\min_{g\\in\\partial G}\\lVert p-g\\rVert_2\\\\[3pt]\\mathrm{HD}(P,G)&=\\max\\!\\left\\{\\max_{p\\in\\partial P}d(p,\\partial G),\\;\\max_{g\\in\\partial G}d(g,\\partial P)\\right\\}\\end{aligned}",
        formulaNote: "∂P and ∂G are surfaces. Reference v1.1 extracts the 2-D surface with binary erosion XOR mask.",
        rules: [
          "Compute distances on surfaces rather than all foreground pixels.",
          "Use Euclidean distance; map to physical space and report mm when real pixel spacing is known.",
          "Exactly one empty uses the field-of-view diagonal penalty; both empty is N/A."
        ],
        reasons: [
          "HD is a geometric boundary metric; adding interior pixels changes its meaning.",
          "The same 2 px can represent very different physical errors after acquisition or resizing."
        ]
      },
      {
        id: "hd95",
        name: "HD95",
        short: "Robust boundary error",
        direction: "Lower is better",
        unit: "mm / px",
        what: "HD95 is the robust Hausdorff variant. It still emphasizes bad boundary errors but prevents a tiny number of extreme outliers from fully controlling the result, so it is often a more practical primary boundary metric in medical segmentation.",
        formula: "\\mathrm{HD}_{95}(P,G)=\\max\\!\\left\\{Q_{0.95}\\!\\bigl(D(P\\!\\to\\!G)\\bigr),\\;Q_{0.95}\\!\\bigl(D(G\\!\\to\\!P)\\bigr)\\right\\}",
        formulaNote: "Take the 95th percentile separately in both directions, then use the larger value. Do not pool both directions before taking a single percentile. Quantile interpolation is fixed to linear.",
        rules: [
          "Compute Q95 independently for D(P→G) and D(G→P), then take max.",
          "Pin quantile interpolation to linear.",
          "Share the same surface, spacing, and empty-mask implementation as HD and ASD."
        ],
        reasons: [
          "Pooling directions before Q95 is a different metric and can yield a different number.",
          "Pinning interpolation removes hidden NumPy/PyTorch/library-default differences."
        ]
      },
      {
        id: "asd",
        name: "ASD",
        short: "Mean boundary error",
        direction: "Lower is better",
        unit: "mm / px",
        what: "Average Surface Distance describes the average separation between two contours. It is more stable than HD and answers how far the boundary is displaced on average.",
        formula: "\\mathrm{ASD}(P,G)=\\frac{\\displaystyle\\sum_{p\\in\\partial P}d(p,\\partial G)+\\displaystyle\\sum_{g\\in\\partial G}d(g,\\partial P)}{\\lvert\\partial P\\rvert+\\lvert\\partial G\\rvert}",
        formulaNote: "Reference v1.1 uses pooled symmetric ASD: concatenate P→G and G→P distances, then take one mean, naturally weighting by surface-point count.",
        rules: [
          "Use mean(concat(D(P→G), D(G→P))).",
          "Do not assume (mean(P→G)+mean(G→P))/2 is equivalent when surface cardinalities differ.",
          "Share surface, Euclidean distance, spacing, and empty-mask rules with HD / HD95."
        ],
        reasons: [
          "Different libraries may use ASD to mean one-way, 50/50 bidirectional, or pooled bidirectional distance.",
          "This matches common symmetric surface-distance semantics and is pinned by public regression tests."
        ]
      }
    ]
  },
  {
    id: "classification",
    kicker: "Classification / Diagnosis",
    title: "Classification / Diagnosis",
    intro: "Classification metrics fall into two families. Sensitivity, specificity, precision, and F1 depend on an explicit threshold; AUROC and AP use continuous scores across thresholds. The two families should not be treated as interchangeable.",
    metrics: [
      {
        id: "sensitivity",
        name: "Sensitivity / Recall",
        short: "Avoid missed positives",
        direction: "Higher is better",
        unit: "None",
        what: "Sensitivity asks what fraction of truly positive cases are correctly identified. In diagnosis it directly reflects how many positive patients are missed.",
        formula: "\\mathrm{Sensitivity}=\\mathrm{Recall}=\\frac{TP}{TP+FN}",
        formulaNote: "This is threshold-dependent. If there are no positive reference cases, the denominator is zero and Reference v1.1 returns N/A.",
        rules: [
          "Report the threshold or the full threshold-selection procedure.",
          "Compute TP/FN after fixing that threshold on the declared evaluation set.",
          "Do not optimize a threshold on test labels and then present the result as an unbiased test metric."
        ],
        reasons: [
          "Sensitivity can change substantially with threshold.",
          "Threshold selection is part of the experimental protocol, not part of the metric formula."
        ]
      },
      {
        id: "specificity",
        name: "Specificity",
        short: "Avoid false positives",
        direction: "Higher is better",
        unit: "None",
        what: "Specificity asks what fraction of truly negative cases are correctly rejected. It describes how often negative or healthy cases avoid being falsely called positive.",
        formula: "\\mathrm{Specificity}=\\frac{TN}{TN+FP}",
        formulaNote: "If the evaluation set has no negative reference cases, specificity is N/A.",
        rules: [
          "Use the same declared threshold as sensitivity.",
          "Report class counts or enough information to recover the evaluation population.",
          "Do not compare specificity values produced by hidden, different threshold-selection procedures."
        ],
        reasons: [
          "Sensitivity and specificity form a threshold-dependent trade-off.",
          "Reporting only one obscures whether a method reduces misses by accepting many false alarms."
        ]
      },
      {
        id: "precision",
        name: "Precision",
        short: "Positive prediction reliability",
        direction: "Higher is better",
        unit: "None",
        what: "Precision asks what fraction of cases predicted positive are truly positive. It is strongly affected by prevalence and is especially important for rare-positive or highly imbalanced diagnosis tasks.",
        formula: "\\mathrm{Precision}=\\frac{TP}{TP+FP}",
        formulaNote: "If there are no predicted positives, the denominator is zero and Reference v1.1 returns N/A.",
        rules: [
          "Interpret precision together with prevalence and threshold.",
          "Do not treat precision from populations with very different prevalence as a portable constant.",
          "Use the same threshold as recall and F1."
        ],
        reasons: [
          "The same model may have very different precision in populations with different prevalence.",
          "This is one reason strongly imbalanced tasks need precision–recall analysis in addition to AUROC."
        ]
      },
      {
        id: "f1",
        name: "F1",
        short: "Precision–Recall balance",
        direction: "Higher is better",
        unit: "None",
        what: "F1 is the harmonic mean of Precision and Recall. If either one is poor, a high value in the other cannot fully hide it.",
        formula: "F_1=2\\frac{\\mathrm{Precision}\\cdot\\mathrm{Recall}}{\\mathrm{Precision}+\\mathrm{Recall}}",
        formulaNote: "F1 is threshold-dependent and must use the same threshold as Precision and Recall.",
        rules: [
          "Use exactly the same threshold as Precision / Recall.",
          "If Precision or Recall is undefined, do not silently manufacture a favorable F1.",
          "If clinical costs of misses and false positives differ, do not assume F1's implicit balance is the clinical objective."
        ],
        reasons: [
          "F1 is useful when both precision and recall matter.",
          "It ignores TN and does not encode unequal clinical costs."
        ]
      },
      {
        id: "auroc",
        name: "AUROC",
        short: "Threshold-free ranking",
        direction: "Higher is better",
        unit: "0–1",
        what: "AUROC evaluates ranking across all classification thresholds. A useful interpretation is the probability that a randomly selected positive receives a higher score than a randomly selected negative, with half credit for a tie.",
        formula: "\\mathrm{AUROC}=\\Pr(s^+>s^-)+\\tfrac12\\Pr(s^+=s^-)",
        formulaNote: "Reference v1.1 uses the Mann–Whitney ranking identity on continuous scores. AUROC is N/A when only one class is present.",
        rules: [
          "Use continuous scores, not already-thresholded 0/1 predictions.",
          "Positive–negative ties receive half credit.",
          "Report population and prevalence; multiclass work must additionally declare one-vs-rest / macro / micro protocols."
        ],
        reasons: [
          "AUROC separates ranking quality from a single threshold choice.",
          "With severe class imbalance, AUROC can remain attractive even when positive predictive performance is weak, so PR metrics are useful alongside it."
        ]
      },
      {
        id: "ap",
        name: "Average Precision (AP)",
        short: "Precision–Recall summary",
        direction: "Higher is better",
        unit: "0–1",
        what: "AP summarizes the Precision–Recall curve and emphasizes performance on the positive class. In rare-positive diagnosis tasks it can expose large numbers of false positives that may be less apparent from AUROC alone.",
        formula: "\\mathrm{AP}=\\sum_n(R_n-R_{n-1})P_n",
        formulaNote: "Reference v1.1 uses non-interpolated AP. AP and trapezoidal PR-AUC are not numerically identical; if a paper reports AUPRC, it should state which integration it uses.",
        rules: [
          "Name this scalar AP in Reference v1.1 reports.",
          "If trapezoidal PR-AUC is used instead, label it explicitly as trapezoidal PR-AUC.",
          "Report positive prevalence because the baseline changes with prevalence."
        ],
        reasons: [
          "The PR curve exposes the precision–recall trade-off directly.",
          "Pinning AP semantics avoids hidden interpolation differences across libraries."
        ]
      }
    ]
  },
  {
    id: "regression",
    kicker: "Continuous prediction / Cardiac function",
    title: "Regression & Cardiac Function",
    intro: "EF, EDV, ESV, and similar endpoints are continuous quantities. Error magnitude, association, and the cardiac-function formula answer different questions, so MAE/RMSE, Pearson r, R², and LVEF should be interpreted separately.",
    metrics: [
      {
        id: "mae",
        name: "MAE",
        short: "Mean absolute error",
        direction: "Lower is better",
        unit: "Same as target",
        what: "Mean Absolute Error reports how far predictions are from references on average, in the original target unit, without disproportionately amplifying rare large errors.",
        formula: "\\mathrm{MAE}=\\frac1n\\sum_{i=1}^{n}|\\hat y_i-y_i|",
        formulaNote: "For LVEF, MAE should be reported in percentage points rather than as a unitless fraction.",
        rules: [
          "Use finite paired values and report the effective n.",
          "Preserve the original physical or clinical unit.",
          "Do not mix normalized-space MAE with original-unit MAE."
        ],
        reasons: [
          "MAE has an intuitive interpretation, such as an average error of 3.2 percentage points.",
          "It is less dominated by extreme errors than RMSE."
        ]
      },
      {
        id: "rmse",
        name: "RMSE",
        short: "Squared-error scale",
        direction: "Lower is better",
        unit: "Same as target",
        what: "RMSE penalizes large errors more strongly than MAE, so it is a useful complement when a small number of severe prediction failures matter.",
        formula: "\\mathrm{RMSE}=\\sqrt{\\frac1n\\sum_{i=1}^{n}(\\hat y_i-y_i)^2}",
        formulaNote: "The square root returns RMSE to the original target unit.",
        rules: [
          "Use the same paired samples as MAE.",
          "Report the unit and effective n.",
          "When MAE and RMSE are both reported, a large gap can reveal a tail of large errors."
        ],
        reasons: [
          "Squaring magnifies large errors.",
          "RMSE alone can be less intuitive, so reporting it with MAE is usually more informative."
        ]
      },
      {
        id: "pearson",
        name: "Pearson r",
        short: "Linear association",
        direction: "Closer to 1 means stronger positive association",
        unit: "−1–1",
        what: "Pearson correlation measures whether prediction and reference move together linearly. It answers whether the trend is captured, not whether the two measurements numerically agree.",
        formula: "r=\\frac{\\sum_i(\\hat y_i-\\bar{\\hat y})(y_i-\\bar y)}{\\sqrt{\\sum_i(\\hat y_i-\\bar{\\hat y})^2\\sum_i(y_i-\\bar y)^2}}",
        formulaNote: "Pearson r is undefined when either paired variable has zero variance.",
        rules: [
          "Use finite paired samples and report n.",
          "Do not use r as a substitute for MAE, bias, or Bland–Altman agreement.",
          "Do not confuse Pearson r² with regression R²."
        ],
        reasons: [
          "Predictions can be systematically 10 units too high and still have correlation near 1.",
          "Correlation is informative only when interpreted alongside error and agreement metrics."
        ]
      },
      {
        id: "r2",
        name: "R²",
        short: "Predictive fit relative to mean baseline",
        direction: "Higher is better",
        unit: "None",
        what: "R² compares model residual error with the error of always predicting the reference mean. R²=1 is perfect, R²=0 matches the mean baseline, and R² can legitimately be negative.",
        formula: "R^2=1-\\frac{\\sum_i(\\hat y_i-y_i)^2}{\\sum_i(y_i-\\bar y)^2}",
        formulaNote: "R² is undefined when the reference has zero variance.",
        rules: [
          "Compute on one declared evaluation set and report n.",
          "Preserve negative values rather than clipping them to zero.",
          "Do not call regression R² and Pearson r² the same quantity."
        ],
        reasons: [
          "Negative R² is meaningful evidence that predictions are worse than the mean baseline.",
          "R² and correlation answer different questions: predictive error relative to baseline versus linear co-movement."
        ]
      },
      {
        id: "lvef",
        name: "LVEF",
        short: "Left-ventricular ejection fraction",
        direction: "Clinical quantity",
        unit: "% / percentage points",
        what: "LVEF describes the fraction of end-diastolic blood volume ejected by the left ventricle during systole. It is not a segmentation-similarity metric; it is a clinical functional quantity derived from EDV and ESV.",
        formula: "\\mathrm{LVEF}(\\%)=100\\times\\frac{\\mathrm{EDV}-\\mathrm{ESV}}{\\mathrm{EDV}}",
        formulaNote: "LVEF itself is in %. Prediction error is in percentage points. The method used to obtain EDV/ESV is a separate protocol and must be declared.",
        rules: [
          "Declare the volume protocol, such as biplane Simpson / Method of Disks, single-plane estimation, or clinically supplied volumes.",
          "Do not treat LVEF derived from different volume protocols as the same evaluator.",
          "Report at least an error metric and clinical agreement; correlation is supplementary."
        ],
        reasons: [
          "The same segmentation contours may produce different LVEF under different volume-estimation protocols.",
          "Volume estimation should therefore be upgraded from implicit code habits to an explicit, reproducible protocol."
        ]
      }
    ]
  },
  {
    id: "agreement",
    kicker: "Clinical agreement",
    title: "Clinical Agreement",
    intro: "Correlation asks whether values move together; agreement asks whether they are numerically close enough. Bias, SD, and Bland–Altman / Limits of Agreement belong in this category.",
    metrics: [
      {
        id: "bias-sd",
        name: "Bias ± SD",
        short: "Systematic error and spread",
        direction: "Bias closer to 0 and smaller SD are generally better",
        unit: "Same as measurement",
        what: "For each subject, compute prediction − reference. Bias is the mean paired difference and captures systematic over- or under-estimation. SD describes the spread of individual differences around that bias.",
        formula: "d_i=\\hat y_i-y_i,\\qquad \\mathrm{bias}=\\bar d,\\qquad s_d=\\sqrt{\\frac{\\sum_i(d_i-\\bar d)^2}{n-1}}",
        formulaNote: "Reference v1.1 fixes the sign as prediction − reference and uses the sample SD (ddof=1). For LVEF, bias and SD are in percentage points.",
        rules: [
          "Positive bias means the model overestimates the reference; negative bias means underestimation.",
          "Use sample SD with n−1, not NumPy's default ddof=0.",
          "Do not retroactively rewrite historical published numbers; use v1.1 for future comparable results."
        ],
        reasons: [
          "Without a fixed sign convention, two papers may report opposite signed bias for the same paired data.",
          "Classical Bland–Altman limits of agreement use the sample SD of paired differences."
        ]
      },
      {
        id: "bland-altman",
        name: "Bland–Altman / 95% LoA",
        short: "Individual-level agreement",
        direction: "Narrower LoA is generally better, judged against clinical acceptability",
        unit: "Same as measurement",
        what: "A Bland–Altman plot puts the paired mean on the x-axis and the paired difference on the y-axis. It shows systematic bias and the spread of individual disagreements, answering whether two measurement methods agree closely enough rather than merely correlate.",
        formula: "m_i=\\frac{\\hat y_i+y_i}{2},\\qquad d_i=\\hat y_i-y_i,\\qquad \\mathrm{LoA}_{95\\%}=\\bar d\\pm1.96s_d",
        formulaNote: "The classical 1.96×SD LoA assumes approximately Normal paired differences. Formal method-comparison or small-sample studies should also consider confidence intervals around bias and LoA.",
        rules: [
          "Use paired mean on x and prediction − reference on y.",
          "Draw horizontal lines for bias, lower LoA, and upper LoA.",
          "Report n, unit, difference direction, bias, sample SD, lower/upper LoA, and excluded non-finite pairs.",
          "Inspect proportional bias or changing variance across the measurement range; three horizontal lines alone are not enough when clear trends are present."
        ],
        reasons: [
          "High Pearson r does not imply numerical agreement.",
          "Fixing the plotting coordinates, difference direction, and LoA statistics makes Bland–Altman results reproducible across studies."
        ]
      }
    ]
  }
];
