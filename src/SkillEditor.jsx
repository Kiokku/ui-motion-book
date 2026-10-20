import React,{useEffect,useMemo,useRef,useState} from 'react';
import {FileCode2,LockKeyhole,Unlock,X,ExternalLink} from 'lucide-react';
import {skillDocument} from './skillSource';
import {revision,sourceRoot} from './content';

export default function SkillEditor({chapter}){
 const documentSource=useMemo(()=>skillDocument(chapter),[chapter.id]);
 const [reading,setReading]=useState(-1),[reached,setReached]=useState(-1),[following,setFollowing]=useState(true),[compact,setCompact]=useState(matchMedia('(max-width:1100px)').matches),[open,setOpen]=useState(false);
 const pane=useRef(null),dialog=useRef(null);
 useEffect(()=>{const media=matchMedia('(max-width:1100px)');const update=e=>{setCompact(e.matches);setOpen(false)};media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{
  const sections=[...chapter.sections.map((_,i)=>document.getElementById(`section-${i}`)),document.getElementById('practice')];
  let frame=0;
  const measure=()=>{frame=0;const edge=Math.min(innerHeight*.32,230);let step=-1;sections.forEach((section,i)=>{if(section?.getBoundingClientRect().top<=edge)step=i});setReading(step)};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  const resize=new ResizeObserver(schedule);resize.observe(document.querySelector('.chapter-main'));
  schedule();
  return()=>{cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[chapter.id]);
 useEffect(()=>{if(following)setReached(previous=>Math.max(previous,reading))},[reading,following]);
 useEffect(()=>{
  if(!compact||!open)return;
  dialog.current.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{dialog.current?.close();document.body.style.overflow=previous};
 },[open,compact]);
 useEffect(()=>{
  if(!following||!pane.current||(compact&&!open))return;
  const target=pane.current.querySelector(`[data-step="${reading}"]`);
  if(target)pane.current.scrollTop+=target.getBoundingClientRect().top-pane.current.getBoundingClientRect().top-26;
 },[reading,reached,following,open,compact]);
 const shown=documentSource.blocks.filter(block=>block.step<=reached).reduce((sum,block)=>sum+block.end-block.start,0);
 const groups=[];
 for(const block of documentSource.blocks){
  if(block.step<=reached)groups.push({...block,revealed:true});
  else if(groups.at(-1)&&!groups.at(-1).revealed)groups.at(-1).end=block.end;
  else groups.push({...block,revealed:false});
 }
 const current=reading<0?'进入正文，原文开始补全':reading<chapter.sections.length?chapter.sections[reading][0]:'章末练习 · 完整原文';
 const content=<>
  <header className="source-header"><div><FileCode2 size={16}/><h2>SKILL.md</h2><span>原文 · 只读</span></div><div><button className="source-follow" aria-label={following?'暂停跟随阅读':'恢复跟随阅读'} aria-pressed={!following} onClick={()=>setFollowing(value=>!value)} title={following?'暂停自动补全与定位':'恢复自动补全与定位'}>{following?<Unlock size={14}/>:<LockKeyhole size={14}/>}<span>{following?'跟随阅读':'已暂停'}</span></button>{compact&&<button className="icon-button" aria-label="关闭原文编辑器" onClick={()=>setOpen(false)}><X size={18}/></button>}</div></header>
  <div className="source-path">skills / <strong>{chapter.id}</strong> / SKILL.md</div>
  <div className="source-context"><span className="source-state-dot"/><span>{following?current:'暂停中 · 可以自由浏览已展开内容'}</span></div>
  <div ref={pane} className="source-scroll" tabIndex={0} role="region" aria-label="SKILL.md 原文内容">
   <pre className="source-code"><code>{groups.map(block=>block.revealed?<span className={`source-block ${following&&block.step===reading?'source-current':''}`} key={block.start} data-step={block.step}>{documentSource.lines.slice(block.start,block.end).map((line,i)=><span className={`source-line ${/^#{1,4} /.test(line)?'source-heading':/^\s*```/.test(line)?'source-fence':''}`} key={block.start+i}><span className="source-line-number" aria-hidden="true">{block.start+i+1}</span><span className="source-text">{line}</span></span>)}</span>:<span className="source-gap" key={block.start}><span aria-hidden="true">{block.start+1}–{block.end}</span><span>后续原文 · 随阅读逐段补全</span></span>)}</code></pre>
   {reading<0&&<p className="source-empty-note">向下阅读正文。每到一个主题，对应的原文就会在这里展开，并保留原始行号。</p>}
  </div>
  <footer className="source-footer"><span role="status">已展开 {shown} / {documentSource.lines.length} 行</span><a href={`${sourceRoot}/${chapter.id}/SKILL.md`} target="_blank" rel="noreferrer">快照 {revision.slice(0,7)}<ExternalLink size={11}/></a></footer>
 </>;
 return compact?<><button className="source-launcher" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-controls="skill-source"><FileCode2 size={16}/>查看 SKILL.md<span>{Math.round(shown/documentSource.lines.length*100)}%</span></button><dialog ref={dialog} id="skill-source" className="source-dialog" aria-label="SKILL.md 原文编辑器" onCancel={()=>setOpen(false)}>{content}</dialog></>:<aside className="skill-editor" id="skill-source" aria-label="随阅读补全的 SKILL.md">{content}</aside>;
}
