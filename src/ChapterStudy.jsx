import React,{useMemo,useState} from 'react';
import {sourceRoot} from './content';
import {skillDocument} from './skillSource';
import {vocabulary} from './vocabulary';

const snippets={
 'write-swift':{
  1:['一份值，两个独立副本','struct Reading { var title: String }\nlet original = Reading(title: "初稿")\nvar copy = original\ncopy.title = "修订"\n// original.title 仍是“初稿”；若属性是可变 class，要另查共享。'],
  2:['互斥事实有一个位置','enum LoadState {\n  case idle\n  case loading\n  case success([String])\n  case failure(String)\n}\n// 枚举排除矛盾组合；合法事件与迟到结果仍需转移规则。'],
  3:['保留错误，不静默吞掉','enum LoadError: Error { case invalidResponse(Int) }\nfunc validate(status: Int) throws {\n  guard status == 200 else {\n    throw LoadError.invalidResponse(status)\n  }\n}\n// 调用方 do/try/catch，决定重试或展示原因。'],
  7:['固定的独立子任务，共同等待','// 省略具体网络实现；两个函数都必须提供 async 实现。\nasync let profile = loadProfile()\nasync let readings = loadReadings()\nlet result = try await (profile, readings)\n// 根据实际函数是否 throws 调整 try；任务数量动态时考虑有界 group。'],
  14:['先把状态规则变成可运行测试','import Testing\n\n@Test(arguments: [0, 1, 1284])\nfunc countsRemainNonnegative(count: Int) {\n  #expect(count >= 0)\n}\n// 这是测试语法示意。实际应测试加载、取消、重试和迟到结果。']
 },
 'animate-expo':{5:['连续值走短路径 · 片段非完整组件','const y = useSharedValue(0);\nconst style = useAnimatedStyle(() => ({\n  transform: [{ translateY: y.get() }],\n}));\n// 手势 onUpdate 在 UI runtime 写 y.set(...)\n// onEnd 确认提交后 scheduleOnRN(onClose)；不逐帧回调。']},
 'ask-sonner':{2:['同一任务，同一 id','const id = toast.loading("保存中…");\ntry {\n  await save();\n  toast.success("已保存", { id });\n} catch {\n  toast.error("保存失败，请重试", { id });\n}\n// save 由业务实现；重要错误也留在页面上下文。']},
 'mobile-native':{4:['背景到边缘，内容留在安全区','/* 配合 viewport-fit=cover，仍需真机验证 */\n.bottom-action {\n  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));\n}\nbutton { -webkit-user-select: none; user-select: none; }\n/* 不在正文上禁用选择，也不禁用页面缩放。 */']}
};

export function LessonGuide({chapter}){return <div className="chapter-guide lesson-guide"><h2>本章阅读地图</h2><p>{chapter.id==='write-swift'?'可以分三次阅读：状态与错误、并发与抽象、性能与迁移。每次只完成一个可解释的判断。':'先理解用途与判断顺序，再对照案例，最后离开正文独立回忆。'}</p><details><summary>展开 {chapter.sections.length} 个主题</summary><nav aria-label="本章主题导航">{chapter.sections.map(([title],i)=><a key={title} href={`#section-${i}`} onClick={e=>{e.preventDefault();document.getElementById(`section-${i}`)?.scrollIntoView()}}><span>{i+1}</span>{title}</a>)}</nav></details></div>}

export function LessonSectionStudy({chapter,section}){
 const study=chapter.worked?.section===section?chapter.worked:null;
 const snippet=snippets[chapter.id]?.[section];
 return <>{study&&<div className="reading-table lesson-case"><table><caption>{study.title}</caption><thead><tr>{study.headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{study.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}{snippet&&<details className="reference-panel lesson-code"><summary>{snippet[0]}<span>展开代码 +</span></summary><div><pre><code>{snippet[1]}</code></pre><p>教学片段，用于解释本节判断；未作为独立程序在本书中编译验证。接入时补齐上下文并核对版本。</p></div></details>}{chapter.id==='animation-vocabulary'&&section===6&&<VocabularyIndex/>}</>
}

function VocabularyIndex(){
 const [query,setQuery]=useState(''),[group,setGroup]=useState('全部');
 const groups=[...new Set(vocabulary.map(item=>item.group))];
 const filtered=vocabulary.filter(item=>(group==='全部'||item.group===group)&&`${item.term} ${item.zh} ${item.explanation}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <details className="inline-study vocabulary-study"><summary>打开反向词典 · {vocabulary.length} 个原文词条</summary><p>先用自己的话描述，再查词。中文为教学转述；展开可对照英文原句。性能词的适用条件以上文解释为准。</p><label className="study-field">搜索名称或现象<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="试试：越界、透明度、Spring"/></label><label className="study-field">词条类别<select aria-label="词条类别" value={group} onChange={e=>setGroup(e.target.value)}><option>全部</option>{groups.map(name=><option key={name}>{name}</option>)}</select></label><p role="status">显示 {filtered.length} / {vocabulary.length} 项</p><div className="vocabulary-results">{filtered.map(item=><details key={item.term}><summary><strong>{item.term}</strong><span>{item.zh}</span></summary><p>{item.explanation}</p><p lang="en" className="source-note">原文：{item.original}</p></details>)}</div>{!filtered.length&&<p>没有匹配项。试着改写现象，或清除类别；词典外的效果应明确标为近似。</p>}</details>
}

export function LessonRecall({chapter}){
 const document=useMemo(()=>skillDocument(chapter),[chapter.id]);
 return <><section className="recall-study lesson-recall" aria-labelledby="lesson-recall-title"><h2 id="lesson-recall-title">合上正文，再解释三个判断</h2><p>先口述或把答案写进章末笔记，再展开对照。隔天不看答案再回答，并换成自己的项目场景。</p>{chapter.recall.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section><details className="coverage-index lesson-coverage"><summary>回到原文：主题与附属材料</summary><p>主题顺序按本书教学安排，原文顺序保持不变。一个原文段落可能跨多个教学小节；接口和工作约定仍应对照完整文件。</p><dl>{chapter.sections.map(([title],i)=>{const blocks=document.blocks.filter(block=>block.step===i);return <div key={title}><dt><a href={`#section-${i}`} onClick={e=>{e.preventDefault();globalThis.document.getElementById(`section-${i}`)?.scrollIntoView()}}>{i+1} · {title}</a></dt><dd>{blocks.length?blocks.map(block=>`${block.title}（L${block.start+1}–${block.end}）`).join('；'):'承接相邻原文主题的教学解释与案例'}</dd></div>})}</dl><a href={`${sourceRoot}/${chapter.id}/SKILL.md`} target="_blank" rel="noreferrer">固定版本 SKILL.md</a>{chapter.sources?.map(file=><p key={file}><a href={`${sourceRoot}/${chapter.id}/${file}`} target="_blank" rel="noreferrer">{file} · 本章已解释其用途与关键约定</a></p>)}{chapter.links?.map(([title,url])=><p key={url}><a href={url} target="_blank" rel="noreferrer">{title} · 接入时核对版本</a></p>)}</details></>
}
