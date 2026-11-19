import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDate, nonCanonicalDates } from '../src/utils/calendar-date.mjs';
import { styleViolations, inspectHtml } from '../scripts/check-site-design.mjs';

test('display dates preserve precision and never reinterpret timezone or machine identities',()=>{
  for(const [input,en,zh]of [['2026-11-20','2026-11-20','2026年11月20日'],['2026-2','2026-02','2026年2月'],['2026','2026','2026'],['2024-2-29','2024-02-29','2024年2月29日']]){
    assert.equal(calendarDate(input,'en'),en);assert.equal(calendarDate(input,'zh'),zh);
  }
  for(const input of ['2026-02-29','2026-11-20T00:00:00Z','source-2026-1-2.json'])assert.equal(calendarDate(input,'zh'),input);
  assert.equal(nonCanonicalDates('November 20, 2026 / 2026/1/2').length,2);
});
test('guards reject disconnected pages, wrong dates and raw geometry in ordinary spacing',()=>{
  assert.ok(inspectHtml('<html><body>hello</body></html>','body{font-size:16px}').length);
  const css=':root{--echo-design-version:1}body{font-size:var(--text-body)}section{padding:var(--space-4)}';
  assert.deepEqual(inspectHtml('<html lang="en"><time datetime="2026-11-20">2026-11-20</time></html>',css),[]);
  assert.ok(inspectHtml('<html lang="en"><time datetime="2026-11-20">November 20, 2026</time></html>',css).length);
  assert.equal(styleViolations('p{font-size:17px;line-height:1.66;padding:calc(18px);margin:-1px 19px}').length,4);
  assert.deepEqual(styleViolations('p{font-size:var(--text-body);line-height:var(--leading-body);padding:var(--space-4)}'),[]);
});
