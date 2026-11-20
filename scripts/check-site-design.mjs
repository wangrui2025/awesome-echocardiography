import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { calendarDate, nonCanonicalDates } from '../src/utils/calendar-date.mjs';

export function filesUnder(dir) {
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const file=path.join(dir,entry.name);
    return entry.isDirectory()?filesUnder(file):[file];
  }).sort();
}
export function styleViolations(css) {
  const failures=[];
  for(const [,property,value] of css.matchAll(/(?:^|[;{])\s*(font-size|font-family|font-weight|line-height|font|max-width|margin(?:-[\w]+)?|padding(?:-[\w]+)?|gap|row-gap|column-gap)\s*:\s*([^;}]+)/g)) {
    if(/font|line-height/.test(property)&&!value.includes('var(--')&&!/^(inherit|normal)$/.test(value.trim()))failures.push(`${property}: ${value}`);
    if(/max-width|margin|padding|gap/.test(property)&&/[-\d.]+(?:px|rem|em)\b/.test(value))failures.push(`${property}: ${value}`);
  }
  return failures;
}
export function inspectHtml(html, css) {
  const errors=[];
  if(!/--echo-design-version\s*:\s*1\b/.test(css)||!/font-size\s*:\s*var\(--text-body\)/.test(css)||!/padding[^:]*:[^;}]*var\(--space-/.test(css))errors.push('missing executable shared owner');
  const locale=/<html[^>]*lang="zh/.test(html)?'zh':'en';
  for(const [,value,text] of html.matchAll(/<time\b[^>]*datetime="([^"]+)"[^>]*>([^<]+)<\/time>/g))if(text!==calendarDate(value,locale))errors.push(`unformatted date: ${value}`);
  const text=html.replace(/<(script|style|code|pre|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<[^>]*>/g,' ');
  errors.push(...nonCanonicalDates(text).map(value=>`noncanonical date: ${value}`));
  return errors;
}
export function checkDesign({built=false}={}){
  for(const file of filesUnder('src').filter(file=>/\.(css|astro)$/.test(file)&&!file.endsWith('/tokens.css'))){
    const source=readFileSync(file,'utf8');
    const css=file.endsWith('.css')?source:[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]).join('\n');
    const errors=styleViolations(css);if(errors.length)throw new Error(`${file}: ${errors.join('; ')}`);
  }
  if(built){
    const files=filesUnder('dist').filter(file=>file.endsWith('.html'));
    if(!files.length)throw new Error('No built HTML');
    for(const file of files){
      const html=readFileSync(file,'utf8');let css=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]).join('\n');
      for(const [,href]of html.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g))css+=readFileSync(path.join('dist',href),'utf8');
      const errors=inspectHtml(html,css);if(errors.length)throw new Error(`${file}: ${errors.join('; ')}`);
    }
    console.log(`Shared design: ${files.length} / ${files.length} HTML routes consume the site owner.`);
  }else console.log('Shared design: ordinary source typography and spacing pass.');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)checkDesign({built:process.argv.includes('--built')});
