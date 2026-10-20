import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {chapters} from '../src/content.js';
import {readFile} from 'node:fs/promises';

test('every chapter has a working lab, source and accessible quiz at desktop and phone sizes',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  for(const c of chapters){
   await page.goto('/#'+c.id);
   await expect(page.locator('h1')).toHaveText(c.title);
   await expect(page.locator('.demo-stage')).toBeVisible();
   await expect(page.locator('.chapter-sources a')).toHaveAttribute('href',new RegExp(c.id+'/SKILL.md'));
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: ${c.id} no horizontal overflow`).toBeTruthy();
   const bounds=await page.locator('.demo-stage').boundingBox();expect(bounds.width).toBeGreaterThan(200);
  }
 }
 expect(errors).toEqual([]);
});

test('learning loop: wrong answer, correction, notes, completion, reload and due review',async({page})=>{
 await page.goto('/#emil-design-eng');
 await expect(page.getByRole('button',{name:'标记已练习',exact:true})).toBeDisabled();
 await page.locator('.quiz-options button').nth(0).click();
 await expect(page.locator('.quiz-feedback')).toContainText('再想一想');
 await page.locator('.quiz-options button').nth(1).click();
 await expect(page.locator('.quiz-feedback')).toContainText('判断成立');
 await page.locator('#notes').fill('输入、执行、结果需要分别反馈。');
 await page.getByRole('button',{name:'标记已练习',exact:true}).click();
 await page.reload();
 await expect(page.locator('#notes')).toHaveValue('输入、执行、结果需要分别反馈。');
 await expect(page.getByRole('button',{name:'已练习',exact:true})).toBeDisabled();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出笔记'}).click();expect((await download).suggestedFilename()).toContain('学习笔记');
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('feel-book-v1'));s.progress['emil-design-eng'].due=Date.now()-1000;localStorage.setItem('feel-book-v1',JSON.stringify(s))});
 await page.goto('/#review');await page.reload();
 await expect(page.locator('.review-overview')).toContainText('到期可复习');
 await page.locator('.review-row').click();
 await page.locator('.quiz-options button').nth(1).click();
 await page.getByRole('button',{name:'记录本次回忆'}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('feel-book-v1')).progress['emil-design-eng'].round)).toBe(1);
});

test('easing slider uses real curve math and motion preference survives reload',async({page})=>{
 await page.goto('/#animate');const slider=page.getByRole('slider',{name:'时间位置'});await slider.fill('50');
 await expect(page.locator('.race>div').nth(0)).toContainText('50%');
 await expect(page.locator('.race>div').nth(1)).toContainText('97%');
 await page.getByRole('button',{name:'Ease-in · 反例',exact:true}).click();
 await expect(page.locator('.race>div').nth(1)).toContainText('32%');
 await page.getByRole('button',{name:'开启减少动态效果'}).click();await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-reduce','true');
 await page.getByRole('button',{name:'播放',exact:true}).click();await expect(slider).toHaveValue('100');
});

test('toast updates the same notification and undo restores actual state',async({page})=>{
 await page.goto('/#ask-sonner');await page.getByRole('button',{name:'模拟成功',exact:true}).click();
 await expect(page.locator('[data-sonner-toast]')).toHaveCount(1);await expect(page.locator('[data-sonner-toast]')).toContainText('练习已保存');
 await page.getByRole('button',{name:'移除本章演示书签',exact:true}).click();
 await expect(page.getByRole('button',{name:'书签已移除 · 可在通知中撤销'})).toBeDisabled();
 await page.getByRole('button',{name:'撤销',exact:true}).click();
 await expect(page.getByRole('button',{name:'移除本章演示书签',exact:true})).toBeEnabled();
});

test('all experiment controls produce their stated results',async({page})=>{
 await page.goto('/#write-swift');await expect(page.getByRole('button',{name:'成功',exact:true})).toBeDisabled();await page.getByRole('button',{name:'开始加载',exact:true}).click();await page.getByRole('button',{name:'失败',exact:true}).click();await expect(page.locator('.state-scene')).toContainText('连接中断');
 await page.goto('/#animation-performance');await page.getByRole('button',{name:'120 Hz',exact:true}).click();await page.getByRole('slider',{name:'脚本工作'}).fill('10');await expect(page.locator('.budget-head')).toContainText('超出预算');
 await page.goto('/#break-ui');await page.getByRole('button',{name:'长文本 / 缺失',exact:true}).click();await expect(page.locator('.member-list')).toContainText('Wiśniewska');await page.getByRole('textbox',{name:'试一个名字'}).fill('👩🏽‍🎨 创作者');await expect(page.locator('.avatar').first()).toHaveText('👩🏽‍🎨');await page.getByRole('button',{name:'空集合',exact:true}).click();await expect(page.locator('.member-list')).toContainText('还没有成员');
 await page.goto('/#review-animations');await page.getByRole('button',{name:'项目设置'}).click();await page.getByRole('button',{name:'修正后',exact:true}).click();await expect(page.locator('.demo-menu')).toHaveCSS('transform-origin','0px 0px');
 await page.goto('/#apple-design');await page.getByRole('button',{name:'推向右 →'}).click();await expect.poll(()=>page.locator('.spring-ball').evaluate(el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41))).toBeLessThan(.1);
});

test('navigation, sources, glossary and phone menu remain reachable',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'概念索引',exact:true}).click();await page.getByRole('textbox',{name:'搜索概念'}).fill('阻尼');await expect(page.locator('.glossary>div')).toHaveCount(1);
 await page.getByRole('button',{name:'来源与编写说明'}).click();await expect(page.locator('h1')).toHaveText('一本有出处的书。');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'打开目录'}).click();await page.getByRole('textbox',{name:'搜索章节'}).fill('animate-expo');await page.locator('.nav-group button').click();await expect(page.locator('h1')).toHaveText('让手指与界面保持同步');await expect(page.locator('.sidebar')).not.toHaveClass(/shown/);
});

test('baseline accessibility on cover, lesson and glossary',async({page})=>{
 for(const route of ['cover',...chapters.map(c=>c.id),'glossary','review','sources']){
  await page.goto('/#'+route);
  await page.evaluate(()=>Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{}))));
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
});

test('system reduced motion stops decorative animation and keeps information',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-reduce','true');
 expect(await page.locator('.cover-study .curve-line').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await page.goto('/#animation-vocabulary');await page.getByRole('button',{name:'交叉淡化',exact:true}).click();
 await expect(page.locator('.readout')).toContainText('静态终态');
});


test('mobile directory restores focus after Escape and traps Tab',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await page.getByRole('button',{name:'打开目录'}).click();
 await expect(page.getByRole('textbox',{name:'搜索章节'})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'打开目录'})).toBeFocused();
 await page.getByRole('button',{name:'打开目录'}).click();
 await page.locator('.sidebar-footer button').focus();await page.keyboard.press('Tab');
 await expect(page.locator('.brand')).toBeFocused();
 await page.getByRole('dialog').getByRole('button',{name:'关闭目录'}).click();
 await expect(page.getByRole('button',{name:'打开目录'})).toBeFocused();
});


test('cover renders, replays and survives a chapter round trip',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#cover');
 await expect(page.locator('.cover h1')).toContainText('感觉');
 await page.getByRole('button',{name:'重播封面动效'}).click();
 await expect(page.locator('.cover-study .curve-plot svg')).toBeVisible();
 await page.getByRole('button',{name:'开始感受',exact:true}).click();
 await expect(page.locator('.chapter-header h1')).toBeVisible();
 await page.getByRole('button',{name:'序 · 从看见，到感知',exact:true}).click();
 await expect(page.locator('.cover h1')).toContainText('感觉');
 expect(errors).toEqual([]);
});


test('laboratory keeps its interactive values and notes beside the source editor',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/#animate');
 await expect(page.locator('.skill-editor')).toBeVisible();
 await page.locator('#experiment').scrollIntoViewIfNeeded();
 await page.getByRole('slider',{name:'时间位置'}).fill('25');
 const dot=page.locator('.curve-dot');await expect(dot).toHaveAttribute('cx','115');
 const progress=await page.locator('.race>div').nth(1).locator('strong').innerText();
 await expect(page.locator('.curve-explanation')).toContainText(progress);
 await page.getByRole('button',{name:'Linear',exact:true}).click();
 await expect(page.locator('.race>div').nth(1)).toContainText('25%');
 await page.locator('#notes').fill('浅色阅读版继续保留学习记录');await page.reload();
 await expect(page.locator('#notes')).toHaveValue('浅色阅读版继续保留学习记录');
 expect(await page.locator('html').evaluate(el=>getComputedStyle(el).colorScheme)).toBe('light');
});

test('prologue explains skills through a usable development workflow',async({page})=>{
 await page.goto('/#cover');
 await expect(page.locator('#skill-background')).toContainText('SKILL.md');
 await page.getByRole('button',{name:'3 实现交互',exact:true}).click();
 await expect(page.locator('.workflow-body')).toContainText('Web');
 await page.getByRole('button',{name:'4 检验结果',exact:true}).click();
 await expect(page.locator('.workflow-body')).toContainText('可复现证据');
 await page.getByText('查看这一阶段的提问示例',{exact:true}).click();
 await expect(page.locator('.prompt-example p')).toContainText('review-animations');
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`cover at ${width}`).toBeTruthy();
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('.skill-links').getByRole('button',{name:'review-animations',exact:true}).click();
 await expect(page.locator('h1')).toHaveText('把“感觉不对”变成证据');
});

test('expanded first chapter supports deep navigation, clipping and recall feedback',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/#emil-design-eng');
 await page.getByRole('navigation',{name:'第一章阅读导航'}).getByRole('link',{name:/理解实现约束/}).click();
 await expect(page.locator('#section-6')).toBeInViewport();
 await expect(page.locator('.source-context')).toContainText('进阶工具');
 await page.getByRole('slider',{name:'裁切可见比例'}).fill('75');
 await expect(page.locator('.clip-study>div').last()).toHaveCSS('clip-path','inset(0px 25% 0px 0px)');
 await expect(page.locator('.inline-study .readout').last()).toContainText('右侧裁去 25%');
 await page.getByText('弹簧一定要弹吗？什么情境下比固定曲线更合适？',{exact:true}).click();
 await expect(page.locator('.recall-study details').first().locator('p')).toContainText('足够阻尼可以没有反弹');
 await page.getByText('回到原文：本章主题索引',{exact:true}).click();
 await page.locator('.coverage-index').getByRole('link',{name:'手势与拖动',exact:true}).click();
 await expect(page.locator('#section-7')).toBeInViewport();
 expect(new URL(page.url()).hash).toBe('#emil-design-eng');
});

test('desktop directory collapses, restores and persists without clearing notes',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/#emil-design-eng');
 await page.locator('#notes').fill('目录布局改变不应影响笔记');
 await page.getByRole('button',{name:'收起目录',exact:true}).click();
 await expect(page.locator('.sidebar')).toBeHidden();
 await expect(page.locator('.book-body')).toHaveCSS('margin-left','0px');
 await expect(page.getByRole('button',{name:'展开目录',exact:true})).toHaveAttribute('aria-expanded','false');
 await page.reload();
 await expect(page.locator('.sidebar')).toBeHidden();
 await expect(page.locator('#notes')).toHaveValue('目录布局改变不应影响笔记');
 await page.getByRole('button',{name:'展开目录',exact:true}).click();
 await expect(page.locator('.sidebar')).toBeVisible();
});

test('source reveals by topic, can pause, and retains revealed text when reading back',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/#emil-design-eng');
 const count=()=>page.locator('.source-text').count();
 const initial=await count();
 await page.locator('#section-1').evaluate(el=>el.scrollIntoView({block:'start'}));
 await expect.poll(count).toBeGreaterThan(initial);
 await expect(page.locator('.source-context')).toContainText('这个动作有多频繁');
 await page.getByRole('button',{name:'暂停跟随阅读',exact:true}).click();
 const paused=await count();
 await page.locator('#section-8').evaluate(el=>el.scrollIntoView({block:'start'}));
 await expect(page.locator('.source-context')).toContainText('暂停中');
 expect(await count()).toBe(paused);
 await page.getByRole('button',{name:'恢复跟随阅读',exact:true}).click();
 await expect.poll(count).toBeGreaterThan(paused);
 await expect(page.locator('.source-current').first()).toContainText('Performance Rules');
 const advanced=await count();
 await page.locator('#section-0').evaluate(el=>el.scrollIntoView({block:'start'}));
 await expect(page.locator('.source-context')).toContainText('品味可以训练');
 expect(await count()).toBe(advanced);
 await expect(page.locator('.source-current').first()).toContainText('Core Philosophy');
});

test('every completed chapter reconstructs its exact SKILL.md snapshot with original line numbers',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 for(const chapter of chapters){
  await page.goto('/#'+chapter.id);
  await page.locator('#practice').evaluate(el=>el.scrollIntoView({block:'start'}));
  await expect(page.locator('.source-gap')).toHaveCount(0);
  const source=await readFile(`sources/emilkowalski-skills/skills/${chapter.id}/SKILL.md`,'utf8');
  expect((await page.locator('.source-text').allTextContents()).join('\n'),chapter.id).toBe(source.replace(/\n$/,''));
  await expect(page.locator('.source-line-number').first()).toHaveText('1');
  await expect(page.locator('.source-line-number').last()).toHaveText(String(source.replace(/\n$/,'').split('\n').length));
 }
});

test('phone source opens as a keyboard accessible dialog and follows the current chapter',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#emil-design-eng');
 await page.locator('#section-3').evaluate(el=>el.scrollIntoView({block:'start'}));
 await page.getByRole('button',{name:/查看 SKILL.md/}).click();
 await expect(page.getByRole('dialog',{name:'SKILL.md 原文编辑器'})).toBeVisible();
 await expect(page.locator('.source-context')).toContainText('把目的写成运动配方');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(result.violations.map(v=>v.id)).toEqual([]);
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toBeHidden();
 await expect(page.getByRole('button',{name:/查看 SKILL.md/})).toBeFocused();
 await page.getByRole('button',{name:/查看 SKILL.md/}).click();
 await page.getByRole('button',{name:'关闭原文编辑器',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeHidden();
});

test('expanded lessons offer navigation, worked cases, recall and source-aligned progression',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 for(const chapter of chapters.filter(c=>c.recall)){
  await page.goto('/#'+chapter.id);
  await expect(page.locator('.prose-section')).toHaveCount(chapter.sections.length);
  await page.locator('.lesson-guide summary').click();
  const last=chapter.sections.length-1;
  await page.getByRole('navigation',{name:'本章主题导航'}).getByRole('link').last().click();
  await expect(page.locator(`#section-${last}`)).toBeInViewport();
  await expect(page.locator('.source-context')).toContainText(chapter.sections[last][0]);
  await expect(page.locator('.lesson-case caption')).toHaveText(chapter.worked.title);
  for(const [question,answer] of chapter.recall){
   const item=page.locator('.lesson-recall details').filter({has:page.getByText(question,{exact:true})});
   await item.locator('summary').click();await expect(item.locator('p')).toHaveText(answer);
  }
  await page.locator('.lesson-coverage summary').click();
  await expect(page.locator('.lesson-coverage dl>div')).toHaveCount(chapter.sections.length);
  for(const file of chapter.sources||[])await expect(page.locator('.lesson-coverage').getByRole('link',{name:new RegExp('^'+file)})).toHaveAttribute('href',new RegExp(chapter.id+'/'+file));
 }
});

