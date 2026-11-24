import { test,expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { filesUnder } from '../scripts/check-site-design.mjs';
import { calendarDate } from '../src/utils/calendar-date.mjs';
const routes=filesUnder('dist').filter(file=>file.endsWith('.html')).map(file=>({file,url:'/'+file.slice(5).replace(/index\.html$/,'')}));

for(const route of routes)test(`shared design ${route.url}`,async({page},info)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  expect((await page.goto(route.url)).status()).toBe(200);
  await page.evaluate(()=>document.fonts.ready);
  const initial=await page.evaluate(()=>{
    const body=getComputedStyle(document.body),root=document.documentElement;
    return {version:getComputedStyle(root).getPropertyValue('--echo-design-version').trim(),font:body.fontFamily,size:body.fontSize,leading:body.lineHeight,overflow:root.scrollWidth-innerWidth};
  });
  expect(initial.version).toBe('1');expect(initial.font).toContain('Inter');expect(initial.size).toBe('16px');expect(parseFloat(initial.leading)).toBeCloseTo(26.4,1);expect(initial.overflow).toBeLessThanOrEqual(1);
  // Real utility consumers, including every page's shared main and navigation.
  const utilities=await page.evaluate(()=>{
    const nav=document.querySelector('.topbar'),main=document.querySelector('main');
    return {position:getComputedStyle(main).position,nav:nav&&getComputedStyle(nav).display,
      gap:nav&&getComputedStyle(nav).gap, navWidth:nav?.clientWidth,navScroll:nav?.scrollWidth};
  });
  expect(utilities.position).toBe('relative');
  expect(utilities.nav).toBe('flex');
  expect(utilities.gap).toBe('8px');
  expect(utilities.navScroll).toBeLessThanOrEqual(utilities.navWidth+1);
  const probes=await page.evaluate(async()=>{
    const root=document.documentElement,main=document.querySelector('main');
    const section=document.querySelector('section');
    const roles=[['--font-ui','monospace',document.body,'fontFamily'],['--text-body','18px',document.body,'fontSize'],['--leading-body','2',document.body,'lineHeight'],['--space-unit','.5rem',section,'paddingTop'],['--width-site','20rem',main,'width']];
    const rows=[];
    for(const[token,value,element,property]of roles){
      const before=getComputedStyle(element)[property],old=root.style.getPropertyValue(token);
      root.style.setProperty(token,value);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const after=getComputedStyle(element)[property];if(old)root.style.setProperty(token,old);else root.style.removeProperty(token);
      await new Promise(resolve=>requestAnimationFrame(resolve));
      rows.push({token,property,before,after,restored:getComputedStyle(element)[property]});
    }return rows;
  });
  for(const probe of probes){expect(probe.after,JSON.stringify(probe)).not.toBe(probe.before);expect(probe.restored).toBe(probe.before);}
  const lang=(await page.locator('html').getAttribute('lang')).startsWith('zh')?'zh':'en';
  for(const time of await page.locator('time[datetime]').all())expect(await time.textContent()).toBe(calendarDate(await time.getAttribute('datetime'),lang));
  const source=readFileSync(route.file,'utf8');
  expect(await page.locator('.katex-display').count()).toBe((source.match(/class="katex-display"/g)??[]).length);
  const switcher=page.locator('.language-switcher a').filter({hasText:lang==='zh'?'EN':'中文'});
  const target=await switcher.getAttribute('href');await switcher.click();await expect(page).toHaveURL(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'));
  await page.goto(route.url);
  await info.attach('computed-consumers',{body:JSON.stringify({route,initial,utilities,probes}),contentType:'application/json'});
  await info.attach('rendered-page',{body:await page.screenshot({fullPage:!route.url.includes('metrics')}),contentType:'image/png'});
  if(route.url.includes('metrics'))await info.attach('rendered-math',{body:await page.locator('.katex-display-wrap').first().screenshot(),contentType:'image/png'});
  expect(errors).toEqual([]);
});
