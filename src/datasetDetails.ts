export const datasetDetails = {
  camus: {
    name: 'CAMUS',
    full: 'Cardiac Acquisitions for Multi-structure Ultrasound Segmentation',
    official: 'https://www.creatis.insa-lyon.fr/Challenge/camus/',
    paper: 'https://doi.org/10.1109/TMI.2019.2900516',
    benchmark: 'https://www.creatis.insa-lyon.fr/Challenge/camus/evaluationSegmentation.html',
    zh: {
      tagline: '小而精的双切面、多结构超声心动图基准。',
      summary: 'CAMUS 更像一个“标注密、结构多、临床异质性强”的标准分割数据集：病例数量不算巨大，但它同时覆盖 A2C / A4C、ED / ES 和多个心脏结构，因此特别适合研究分割质量、几何误差和由分割推导出的心功能指标。',
      facts: [
        ['规模', '500 名患者'],
        ['切面', 'A2C + A4C'],
        ['时相', 'ED + ES'],
        ['标注', 'LV endocardium、LV epicardium、LA'],
        ['原始划分', '450 train + 50 test'],
        ['采集', 'University Hospital of St Etienne；GE Vivid E95'],
      ],
      strengths: [
        ['多切面', '同时提供两腔心和四腔心切面，可用于 Simpson 双平面方法相关研究。'],
        ['多结构', '不仅有左心室腔，还包含左心室心外膜与左心房，适合多结构分割和结构间约束。'],
        ['临床异质性', '官方刻意保留真实临床中的困难病例、图像质量差异和切面不完全标准的情况。'],
        ['ED / ES 明确', '每位患者至少覆盖一个完整心动周期，并在舒张末和收缩末提供人工标注。'],
      ],
      suitable: ['多结构心脏分割', 'ED / ES 分割', 'A2C / A4C 跨切面建模', 'LVEF / 容积估计', '低质量图像鲁棒性'],
      cautions: [
        'CAMUS 的价值不只是“500 个病例”，而是标注协议和临床异质性；只报一个平均 Dice 会丢掉很多信息。',
        '官方评估按结构和 ED / ES 分开报告 Dice、Hausdorff 和平均距离。复现旧结果时，应保持相同结构、时相和单位。',
        '官方在线评估平台已经关闭；今天的新论文更需要把 split、预处理和评估代码公开清楚。',
      ],
      compare: '如果 EchoNet-Dynamic 更像“大规模视频与心功能数据”，CAMUS 则更像“高密度结构标注与几何评估数据”。两者一起使用，可以同时覆盖规模、时序、多结构和跨域差异。',
    },
    en: {
      tagline: 'A compact but annotation-rich, multi-view echocardiography benchmark.',
      summary: 'CAMUS is best thought of as a densely annotated, multi-structure benchmark with strong clinical heterogeneity. It is smaller than EchoNet-Dynamic, but combines A2C/A4C views, ED/ES phases and multiple cardiac structures, making it particularly useful for segmentation, geometric accuracy and function derived from contours.',
      facts: [
        ['Scale', '500 patients'],
        ['Views', 'A2C + A4C'],
        ['Phases', 'ED + ES'],
        ['Annotations', 'LV endocardium, LV epicardium, LA'],
        ['Original split', '450 train + 50 test'],
        ['Acquisition', 'University Hospital of St Etienne; GE Vivid E95'],
      ],
      strengths: [
        ['Multi-view', 'Both apical two- and four-chamber views support work related to biplane Simpson measurements.'],
        ['Multi-structure', 'Beyond the LV cavity, CAMUS provides LV epicardial and left-atrial annotations.'],
        ['Clinical heterogeneity', 'The official dataset deliberately retains difficult cases, image-quality variation and imperfect views seen in routine practice.'],
        ['Explicit ED / ES', 'Each patient includes at least one cardiac cycle with manual references at end-diastole and end-systole.'],
      ],
      suitable: ['Multi-structure segmentation', 'ED / ES segmentation', 'A2C / A4C modeling', 'LVEF / volume estimation', 'Robustness to poor image quality'],
      cautions: [
        'The value of CAMUS is not merely its patient count; its annotation protocol and clinical heterogeneity matter. A single mean Dice hides important behavior.',
        'The original benchmark reports Dice, Hausdorff and mean distance separately by structure and cardiac phase. Reproductions should preserve structure, phase and units.',
        'The original online evaluation platform is closed, so modern work should make split, preprocessing and evaluation code explicit.',
      ],
      compare: 'EchoNet-Dynamic behaves more like a large video and cardiac-function resource; CAMUS behaves more like a dense structural and geometric benchmark. Used together, they cover scale, motion, multi-structure labels and domain differences.',
    },
  },

  'echonet-dynamic': {
    name: 'EchoNet-Dynamic',
    full: 'A Large New Cardiac Motion Video Data Resource for Medical Machine Learning',
    official: 'https://echonet.github.io/dynamic/',
    paper: 'https://doi.org/10.1038/s41586-020-2145-8',
    code: 'https://github.com/echonet/dynamic',
    zh: {
      tagline: '大规模 A4C 视频、心功能和关键帧轮廓标注。',
      summary: 'EchoNet-Dynamic 的核心优势是规模和时间信息。它不是一个“每帧都密集标注”的分割数据集，而是把 10,030 段真实临床 A4C 视频、LVEF / EDV / ESV 和 ED / ES 两个关键时相的左心室内膜轮廓结合在一起。',
      facts: [
        ['规模', '10,030 段视频'],
        ['切面', 'A4C'],
        ['来源', 'Stanford University Hospital，2016–2018'],
        ['视频', '标准化为 112 × 112'],
        ['功能标签', 'LVEF、EDV、ESV'],
        ['轮廓', 'ED 与 ES 的 LV endocardial tracing'],
      ],
      strengths: [
        ['视频规模', '一万余段超声视频让它非常适合时序建模、表示学习和大规模训练。'],
        ['心功能标签', 'LVEF、EDV、ESV 让分割、运动和临床功能评估能够放在同一数据集里讨论。'],
        ['真实临床工作流', '测量来自常规临床流程，由注册超声技师完成并经高级超声心动图医师核验。'],
        ['关键帧轮廓', 'ED / ES 提供左心室内膜 tracing，可连接分割质量与容积、LVEF 等下游指标。'],
      ],
      suitable: ['视频时序建模', 'LV 分割', 'ED / ES 定位', 'LVEF 回归', '心脏运动表示学习', '大规模预训练'],
      cautions: [
        'EchoNet-Dynamic 只有 A4C；它不能替代 CAMUS 的 A2C + A4C 多切面设定。',
        '分割标注集中在 ED / ES 两个时相，不应把它描述成“全视频逐帧人工 mask”。',
        '官方研究使用协议限制为个人、非商业研究，并明确禁止未经许可再分发数据；公开 benchmark 代码时不要重新打包数据本体。',
      ],
      compare: 'EchoNet-Dynamic 强在“规模 + 视频 + 心功能”；CAMUS 强在“多切面 + 多结构 + 稠密关键时相标注”。这也是为什么近年的超声心动图工作经常把两者一起使用。',
    },
    en: {
      tagline: 'Large-scale A4C video with cardiac-function labels and key-frame LV tracings.',
      summary: 'EchoNet-Dynamic is defined by scale and temporal information. It is not a densely annotated mask-on-every-frame dataset; instead, it combines 10,030 routine-clinical A4C videos with LVEF/EDV/ESV measurements and LV endocardial tracings at ED and ES.',
      facts: [
        ['Scale', '10,030 videos'],
        ['View', 'A4C'],
        ['Source', 'Stanford University Hospital, 2016–2018'],
        ['Video', 'Standardized to 112 × 112'],
        ['Function labels', 'LVEF, EDV, ESV'],
        ['Contours', 'LV endocardial tracing at ED and ES'],
      ],
      strengths: [
        ['Video scale', 'More than ten thousand videos make it well suited to temporal modeling, representation learning and large-scale training.'],
        ['Cardiac function', 'LVEF, EDV and ESV connect segmentation and motion modeling with clinically meaningful function.'],
        ['Routine clinical workflow', 'Measurements originated in the clinical workflow and were produced by a registered sonographer and verified by an advanced echocardiographer.'],
        ['Key-frame tracings', 'ED/ES LV tracings connect contour accuracy to downstream volume and LVEF assessment.'],
      ],
      suitable: ['Video temporal modeling', 'LV segmentation', 'ED / ES localization', 'LVEF regression', 'Cardiac-motion representation learning', 'Large-scale pretraining'],
      cautions: [
        'EchoNet-Dynamic is A4C only; it does not replace the A2C+A4C setting of CAMUS.',
        'Segmentation tracings are provided at ED and ES, not as dense human masks for every video frame.',
        'The official research-use agreement is for personal, non-commercial research and prohibits unauthorized redistribution. Public benchmark code should not repackage the dataset itself.',
      ],
      compare: 'EchoNet-Dynamic is strong on scale, video and cardiac function; CAMUS is strong on multi-view, multi-structure and detailed key-phase annotation. This complementarity helps explain why recent echocardiography work often evaluates on both.',
    },
  },
} as const;

export type DatasetSlug = keyof typeof datasetDetails;
