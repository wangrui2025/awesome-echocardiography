import { test,expect } from '@playwright/test';
for(const locale of ['zh','en']) {
  test('reader '+locale+' preserves context, source links and navigation contrast',async({page,request})=>{
    await page.goto(locale==='zh'?'/agent/':'/en/agent/');
    const button=page.locator('#reader-copy'), context=page.locator('#reader-context');
    await expect(button).toBeVisible();
    const value=await context.inputValue();
    expect(value).toContain('/agent/site.json');
    expect(value).toContain('/agent/SKILL.md');
    const r=await request.get('/agent/site.json');
    expect(r.ok()).toBeTruthy();
    const data=await r.json();
    expect(data.papers.length).toBeGreaterThan(0);
    expect(data.datasets.length).toBeGreaterThan(0);
    await button.click();
    await expect(page.locator('#copy-status')).toContainText(/已复制|已选中|Copied|Text selected/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
    await page.goto(locale==='zh'?'/datasets/camus/':'/en/datasets/camus/');
    const rows=await page.locator('.nav-link,.lang-link,.subpage-fullname,.fact-card > span,.feature-index').evaluateAll(nodes=>{
      function lum(color){
        const nums=color.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);
        return nums[0]*.2126+nums[1]*.7152+nums[2]*.0722;
      }
      return nodes.filter(n=>n.getClientRects().length>0).map(n=>{
        const fg=getComputedStyle(n).color;
        let bg='rgba(0, 0, 0, 0)',p=n;
        while(p&&(bg==='rgba(0, 0, 0, 0)'||bg==='transparent')){bg=getComputedStyle(p).backgroundColor;p=p.parentElement;}
        const a=lum(fg),b=lum(bg);
        return {text:n.textContent.trim().slice(0,50),fg,bg,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
      });
    });
    expect(rows.length).toBeGreaterThan(6);
    for(const row of rows)expect(row.contrast,JSON.stringify(row)).toBeGreaterThanOrEqual(4.5);
  });
}

for (const locale of ["zh", "en"]) {
  test("metric formulas are keyboard accessible " + locale, async ({page}) => {
    await page.goto(locale === "zh" ? "/metrics/" : "/en/metrics/");
    const formula = page.locator("#hd95 .katex-display-wrap");
    await expect(formula).toHaveAttribute("tabindex", "0");
    await expect(formula).toHaveAttribute("role", "region");
    await expect(formula).toHaveAccessibleName(/HD95/i);
    await formula.focus();
    await expect(formula).toBeFocused();
    expect(await formula.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  });
}
