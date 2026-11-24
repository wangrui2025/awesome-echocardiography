import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const origin = 'https://awesome-echocardiography.vercel.app';
const paperFields = new Set('id title authors venue year category datasets summaryZh summaryEn paperUrl projectUrl repositoryUrl codeStatus codeVerifiedAt codeNoteZh codeNoteEn sourceUrl sourceUrlEn'.split(' '));
const datasetFields = new Set('name full noteZh noteEn datasetUrl paperUrl codeUrl sourceUrl'.split(' '));
function objectKeys(record, allowed) {
  assert.ok(record && typeof record === 'object' && !Array.isArray(record));
  assert.ok(Object.keys(record).every(key => allowed.has(key)), 'unexpected reader record field');
}
export function validateReader(read) {
  const index = JSON.parse(read('agent/site.json'));
  assert.equal(index.schemaVersion, 1);
  assert.equal(index.site, origin);
  assert.match(index.scope, /not a systematic review or clinical recommendation/);
  assert.ok(index.routes.length > 0 && index.papers.length > 0 && index.datasets.length > 0);
  function localPage(value) {
    const url = new URL(value);
    assert.equal(url.origin, origin, 'reader source must be same-site');
    assert.equal(url.search, '');
    assert.ok(/^\/(?:en\/)?(?:papers|map|metrics|datasets\/[a-z0-9-]+)\/$/.test(url.pathname), 'unapproved source route');
    const html = read(url.pathname.slice(1) + 'index.html');
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.match(id, /^[a-zA-Z0-9_-]+$/);
      assert.ok(html.includes('id="' + id + '"') || html.includes("id='" + id + "'"), 'missing source fragment');
    }
    return html;
  }
  function external(value) {
    if (value === undefined || value === null || value === '') return;
    const url = new URL(value);
    assert.equal(url.protocol, 'https:', 'reader primary source must be HTTPS');
    assert.equal(url.username, '');
    assert.equal(url.password, '');
  }
  for (const route of index.routes) {
    objectKeys(route, new Set(['path','zh','en','purpose','url','enUrl']));
    assert.equal(route.url, origin + route.path);
    assert.equal(route.enUrl, origin + '/en' + route.path);
    localPage(route.url); localPage(route.enUrl);
  }
  const ids = new Set();
  for (const paper of index.papers) {
    objectKeys(paper, paperFields);
    assert.ok(paper.id && paper.title && paper.codeStatus && !ids.has(paper.id), 'missing/duplicate paper identity');
    ids.add(paper.id);
    assert.equal(paper.sourceUrl, origin + '/papers/#' + paper.category);
    assert.equal(paper.sourceUrlEn, origin + '/en/papers/#' + paper.category);
    localPage(paper.sourceUrl); localPage(paper.sourceUrlEn);
    assert.ok(paper.codeVerifiedAt && /^\d{4}-\d{2}-\d{2}$/.test(paper.codeVerifiedAt), 'missing dated code-status evidence');
    for (const key of ['paperUrl','projectUrl','repositoryUrl']) external(paper[key]);
  }
  for (const dataset of index.datasets) {
    objectKeys(dataset, datasetFields);
    assert.ok(dataset.name && dataset.sourceUrl);
    localPage(dataset.sourceUrl);
    for (const key of ['datasetUrl','paperUrl','codeUrl']) external(dataset[key]);
  }
  for (const file of ['llms.txt','agent/SKILL.md']) {
    const text = read(file);
    assert.ok(text.includes(origin + '/agent/site.json'), file + ' cannot discover catalog');
    assert.match(text, /not|Do not/);
  }
  for (const file of ['agent/index.html','en/agent/index.html']) {
    const html = read(file);
    for (const part of ['id="reader-context"','id="reader-copy"','/agent/site.json','/llms.txt','/agent/SKILL.md']) assert.ok(html.includes(part), file + ' missing ' + part);
  }
  return {papers:index.papers.length,datasets:index.datasets.length,sourceRoutes:index.routes.length};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result=validateReader(name => readFileSync(resolve('dist', name), 'utf8'));
  console.log('PASS public reader output, allowlisted fields and real local source paths/fragments', result);
}
