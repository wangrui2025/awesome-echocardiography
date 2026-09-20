export type PaperCategory =
  | 'video-segmentation'
  | 'cardiac-function'
  | 'disease-assessment'
  | 'representation-learning'
  | 'foundation-models'
  | 'generation'
  | 'domain-generalization'
  | 'vision-language';

export type CodeStatus =
  | 'available'
  | 'partial'
  | 'announced'
  | 'none'
  | 'unofficial';

export interface PaperRecord {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  category: PaperCategory;
  paperUrl: string;
  projectUrl?: string;
  repositoryUrl?: string;
  datasets?: readonly string[];
  summaryZh?: string;
  summaryEn?: string;
  codeStatus: CodeStatus;
  codeVerifiedAt: string;
  codeNoteZh: string;
  codeNoteEn: string;
  featured: boolean;
}

export const papers: readonly PaperRecord[] = [
  {
    id: 'osa-cvpr-2026',
    title: 'OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement',
    authors: 'Rui Wang · Huisi Wu · Jing Qin',
    venue: 'CVPR 2026 · Highlight',
    year: 2026,
    category: 'video-segmentation',
    paperUrl: 'https://openaccess.thecvf.com/content/CVPR2026/html/Wang_OSA_Echocardiography_Video_Segmentation_via_Orthogonalized_State_Update_and_Anatomical_CVPR_2026_paper.html',
    projectUrl: 'https://wangrui2025.github.io/osa/en/',
    repositoryUrl: 'https://github.com/wangrui2025/osa',
    datasets: ['CAMUS', 'EchoNet-Dynamic'],
    summaryZh: '面向超声心动图视频分割的时序建模方法。',
    summaryEn: 'A temporal modeling method for echocardiography video segmentation.',
    codeStatus: 'announced',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '官方仓库已建立，但当前公开内容仍以项目站点/文档为主，尚未发现论文核心训练与推理实现。',
    codeNoteEn: 'An official repository exists, but the public repository currently contains project-site/documentation code rather than the core training and inference implementation.',
    featured: true,
  },
  {
    id: 'echoforge-cvpr-2026',
    title: 'Semi-supervised Echocardiography Video Segmentation via Anchor Semantic Awareness and Continuous Pseudo-label Reforging',
    authors: 'Yunpeng Fang · Yimu Sun · Jingxing Guo · Huisi Wu · Jing Qin',
    venue: 'CVPR 2026',
    year: 2026,
    category: 'video-segmentation',
    paperUrl: 'https://openaccess.thecvf.com/content/CVPR2026/html/Fang_Semi-supervised_Echocardiography_Video_Segmentation_via_Anchor_Semantic_Awareness_and_Continuous_CVPR_2026_paper.html',
    repositoryUrl: 'https://github.com/YunPeng-Fang/EchoForge',
    datasets: ['CAMUS', 'EchoNet-Dynamic'],
    summaryZh: '以少量标注训练半监督超声心动图视频分割模型。',
    summaryEn: 'Semi-supervised echocardiography video segmentation with limited annotations.',
    codeStatus: 'announced',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '官方仓库当前仅有 README 与项目素材，README 明确写有 “The code is coming soon.”。',
    codeNoteEn: 'The official repository currently contains only a README and project assets, and explicitly states “The code is coming soon.”',
    featured: false,
  },
  {
    id: 'gdkvm-iccv-2025',
    title: 'GDKVM: Echocardiography Video Segmentation via Spatiotemporal Key-Value Memory with Gated Delta Rule',
    authors: 'Rui Wang · Yimu Sun · Jingxing Guo · Huisi Wu · Jing Qin',
    venue: 'ICCV 2025',
    year: 2025,
    category: 'video-segmentation',
    paperUrl: 'https://openaccess.thecvf.com/content/ICCV2025/html/Wang_GDKVM_Echocardiography_Video_Segmentation_via_Spatiotemporal_Key-Value_Memory_with_Gated_ICCV_2025_paper.html',
    projectUrl: 'https://wangrui2025.github.io/GDKVM/en/',
    repositoryUrl: 'https://github.com/wangrui2025/gdkvm_code',
    datasets: ['CAMUS', 'EchoNet-Dynamic'],
    summaryZh: '使用时空键值记忆与 Gated Delta Rule 建模超声心动图视频。',
    summaryEn: 'Spatiotemporal key-value memory with a gated delta rule for echocardiography video segmentation.',
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '公开代码仓库包含配置、数据处理、模型实现、工具模块以及训练脚本（train.py / train.sh）。',
    codeNoteEn: 'The public code repository includes configs, dataset utilities, model implementation, supporting utilities, and training scripts (train.py / train.sh).',
    featured: true,
  },
  {
    id: 'echocardmae-miccai-2025',
    title: 'EchoCardMAE: Video Masked Auto-Encoders Customized for Echocardiography',
    authors: 'Xuan Yang · Rui Xu · Xinchen Ye · Zhihui Wang · Miao Zhang · Yi Wang · Xin Fan · Hongkai Wang · Qingxiong Yue · Xiangjian He · Yen-Wei Chen',
    venue: 'MICCAI 2025',
    year: 2025,
    category: 'representation-learning',
    paperUrl: 'https://papers.miccai.org/miccai-2025/0271-Paper2462.html',
    repositoryUrl: 'https://github.com/m1dsolo/EchoCardMAE',
    datasets: ['EchoNet-Dynamic', 'CAMUS', 'HMC-QU'],
    summaryZh: '针对超声心动图定制的视频掩码自编码器，用于 EF、疾病预测与分割等下游任务。',
    summaryEn: 'A masked-video autoencoder tailored to echocardiography for EF, disease prediction, and segmentation downstream tasks.',
    codeStatus: 'partial',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '仓库已公开预训练、EchoNet 的 EF/分割训练与模型代码，但 README 仍把 CAMUS 和 HMC-QU 代码列为待上传。',
    codeNoteEn: 'The repository includes pretraining and EchoNet EF/segmentation code, but its README still lists CAMUS and HMC-QU code as pending.',
    featured: false,
  },
  {
    id: 'hss-net-miccai-2025',
    title: 'Hierarchical Spatio-temporal Segmentation Network for Ejection Fraction Estimation in Echocardiography Videos',
    authors: 'Dongfang Wang · Jian Yang · Yizhe Zhang · Tao Zhou',
    venue: 'MICCAI 2025',
    year: 2025,
    category: 'cardiac-function',
    paperUrl: 'https://papers.miccai.org/miccai-2025/0410-Paper2745.html',
    repositoryUrl: 'https://github.com/DF-W/HSS-Net',
    datasets: ['CAMUS', 'EchoNet-Dynamic', 'EchoNet-Pediatric'],
    summaryZh: '把视频分割与射血分数估计结合起来的层次化时空网络。',
    summaryEn: 'A hierarchical spatio-temporal network connecting video segmentation with ejection-fraction estimation.',
    codeStatus: 'announced',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '官方仓库当前只有 README 与图片目录，并明确写有 “Code coming soon!”。',
    codeNoteEn: 'The official repository currently contains only a README and images, and explicitly states “Code coming soon!”',
    featured: false,
  },
  {
    id: 'cardiacnet-eccv-2024',
    title: 'CardiacNet: Learning to Reconstruct Abnormalities for Cardiac Disease Assessment from Echocardiogram Videos',
    authors: 'Jiewen Yang · Yiqun Lin · Bin Pu · Jiarong Guo · Xiaowei Xu · Xiaomeng Li',
    venue: 'ECCV 2024',
    year: 2024,
    category: 'disease-assessment',
    paperUrl: 'https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/3391_ECCV_2024_paper.php',
    repositoryUrl: 'https://github.com/xmed-lab/CardiacNet',
    datasets: ['CAMUS', 'EchoNet-Dynamic', 'CardiacNet-PAH', 'CardiacNet-ASD'],
    summaryZh: '通过重建异常模式学习超声心动图疾病评估表征。',
    summaryEn: 'Learns representations for cardiac disease assessment by reconstructing abnormalities in echocardiogram videos.',
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '实现仓库包含 train.py、evaluate.py、model/、data/、utils/ 与环境配置；数据集仓库与实现仓库分离。',
    codeNoteEn: 'The implementation repository contains train.py, evaluate.py, model/, data/, utils/, and environment configuration; its dataset repository is separate.',
    featured: false,
  },
  {
    id: 'memsam-cvpr-2024',
    title: 'MemSAM: Taming Segment Anything Model for Echocardiography Video Segmentation',
    authors: 'Xiaolong Deng · Huisi Wu · Runhao Zeng · Jing Qin',
    venue: 'CVPR 2024 · Oral',
    year: 2024,
    category: 'video-segmentation',
    paperUrl: 'https://openaccess.thecvf.com/content/CVPR2024/html/Deng_MemSAM_Taming_Segment_Anything_Model_for_Echocardiography_Video_Segmentation_CVPR_2024_paper.html',
    repositoryUrl: 'https://github.com/dengxl0520/MemSAM',
    datasets: ['CAMUS', 'EchoNet-Dynamic'],
    summaryZh: '把 Segment Anything Model 适配到超声心动图视频分割。',
    summaryEn: 'Adapts Segment Anything Model to echocardiography video segmentation.',
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '公开仓库包含模型、数据预处理、训练与测试脚本，以及依赖说明。',
    codeNoteEn: 'The public repository includes model code, dataset preprocessing, training and testing scripts, and dependency instructions.',
    featured: true,
  },
  {
    id: 'coreecho-miccai-2024',
    title: 'CoReEcho: Continuous Representation Learning for 2D+time Echocardiography Analysis',
    authors: 'Fadillah Adamsyah Maani · Numan Saeed · Aleksandr Matsun · Mohammad Yaqub',
    venue: 'MICCAI 2024',
    year: 2024,
    category: 'representation-learning',
    paperUrl: 'https://papers.miccai.org/miccai-2024/164-Paper2916.html',
    repositoryUrl: 'https://github.com/BioMedIA-MBZUAI/CoReEcho',
    datasets: ['EchoNet-Dynamic', 'CAMUS', 'HMC-QU'],
    summaryZh: '学习连续表征以改善超声心动图 EF 回归与下游迁移。',
    summaryEn: 'Learns continuous representations for EF regression and transferable echocardiography features.',
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '仓库包含两阶段训练、测试、依赖、核心实现、预训练权重链接和 CAMUS 迁移学习支持。',
    codeNoteEn: 'The repository contains two-stage training, testing, dependencies, core implementation, a pretrained-weight link, and CAMUS transfer-learning support.',
    featured: false,
  },
  {
    id: 'free-echo-miccai-2024',
    title: 'Training-Free Condition Video Diffusion Models for single frame Spatial-Semantic Echocardiogram Synthesis',
    authors: 'Van Phi Nguyen · Tri Nhan Luong Ha · Huy Hieu Pham · Quoc Long Tran',
    venue: 'MICCAI 2024',
    year: 2024,
    category: 'generation',
    paperUrl: 'https://papers.miccai.org/miccai-2024/797-Paper1171.html',
    repositoryUrl: 'https://github.com/gungui98/echo-free',
    datasets: ['CAMUS', 'EchoNet-Dynamic'],
    summaryZh: '从单帧分割条件生成时空一致的超声心动图视频。',
    summaryEn: 'Synthesizes echocardiogram videos from a single-frame spatial-semantic condition.',
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '仓库包含 train.py、sample.py、扩散模型实现、权重、示例结果与训练/采样命令。',
    codeNoteEn: 'The repository contains train.py, sample.py, diffusion implementation, weights, examples, and training/sampling commands.',
    featured: false,
  },
  {
    id: 'mlsw-miccai-2024',
    title: 'Uncertainty-aware meta-weighted optimization framework for domain-generalized medical image segmentation',
    authors: 'Seok-Hwan Oh · Guil Jung · Sang-Yun Kim · Myeong-Gee Kim · Young-Min Kim · Hyeon-Jik Lee · Hyuk-Sool Kwon · Hyeon-Min Bae',
    venue: 'MICCAI 2024',
    year: 2024,
    category: 'domain-generalization',
    paperUrl: 'https://papers.miccai.org/miccai-2024/810-Paper0708.html',
    repositoryUrl: 'https://github.com/Seokhwan-Oh/MLSW',
    datasets: ['EchoNet-Dynamic', 'HMC-QU', 'CAMUS'],
    summaryZh: '利用合成超声与元学习提升跨数据域超声分割泛化能力。',
    summaryEn: 'Uses synthetic echocardiography and meta-learning to improve cross-domain segmentation generalization.',
    codeStatus: 'announced',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '论文页面提供了代码链接，但当前官方仓库只有一个极简 README，没有公开可运行实现。',
    codeNoteEn: 'The paper links a code repository, but the current official repository only contains a minimal README and no runnable implementation.',
    featured: false,
  },
];

export const featuredPapers = papers.filter((paper) => paper.featured);

export const publicPaperCategories = Array.from(
  new Set(papers.map((paper) => paper.category)),
);