test('all source themes have teaching checkpoints and the vocabulary includes every original term',async({page})=>{
 await page.goto('/#animation-vocabulary');
 const sourceMap=await page.evaluate(async chapters=>{
  const {skillDocument}=await import('/src/skillSource.js');
  return chapters.map(c=>({id:c.id,unmapped:skillDocument(c).blocks.filter(b=>b.level>1&&b.title!=='Initial Response'&&b.step>=c.sections.length).map(b=>b.title)}));
 },chapters);
 expect(sourceMap.filter(c=>c.unmapped.length)).toEqual([]);
 await page.locator('.vocabulary-study>summary').click();
 const original=await readFile('sources/emilkowalski-skills/skills/animation-vocabulary/SKILL.md','utf8');
 const names=[...original.split('## Glossary')[1].matchAll(/^- \*\*(.+?)\*\* — /gm)].map(m=>m[1]);
 expect(await page.locator('.vocabulary-results summary strong').allTextContents()).toEqual(names);
 await page.getByRole('searchbox',{name:'搜索名称或现象'}).fill('越界');
 await expect(page.locator('.vocabulary-results details')).toHaveCount(1);
 await page.locator('.vocabulary-results summary').click();
 await expect(page.locator('.vocabulary-results')).toContainText('Rubber-banding');
 await expect(page.locator('.vocabulary-results')).toContainText('原文：');
 await page.getByRole('searchbox',{name:'搜索名称或现象'}).fill('');
 await page.getByLabel('词条类别',{exact:true}).selectOption('Easing');
 await expect(page.locator('.vocabulary-results details')).toHaveCount(7);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>v.id)).toEqual([]);
});

test('expanded teaching panels remain readable at 320px with source and notes intact',async({page})=>{
 await page.setViewportSize({width:320,height:900});
 for(const chapter of chapters.filter(c=>c.recall)){
  await page.goto('/#'+chapter.id);
  await page.locator('.lesson-guide summary').click();
  for(const item of await page.locator('.lesson-code summary').all())await item.click();
  await page.locator('.lesson-coverage summary').click();
  if(chapter.id==='animation-vocabulary')await page.locator('.vocabulary-study>summary').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),chapter.id).toBeTruthy();
 }
 await page.goto('/#write-swift');await page.locator('#notes').fill('await 后重查假设');await page.reload();await expect(page.locator('#notes')).toHaveValue('await 后重查假设');
 await page.locator('#section-10').evaluate(el=>el.scrollIntoView({block:'start'}));
 await page.getByRole('button',{name:/查看 SKILL.md/}).click();
 await expect(page.locator('.source-context')).toContainText('some / any');
 await expect(page.locator('.source-current').first()).toContainText('Protocols and generics');
});
