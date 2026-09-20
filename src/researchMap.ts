import type { PaperCategory } from './papers';

export interface ResearchMapNode {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  examplesZh: readonly string[];
  examplesEn: readonly string[];
  categories: readonly PaperCategory[];
}

export const mainResearchNodes: readonly ResearchMapNode[] = [
  {
    id: 'acquisition',
    titleZh: '采集与切面理解',
    titleEn: 'Acquisition & View Understanding',
    descriptionZh: '关注探头引导、标准切面识别、图像质量与采集过程，让后续分析建立在可用的输入上。',
    descriptionEn: 'Probe guidance, standard-view understanding, image quality, and acquisition support that shape the input to downstream analysis.',
    examplesZh: ['探头引导', '切面分类', '质量评估'],
    examplesEn: ['Probe guidance', 'View classification', 'Quality assessment'],
    categories: [],
  },
  {
    id: 'segmentation',
    titleZh: '分割与运动追踪',
    titleEn: 'Segmentation & Tracking',
    descriptionZh: '定位心腔与心肌结构，并在心动周期中保持边界和时序一致性。',
    descriptionEn: 'Localize chambers and myocardium while maintaining anatomical and temporal consistency across the cardiac cycle.',
    examplesZh: ['心腔分割', '时序一致性', '运动追踪'],
    examplesEn: ['Chamber segmentation', 'Temporal consistency', 'Motion tracking'],
    categories: ['video-segmentation'],
  },
  {
    id: 'quantification',
    titleZh: '定量与心功能',
    titleEn: 'Quantification & Cardiac Function',
    descriptionZh: '把结构与运动转化为 EF、容积、应变和临床测量等可解释量化结果。',
    descriptionEn: 'Convert structure and motion into interpretable measurements such as EF, volumes, strain, and clinical indices.',
    examplesZh: ['射血分数', '容积', '应变与测量'],
    examplesEn: ['Ejection fraction', 'Volumes', 'Strain & measurements'],
    categories: ['cardiac-function'],
  },
  {
    id: 'disease',
    titleZh: '疾病评估',
    titleEn: 'Disease Assessment',
    descriptionZh: '利用超声心动图中的结构、运动和表型信息辅助疾病识别、分型或风险评估。',
    descriptionEn: 'Use structural, motion, and phenotypic information in echocardiography for disease assessment, phenotyping, or risk support.',
    examplesZh: ['结构性心脏病', '功能异常', '风险评估'],
    examplesEn: ['Structural disease', 'Functional abnormalities', 'Risk assessment'],
    categories: ['disease-assessment'],
  },
  {
    id: 'representation',
    titleZh: '表征学习与基础模型',
    titleEn: 'Representation & Foundation Models',
    descriptionZh: '利用自监督、掩码建模和大规模预训练学习可迁移的超声心动图表示。',
    descriptionEn: 'Learn transferable echocardiography representations through self-supervision, masked modeling, and large-scale pretraining.',
    examplesZh: ['自监督学习', '掩码建模', '迁移学习'],
    examplesEn: ['Self-supervised learning', 'Masked modeling', 'Transfer learning'],
    categories: ['representation-learning', 'foundation-models'],
  },
  {
    id: 'reporting',
    titleZh: '报告与多模态理解',
    titleEn: 'Reporting & Multimodal Understanding',
    descriptionZh: '把视频、测量值和文本报告连接起来，走向 study-level 理解、视觉语言和报告生成。',
    descriptionEn: 'Connect video, measurements, and text toward study-level interpretation, vision-language modeling, and report generation.',
    examplesZh: ['报告生成', '视觉语言', '检查级推理'],
    examplesEn: ['Report generation', 'Vision-language', 'Study-level reasoning'],
    categories: ['vision-language'],
  },
];

export const crossCuttingNodes: readonly ResearchMapNode[] = [
  {
    id: 'generation',
    titleZh: '生成与合成',
    titleEn: 'Generation & Synthesis',
    descriptionZh: '生成新的超声心动图图像或视频，用于数据增强、模拟与方法研究。',
    descriptionEn: 'Generate echocardiography images or videos for augmentation, simulation, and methodological research.',
    examplesZh: ['视频生成', '条件合成', '数据增强'],
    examplesEn: ['Video generation', 'Conditional synthesis', 'Data augmentation'],
    categories: ['generation'],
  },
  {
    id: 'generalization',
    titleZh: '域泛化与鲁棒性',
    titleEn: 'Domain Generalization & Robustness',
    descriptionZh: '处理医院、设备、采集条件与人群差异带来的分布变化。',
    descriptionEn: 'Address distribution shifts across hospitals, devices, acquisition conditions, and populations.',
    examplesZh: ['域泛化', '适配', '鲁棒性'],
    examplesEn: ['Domain generalization', 'Adaptation', 'Robustness'],
    categories: ['domain-generalization'],
  },
];
