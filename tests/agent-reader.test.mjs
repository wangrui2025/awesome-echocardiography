import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateReader } from '../scripts/check-agent-reader.mjs';

const origin = 'https://awesome-echocardiography.vercel.app';
function fixture() {
  const index={schemaVersion:1,site:origin,scope:'Public index, not a systematic review or clinical recommendation.',
    routes:[{path:'/papers/',zh:'论文',en:'Papers',purpose:'Index',url:origin+'/papers/',enUrl:origin+'/en/papers/'}],
    papers:[{id:'demo',title:'Paper',category:'methods',codeStatus:'available',codeVerifiedAt:'2026-01-01',paperUrl:'https://example.org/paper',sourceUrl:origin+'/papers/#methods',sourceUrlEn:origin+'/en/papers/#methods'}],
    datasets:[{name:'Dataset',sourceUrl:origin+'/datasets/example/',datasetUrl:'https://example.org/data'}]};
  const read = name => {
    if(name==='agent/site.json') return JSON.stringify(index);
    if(name==='agent/index.html'||name==='en/agent/index.html')return '<textarea id="reader-context"></textarea><button id="reader-copy"></button>/agent/site.json /llms.txt /agent/SKILL.md';
    if(name==='llms.txt'||name==='agent/SKILL.md')return 'Do not infer; '+origin+'/agent/site.json';
    if(name==='papers/index.html'||name==='en/papers/index.html')return '<section id="methods"></section>';
    if(name==='datasets/example/index.html')return '<h1>Dataset</h1>';
    throw Error('unregistered fixture path');
  };
  return {index,read};
}
test('approved catalog, exact source fragments and bilingual reader are accepted',()=>{const {read}=fixture();assert.equal(validateReader(read).papers,1)});
test('reject unexpected field, missing source fragment, unapproved route or stale date',()=>{
  for(const change of [
    x=>x.papers[0].privateRecord='synthetic',
    x=>{x.papers[0].category='missing';x.papers[0].sourceUrl=origin+'/papers/#missing';x.papers[0].sourceUrlEn=origin+'/en/papers/#missing'},
    x=>x.datasets[0].sourceUrl=origin+'/private/',
    x=>delete x.papers[0].codeVerifiedAt,
  ]){const {index,read}=fixture();change(index);assert.throws(()=>validateReader(read));}
});
