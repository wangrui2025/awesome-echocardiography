export const papers = [
  {
    venue: 'CVPR 2026 · Highlight',
    title: 'OSA: Echocardiography Video Segmentation via Orthogonalized State Update and Anatomical Prior-aware Feature Enhancement',
    authors: 'Rui Wang · Huisi Wu · Jing Qin',
    paper: 'https://openaccess.thecvf.com/content/CVPR2026/html/Wang_OSA_Echocardiography_Video_Segmentation_via_Orthogonalized_State_Update_and_Anatomical_CVPR_2026_paper.html',
    code: 'https://github.com/wangrui2025/osa',
    project: 'https://wangrui2025.github.io/osa/en/',
  },
  {
    venue: 'ICCV 2025',
    title: 'GDKVM: Echocardiography Video Segmentation via Spatiotemporal Key-Value Memory with Gated Delta Rule',
    authors: 'Rui Wang · Yimu Sun · Jingxing Guo · Huisi Wu · Jing Qin',
    paper: 'https://openaccess.thecvf.com/content/ICCV2025/html/Wang_GDKVM_Echocardiography_Video_Segmentation_via_Spatiotemporal_Key-Value_Memory_with_Gated_ICCV_2025_paper.html',
    code: 'https://github.com/wangrui2025/GDKVM',
    project: 'https://wangrui2025.github.io/GDKVM/en/',
  },
  {
    venue: 'CVPR 2024 · Oral',
    title: 'MemSAM: Taming Segment Anything Model for Echocardiography Video Segmentation',
    authors: 'Xiaolong Deng · Huisi Wu · Runhao Zeng · Jing Qin',
    paper: 'https://openaccess.thecvf.com/content/CVPR2024/html/Deng_MemSAM_Taming_Segment_Anything_Model_for_Echocardiography_Video_Segmentation_CVPR_2024_paper.html',
    code: 'https://github.com/dengxl0520/MemSAM',
  },
];

export const datasets = [
  {
    name: 'CAMUS',
    slug: 'camus',
    full: 'Cardiac Acquisitions for Multi-structure Ultrasound Segmentation',
    noteEn: '500 patients · A2C and A4C · expert segmentation annotations',
    noteZh: '500 名患者 · A2C 与 A4C · 专家分割标注',
    dataset: 'https://www.creatis.insa-lyon.fr/Challenge/camus/',
    paper: 'https://doi.org/10.1109/TMI.2019.2900516',
  },
  {
    name: 'EchoNet-Dynamic',
    slug: 'echonet-dynamic',
    full: 'Video-based cardiac function assessment',
    noteEn: '10,030 A4C videos · EF and LV tracings',
    noteZh: '10,030 段 A4C 视频 · EF 与左心室轮廓标注',
    dataset: 'https://echonet.github.io/dynamic/',
    paper: 'https://doi.org/10.1038/s41586-020-2145-8',
    code: 'https://github.com/echonet/dynamic',
  },
];
