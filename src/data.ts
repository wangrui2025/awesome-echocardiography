export const datasets = [
  {
    name: 'CAMUS',
    slug: 'camus',
    full: 'Cardiac Acquisitions for Multi-structure Ultrasound Segmentation',
    noteEn: '500 patients · A2C and A4C · expert segmentation annotations',
    noteZh: '500 名患者 · A2C 与 A4C · 专家分割标注',
    dataset: 'https://www.creatis.insa-lyon.fr/Challenge/camus/',
    paper: 'https://doi.org/10.1109/TMI.2019.2900516',
    code: undefined,
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
] as const;
