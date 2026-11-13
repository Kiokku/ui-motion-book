import {test,expect} from '@playwright/test';
import {readdir,readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {chapters,revision} from '../src/content.js';

test('all nineteen upstream skills have complete teaching chapters and exact source identity',async()=>{
 const ids=await readdir('sources/emilkowalski-skills/skills');
 expect(chapters.map(c=>c.id).sort()).toEqual(ids.sort());
 expect(new Set(chapters.map(c=>c.id)).size).toBe(19);
 expect(revision).toBe('f7ce8c02d6e3c8f0d980a44c57bcc41a40254349');
 for(const c of chapters.slice(-4)){
  expect(c.sections.length).toBeGreaterThanOrEqual(8);
  expect(c.sections.every(([, ...paragraphs])=>paragraphs.length>=2)).toBeTruthy();
  expect(c.recall).toHaveLength(3);
  expect(c.quiz.answer).toBeLessThan(c.quiz.options.length);
  expect(await readFile(`sources/emilkowalski-skills/skills/${c.id}/SKILL.md`,'utf8')).toContain(`name: ${c.id}`);
 }
});

test('existing learning records survive the chapter expansion and use the new total',async({page})=>{
 await page.goto('/#cover');
 await page.evaluate(()=>localStorage.setItem('feel-book-v1',JSON.stringify({notes:{animate:'旧版笔记仍可阅读'},progress:{animate:{due:Date.now()+86400000,round:0}},last:'animate'})));
 await page.reload();
 await expect(page.locator('.sidebar-footer')).toContainText('1 / 19');
 await page.getByRole('button',{name:'继续上次阅读',exact:true}).click();
 await expect(page.locator('#notes')).toHaveValue('旧版笔记仍可阅读');
 await expect(page.getByRole('button',{name:'已练习',exact:true})).toBeDisabled();
 await page.goto('/#gestures');await expect(page.getByRole('button',{name:'标记已练习',exact:true})).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('feel-book-v1')).notes.animate)).toBe('旧版笔记仍可阅读');
});

test('tooltip group waits first, skips subsequent waits, and Escape dismisses',async({page})=>{
 await page.goto('/#emil-design-eng');
 const study=page.locator('.tooltip-study');
 await study.getByRole('button',{name:'加粗',exact:true}).hover();
 await expect(study.getByRole('tooltip')).toHaveCount(0);
 await expect(study.getByRole('tooltip')).toHaveText('加粗');
 await study.getByRole('button',{name:'斜体',exact:true}).hover();
 await expect(study.getByRole('tooltip')).toHaveText('斜体',{timeout:200});
 await study.getByRole('button',{name:'标记',exact:true}).focus();
 await page.keyboard.press('Escape');await expect(study.getByRole('tooltip')).toHaveCount(0);
 await study.getByRole('button',{name:'每个都等 500ms',exact:true}).click();
 await study.getByRole('button',{name:'加粗',exact:true}).hover();
 await expect(study.getByRole('tooltip')).toHaveText('加粗');
 await study.getByRole('button',{name:'斜体',exact:true}).hover();
 await expect(study.getByRole('tooltip')).toHaveCount(0);
 await expect(study.getByRole('tooltip')).toHaveText('斜体');
});

test('dialog uses asymmetric timing and can reverse while opening',async({page})=>{
 await page.goto('/#animate');const study=page.locator('.dialog-study');
 await study.getByRole('button',{name:'打开演示弹层',exact:true}).click();
 await expect(study.locator('.dialog-model')).toHaveCSS('transition-duration','0.3s, 0.3s');
 await study.getByRole('button',{name:'关闭演示弹层',exact:true}).click();
 await expect(study.locator('.dialog-model')).toHaveCSS('transition-duration','0.15s, 0.15s');
 await expect(study.locator('.dialog-model')).toHaveCSS('opacity','0');
 await study.getByRole('button',{name:'从零放大 · 慢起步',exact:true}).click();
 await expect(study.locator('.dialog-model')).toHaveCSS('transition-duration','0.4s, 0.4s');
});

test('momentum projection changes the legal target and hands motion to a spring',async({page})=>{
 await page.goto('/#apple-design');const study=page.locator('.momentum-study');
 await expect(study.locator('.readout')).toContainText('投射位置 149.8px');
 await expect(study.locator('.readout strong')).toHaveText('100px');
 await study.getByRole('button',{name:'释放并吸附',exact:true}).click();
 await expect.poll(()=>study.locator('.momentum-object').evaluate(el=>parseFloat(el.style.left))).toBe(50);
 await study.getByRole('button',{name:'只看松手位置',exact:true}).click();
 await expect(study.locator('.readout strong')).toHaveText('0px');
 await study.getByRole('button',{name:'投射位置 + 速度交接',exact:true}).click();
 await study.getByRole('slider',{name:'释放速度',exact:true}).fill('-200');
 await expect(study.locator('.readout')).toContainText('投射位置 -49.8px');
 await expect(study.locator('.readout strong')).toHaveText('0px');
});

