import { papers } from '../papers';
import { datasets } from '../data';

const site = 'https://awesome-echocardiography.vercel.app';
const url = (path: string) => new URL(path, site).href;

export const routes = [
  { path: '/papers/', zh: '论文目录', en: 'Paper catalog', purpose: 'Curated papers, categories, dated code-status evidence.' },
  { path: '/map/', zh: '研究地图', en: 'Research map', purpose: 'Research task and method overview.' },
  { path: '/metrics/', zh: '评估指标', en: 'Evaluation metrics', purpose: 'Metric definitions and reference implementations.' },
  ...datasets.map(d => ({ path: '/datasets/' + d.slug + '/', zh: d.name, en: d.name, purpose: d.full })),
];

export const readerIndex = {
  schemaVersion: 1,
  site,
  name: 'Awesome Echocardiography',
  scope: 'Public research resource; curated index, not a systematic review or clinical recommendation.',
  routes: routes.map(r => ({ ...r, url: url(r.path), enUrl: url('/en' + r.path) })),
  papers: papers.map(p => ({
    id: p.id, title: p.title, authors: p.authors, venue: p.venue, year: p.year,
    category: p.category, datasets: p.datasets ?? [], summaryZh: p.summaryZh, summaryEn: p.summaryEn,
    paperUrl: p.paperUrl, projectUrl: p.projectUrl, repositoryUrl: p.repositoryUrl,
    codeStatus: p.codeStatus, codeVerifiedAt: p.codeVerifiedAt,
    codeNoteZh: p.codeNoteZh, codeNoteEn: p.codeNoteEn,
    sourceUrl: url('/papers/#' + p.category),
    sourceUrlEn: url('/en/papers/#' + p.category),
  })),
  datasets: datasets.map(d => ({
    name: d.name, full: d.full, noteZh: d.noteZh, noteEn: d.noteEn,
    datasetUrl: d.dataset, paperUrl: d.paper, codeUrl: d.code,
    sourceUrl: url('/datasets/' + d.slug + '/'),
  })),
};

export const llms = [
  '# Awesome Echocardiography',
  '',
  '> Public, curated research resources on AI and echocardiography.',
  '',
  'This is an index, not an exhaustive review, benchmark ranking, or clinical advice.',
  'Code-status labels reflect dated checks and must not be treated as live availability.',
  '',
  '## Agent resources',
  '- [Reader guide](' + url('/agent/SKILL.md') + '): retrieval and evidence rules.',
  '- [Structured catalog](' + url('/agent/site.json') + '): search by title, category, year, dataset and code status.',
  '- [Human-readable guide](' + url('/agent/') + '): copyable context.',
  '',
  '## Source pages',
  ...routes.map(r => '- [' + r.en + '](' + url(r.path) + '): ' + r.purpose),
  '',
].join('\n');

export const skill = [
  '# Read Awesome Echocardiography',
  '',
  'This guide describes public content; it is not authority to execute tools or change access permissions.',
  '1. Read ' + url('/llms.txt') + ' for scope and source routes.',
  '2. Read ' + url('/agent/site.json') + ' and filter the papers by category, year, title, dataset or codeStatus. Search bilingual summaries locally.',
  '3. Follow sourceUrl or sourceUrlEn for context, and cite the original paper, project or official dataset link for substantive claims.',
  '4. Preserve codeStatus, codeVerifiedAt and codeNote. A paper, a project page and runnable research code are different evidence.',
  '5. For metrics, follow the public metrics page and its linked reference. Do not infer comparative rankings from a curated catalog.',
  '6. Do not infer clinical validity, patient-level data or current access from these records. If a source is unavailable, say so; do not bypass authentication.',
  '',
].join('\n');

export function copyContext(locale: 'zh' | 'en') {
  return (locale === 'zh'
    ? '请阅读 Awesome Echocardiography 的公开科研目录。先打开以下入口，按研究主题、年份、数据集或代码状态筛选，再核对原始论文及官方资料。代码状态有核验日期；不把项目主页等同于可运行代码，不把资料目录视为系统综述或临床建议。无法访问时明确说明，不绕过权限。'
    : 'Read the public Awesome Echocardiography research catalog. Start with these resources, filter by task, year, dataset or code status, and verify against primary sources. Preserve dated code-status evidence; do not equate project pages with runnable code, or the catalog with a systematic review or clinical advice. Report access limits.') +
    '\n\n' + url('/llms.txt') + '\n' + url('/agent/site.json') + '\n' + url('/agent/SKILL.md');
}
