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
    codeStatus: 'announced',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '官方仓库已建立，但当前公开内容仍以项目站点/文档为主，尚未发现论文核心训练与推理实现。',
    codeNoteEn: 'An official repository exists, but the public repository currently contains project-site/documentation code rather than the core training and inference implementation.',
    featured: true,
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
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '公开代码仓库包含配置、数据处理、模型实现、工具模块以及训练脚本（train.py / train.sh）。',
    codeNoteEn: 'The public code repository includes configs, dataset utilities, model implementation, supporting utilities, and training scripts (train.py / train.sh).',
    featured: true,
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
    codeStatus: 'available',
    codeVerifiedAt: '2026-09-20',
    codeNoteZh: '公开仓库包含模型、数据预处理、训练与测试脚本，以及依赖说明。',
    codeNoteEn: 'The public repository includes model code, dataset preprocessing, training and testing scripts, and dependency instructions.',
    featured: true,
  },
];

export const featuredPapers = papers.filter((paper) => paper.featured);

export const publicPaperCategories = Array.from(
  new Set(papers.map((paper) => paper.category)),
);