test('deletion timeline closes the gap concurrently instead of waiting for exit',async({page})=>{
 await page.goto('/#choreograph');
 await page.getByRole('slider',{name:'删除时间',exact:true}).fill('100');
 await expect(page.locator('.demo-stage .readout')).toContainText('补位完成 50%');
 await expect(page.getByTestId('closing-row')).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 99)');
 await page.getByRole('button',{name:'先淡出，再补位',exact:true}).click();
 await page.getByRole('slider',{name:'删除时间',exact:true}).fill('100');
 await expect(page.locator('.demo-stage .readout')).toContainText('补位完成 0%');
 await page.getByRole('slider',{name:'删除时间',exact:true}).fill('300');
 await expect(page.locator('.demo-stage .readout')).toContainText('补位完成 50%');
 await page.getByRole('button',{name:'还原列表',exact:true}).click();
 await expect(page.getByRole('slider',{name:'删除时间',exact:true})).toHaveValue('0');
});

test('gesture uses distance or directional velocity, tracks directly and cancels safely',async({page})=>{
 await page.goto('/#gestures');const status=page.locator('.demo-stage .readout');
 await page.getByRole('button',{name:'短距离慢放',exact:true}).click();await expect(status).toContainText('30px / 80px/s → 回位');
 await page.getByRole('button',{name:'短距离快甩',exact:true}).click();await expect(status).toContainText('30px / 800px/s → 关闭');
 await expect(page.getByTestId('gesture-card')).toHaveCSS('opacity','0');
 await page.getByRole('button',{name:'只看距离',exact:true}).click();
 await page.getByRole('button',{name:'短距离快甩',exact:true}).click();await expect(status).toContainText('30px / 800px/s → 回位');
 await page.getByRole('button',{name:'还原卡片',exact:true}).click();
 const card=page.getByTestId('gesture-card'),box=await card.boundingBox(),cx=box.x+box.width/2,cy=box.y+box.height/2;
 await page.mouse.move(cx,cy);await page.mouse.down();await page.mouse.move(cx+40,cy,{steps:4});
 await expect.poll(()=>card.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBeCloseTo(40,0);
 await card.dispatchEvent('pointercancel',{pointerId:1});
 await expect(status).toContainText('已取消');await expect(status).toContainText('回位');
 await page.mouse.up();
});

test('keyboard experiment follows real keys and has no transition after subtraction',async({page})=>{
 await page.goto('/#remove-animations');const list=page.getByRole('listbox',{name:'命令实验列表'});
 await list.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');
 await expect(page.getByRole('option',{selected:true})).toHaveText('查找概念⌘ K');
 await expect(page.locator('.command-selection')).toHaveCSS('transition-duration','0s');
 await page.getByRole('button',{name:'300ms 高亮追赶',exact:true}).click();
 await expect(page.locator('.command-selection')).toHaveCSS('transition-duration','0.3s');
 await page.getByRole('button',{name:'连续下移四次',exact:true}).click();
 await expect(page.locator('.demo-stage .readout')).toContainText('逻辑选择：阅读设置');
});

test('taste exercise rejects unsupported rules and requires explicit confirmation',async({page})=>{
 await page.goto('/#learn-taste');const confirm=page.getByRole('button',{name:'确认并写入演示文档',exact:true});
 await expect(confirm).toBeDisabled();
 await page.getByRole('radio').nth(2).check();await expect(confirm).toBeDisabled();
 await page.getByRole('radio').nth(1).check();await expect(confirm).toBeEnabled();
 await expect(page.locator('.taste-document')).toContainText('尚未写入');
 await confirm.click();await expect(page.locator('.taste-document')).toContainText('## Surfaces');
 await expect(page.locator('.taste-document')).toContainText('输入框保留边框');
 await page.getByRole('button',{name:'重置练习',exact:true}).click();await expect(page.locator('.taste-document')).toContainText('尚未写入');
});

test('new interaction states and task briefs stay accessible and readable on a small phone',async({page})=>{
 await page.setViewportSize({width:320,height:900});
 for(const id of ['choreograph','gestures','remove-animations','learn-taste','animate','apple-design','emil-design-eng','animation-performance']){
  await page.goto('/#'+id);
  await page.locator('.skill-brief>summary').click();
  await page.locator('.skill-brief .prompt-example>summary').click();
  if(id==='learn-taste'){await page.getByRole('radio').nth(1).check();await page.getByRole('button',{name:'确认并写入演示文档',exact:true}).click()}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id).toBeTruthy();
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),id).toEqual([]);
 }
});

test('new labs respect reduced motion without losing their decision outcomes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#gestures');await page.getByRole('button',{name:'短距离快甩',exact:true}).click();
 await expect(page.locator('.demo-stage .readout')).toContainText('关闭');
 await expect.poll(()=>page.getByTestId('gesture-card').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41)).toBe(180);
 await page.goto('/#choreograph');await page.getByRole('button',{name:'移除中间一项',exact:true}).click();
 await expect(page.getByRole('slider',{name:'删除时间',exact:true})).toHaveValue('200');
 await page.goto('/#apple-design');await page.locator('.momentum-study').getByRole('button',{name:'释放并吸附',exact:true}).click();
 await expect.poll(()=>page.locator('.momentum-object').evaluate(el=>parseFloat(el.style.left))).toBe(50);
});
