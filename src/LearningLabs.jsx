import React,{useState,useRef,useEffect} from 'react';
import {motion,useMotionValue,useTransform,animate} from 'motion/react';

function Choices({items,value,onChange,label='对比方式'}){return <div className="segments" role="group" aria-label={label}>{items.map((item,i)=><button key={item} aria-pressed={value===i} onClick={()=>onChange(i)}>{item}</button>)}</div>}
function Slider({label,value,min=0,max=100,step=1,onChange,unit=''}){return <label className="range-label"><span>{label}<output>{value}{unit}</output></span><input type="range" aria-label={label} value={value} min={min} max={max} step={step} onChange={e=>onChange(+e.target.value)}/></label>}
function Result({children}){return <div className="readout" role="status">{children}</div>}

export function TooltipStudy(){
 const [mode,setMode]=useState(1),[active,setActive]=useState(-1),[message,setMessage]=useState('首次进入等待 500ms。');
 const timer=useRef(),cooldown=useRef(),warm=useRef(false);
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(cooldown.current)},[]);
 function enter(i){clearTimeout(timer.current);clearTimeout(cooldown.current);setActive(-1);const delay=mode&&warm.current?0:500;setMessage(delay?'正在等待首次提示…':'连续切换：0ms，直接显示。');if(!delay)setActive(i);else timer.current=setTimeout(()=>{setActive(i);warm.current=true;setMessage('提示已显示；现在移到相邻按钮。')},delay)}
 function leave(){clearTimeout(timer.current);setActive(-1);cooldown.current=setTimeout(()=>{warm.current=false;setMessage('已离开工具栏，下次重新等待。')},300)}
 function reset(i){clearTimeout(timer.current);clearTimeout(cooldown.current);warm.current=false;setActive(-1);setMode(i);setMessage('已重置；首次进入等待 500ms。')}
 const names=['加粗','斜体','标记'];
 return <div className="inline-study tooltip-study"><h3>第一次防误触，下一次不重复等</h3><p>先停在一个按钮上，等提示出现，再移到旁边。也可用 Tab 聚焦，Escape 隐藏提示。离开工具栏 300ms 后，本例重新进入首次等待。</p><Choices items={['每个都等 500ms','只等第一次']} value={mode} onChange={reset}/><div className="tooltip-toolbar" onPointerLeave={leave} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))leave()}} onKeyDown={e=>{if(e.key==='Escape'){clearTimeout(timer.current);setActive(-1);setMessage('提示已关闭。')}}}>{names.map((name,i)=><div className="tooltip-anchor" key={name}><button aria-label={name} aria-describedby={active===i?`study-tip-${i}`:undefined} onPointerEnter={()=>enter(i)} onFocus={()=>enter(i)}>{['Aa','I','◇'][i]}</button>{active===i&&<span id={`study-tip-${i}`} role="tooltip">{name}</span>}</div>)}</div><Result>{message}</Result><p className="source-note">本书重制的行为实验。500ms 首次等待取自官网示范；300ms 离组宽限是本例设定。实际项目应使用成熟 Tooltip 组件。</p></div>
}

export function DialogStudy({reduce}){
 const [fixed,setFixed]=useState(1),[open,setOpen]=useState(false),[slow,setSlow]=useState(false);
 const duration=(fixed?(open?300:150):400)*(slow?5:1);
 return <div className="inline-study dialog-study"><h3>曲线、尺度、退出：放在同一组件中观察</h3><p>先打开，再在尚未结束时关闭。对比尺度和起步方式；慢放用于观察，恢复正常速度后再判断节奏。</p><Choices items={['从零放大 · 慢起步','接近原尺寸 · 快速回应']} value={fixed} onChange={setFixed}/><div className="dialog-specimen"><div className="dialog-model" aria-hidden={!open} style={{opacity:+open,transform:`scale(${open?1:fixed?.95:0})`,transition:reduce?'none':`transform ${duration}ms ${fixed?'cubic-bezier(.23,1,.32,1)':'ease-in'}, opacity ${duration}ms ease`}}><span className="model-glyph">↗</span><strong>共享这份阅读</strong><span>一段短暂的变化，交代一个新状态。</span><div className="model-line"/><div className="model-line short"/></div></div><div className="lab-toolbar"><button className="small-button" aria-pressed={open} onClick={()=>setOpen(v=>!v)}>{open?'关闭演示弹层':'打开演示弹层'}</button><label><input type="checkbox" checked={slow} onChange={e=>setSlow(e.target.checked)}/> 5× 慢放</label></div><Result><code>{fixed?'scale(.95) · ease-out · 300ms 入 / 150ms 出':'scale(0) · ease-in · 400ms 入 / 出'}</code>{reduce&&'静阅：直接显示状态'}</Result><p className="source-note">配方参考官网 animate 案例，本书自行实现。这个有边界的图形模型只演示外观，不作为真实模态对话框使用。</p></div>
}

export function MomentumStudy({reduce}){
 const [position,setPosition]=useState(50),[velocity,setVelocity]=useState(200),[mode,setMode]=useState(1),[released,setReleased]=useState(false);
 const x=useMotionValue(50),left=useTransform(x,v=>`${v/2}%`),control=useRef();
 const projected=position+velocity/1000*.998/(1-.998),decision=mode?projected:position;
 const target=[0,100,200].reduce((a,b)=>Math.abs(b-decision)<Math.abs(a-decision)?b:a);
 useEffect(()=>()=>control.current?.stop(),[]);
 useEffect(()=>{control.current?.stop();x.set(position);setReleased(false)},[position,velocity,mode,reduce,x]);
 function release(){control.current?.stop();x.set(position);setReleased(true);if(reduce)x.set(target);else control.current=animate(x,target,{type:'spring',stiffness:180,damping:27,velocity:mode?velocity:0})}
 return <div className="inline-study momentum-study"><h3>同一松手位置，速度会改变目的地</h3><p>先用默认的 50px、200px/s 比较两种规则。再改变速度方向，预测会选择哪个合法吸附点；最后点击释放核对。</p><Choices items={['只看松手位置','投射位置 + 速度交接']} value={mode} onChange={setMode}/><div className="momentum-track"><div className="momentum-rail">{[0,100,200].map(v=><span key={v} className={target===v?'snap-point selected':'snap-point'} style={{left:`${v/2}%`}}><i/><small>{v}px</small></span>)}<motion.div className="momentum-object" aria-hidden="true" style={{left}}>↗</motion.div></div></div><Slider label="松手位置" value={position} max={200} step={10} onChange={setPosition} unit="px"/><Slider label="释放速度" value={velocity} min={-600} max={600} step={50} onChange={setVelocity} unit="px/s"/><button className="small-button" onClick={release}>释放并吸附</button><Result><span>投射位置 {projected.toFixed(1)}px · 选择目标 <strong>{target}px</strong></span><span>{released?'已释放；观察起步与落点。':'先预测，再释放。'}</span></Result><p className="source-note">一维教学模型：project(v)=(v/1000)×.998/(1−.998)。官网是二维画中画，本例把方向拆成一条轴，保留“选目标”和“交速度”两个独立决定；不是 iOS 运行时复现。</p></div>
}

export function Choreography({reduce}){
 const [mode,setMode]=useState(1),[time,setTime]=useState(0),[slow,setSlow]=useState(false),raf=useRef();
 const duration=mode?200:400,fade=Math.min(time/200,1),move=Math.min(Math.max((time-(mode?0:200))/200,0),1);
 useEffect(()=>()=>cancelAnimationFrame(raf.current),[]);
 useEffect(()=>{cancelAnimationFrame(raf.current);setTime(0)},[mode,reduce]);
 function play(){cancelAnimationFrame(raf.current);if(reduce){setTime(duration);return}const start=performance.now();setTime(0);const tick=now=>{const t=Math.min((now-start)/(slow?5:1),duration);setTime(t);if(t<duration)raf.current=requestAnimationFrame(tick)};raf.current=requestAnimationFrame(tick)}
 return <><Choices items={['先淡出，再补位','淡出与补位并行']} value={mode} onChange={setMode}/><div className="choreo-scene" aria-label="三项阅读列表的删除示意"><div className="choreo-row" style={{transform:'translateY(0px)'}}><span>01</span><strong>先建立判断</strong><small>保持静止</small></div><div className="choreo-row exiting" aria-hidden={time>=200} style={{transform:'translateY(66px)',opacity:1-fade}}><span>02</span><strong>即将删除的阅读</strong><small>退出</small></div><div className="choreo-row" data-testid="closing-row" style={{transform:`translateY(${132-66*move}px)`}}><span>03</span><strong>再练习一次</strong><small>补位</small></div></div><div className="timeline-study"><div><span>退出项</span><i style={{width:`${200/duration*100}%`}}/></div><div><span>补位项</span><i style={{marginLeft:`${mode?0:50}%`,width:`${200/duration*100}%`}}/></div></div><Slider label="删除时间" value={Math.round(time)} max={duration} onChange={v=>{cancelAnimationFrame(raf.current);setTime(v)}} unit="ms"/><div className="lab-toolbar"><button className="small-button" onClick={play}>移除中间一项</button><button className="small-button" onClick={()=>{cancelAnimationFrame(raf.current);setTime(0)}}>还原列表</button><label><input type="checkbox" checked={slow} onChange={e=>setSlow(e.target.checked)}/> 5× 慢放</label></div><Result><span>{mode?'补位从 0ms 开始，整组 200ms 完成。':'补位到 200ms 才开始，整组 400ms 完成。'}</span><span>当前 {Math.round(time)}ms · 补位完成 {Math.round(move*100)}%</span></Result></>
}

export function GestureStudy({reduce}){
 const [mode,setMode]=useState(1),[result,setResult]=useState('拖动卡片，或用下方预设比较。'),[dismissed,setDismissed]=useState(false);
 const x=useMotionValue(0),opacity=useTransform(x,v=>1-Math.min(Math.abs(v)/180,1)*.8),cardOpacity=useTransform(x,v=>1-Math.max(0,Math.min((v-90)/90,1))),control=useRef(),pointer=useRef(null);
 useEffect(()=>()=>control.current?.stop(),[]);
 useEffect(()=>{control.current?.stop();pointer.current=null;x.set(0);setDismissed(false);setResult('拖动卡片，或用下方预设比较。')},[mode,reduce,x]);
 function finish(distance,velocity,cancelled=false){const close=!cancelled&&(distance>=90||(mode&&distance>=0&&velocity>500));setDismissed(!!close);setResult(`${cancelled?'已取消 · ':''}${Math.round(distance)}px / ${Math.round(velocity)}px/s → ${close?'关闭':'回位'}`);control.current?.stop();if(reduce)x.set(close?180:0);else control.current=animate(x,close?180:0,{type:'spring',stiffness:260,damping:32,velocity});}
 function preset(distance,velocity){control.current?.stop();x.set(distance);finish(distance,velocity)}
 function down(e){if(e.button!==0||pointer.current)return;control.current?.stop();pointer.current={id:e.pointerId,start:e.clientX,origin:x.get(),last:e.clientX,time:performance.now(),velocity:0};e.currentTarget.setPointerCapture(e.pointerId);setDismissed(false)}
 function move(e){const p=pointer.current;if(!p||p.id!==e.pointerId)return;const now=performance.now(),dt=now-p.time;if(dt>0)p.velocity=(e.clientX-p.last)/dt*1000;p.last=e.clientX;p.time=now;const v=p.origin+e.clientX-p.start;x.set(v<0?v*.2:v>180?180+(v-180)*.2:v)}
 function end(e,cancelled=false){const p=pointer.current;if(!p||p.id!==e.pointerId)return;pointer.current=null;const velocity=performance.now()-p.time>100?0:p.velocity;finish(x.get(),cancelled?0:velocity,cancelled);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}
 function reset(){control.current?.stop();x.set(0);setDismissed(false);setResult('已还原，可以重新拖动。')}
 return <><Choices items={['只看距离','距离或速度']} value={mode} onChange={setMode}/><div className="gesture-scene"><motion.div className="gesture-backdrop" style={{opacity}}/><motion.div className="gesture-card" data-testid="gesture-card" aria-hidden="true" style={{x,opacity:cardOpacity}} onPointerDown={down} onPointerMove={move} onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)} onLostPointerCapture={e=>end(e,true)}><span className="gesture-mark">↗</span><strong>向右，放下这一项</strong><small>{dismissed?'已关闭 · 可还原':'按住跟随，松手接续'}</small></motion.div></div><div className="gesture-presets"><button className="small-button" onClick={()=>preset(30,80)}>短距离慢放</button><button className="small-button" onClick={()=>preset(30,800)}>短距离快甩</button><button className="small-button" onClick={()=>preset(110,80)}>长距离慢放</button><button className="small-button" onClick={reset}>还原卡片</button></div><Result>{result}<code>{mode?'距离 ≥90px 或向右速度 >500px/s':'只看距离 ≥90px'}{reduce?' · 静阅：释放后直接到终态':''}</code></Result></>
}

export function RemovalStudy({reduce}){
 const [mode,setMode]=useState(1),[index,setIndex]=useState(0),[presses,setPresses]=useState(0),timer=useRef();
 const names=['新建阅读','打开收藏','查找概念','导出笔记','阅读设置'];
 useEffect(()=>()=>clearInterval(timer.current),[]);
 useEffect(()=>{clearInterval(timer.current);setIndex(0);setPresses(0)},[mode,reduce]);
 function play(){clearInterval(timer.current);setIndex(0);setPresses(0);let count=0;timer.current=setInterval(()=>{count++;setIndex(count);setPresses(count);if(count===4)clearInterval(timer.current)},120)}
 function key(e){if(!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();clearInterval(timer.current);setIndex(i=>e.key==='Home'?0:e.key==='End'?4:Math.max(0,Math.min(4,i+(e.key==='ArrowDown'?1:-1))));setPresses(v=>v+1)}
 return <><Choices items={['300ms 高亮追赶','移除键盘过渡']} value={mode} onChange={setMode}/><div className="command-model" role="listbox" tabIndex={0} aria-label="命令实验列表" aria-activedescendant={`command-study-${index}`} onKeyDown={key}><div className="command-selection" aria-hidden="true" style={{transform:`translateY(${index*44}px)`,transition:mode||reduce?'none':'transform 300ms ease-in-out'}}/>{names.map((name,i)=><div className="command-option" id={`command-study-${i}`} key={name} role="option" aria-selected={i===index}><span>{name}</span><small>{['⌘ N','⌘ O','⌘ K','⌘ E','⌘ ,'][i]}</small></div>)}</div><button className="small-button" onClick={play}>连续下移四次</button><Result><span>按键 {presses} 次 · 逻辑选择：{names[index]}</span><code>{mode?'0ms · 按键即到达':'300ms ease-in-out · 每 120ms 更新目标'}{reduce?' · 静阅取消对照运动':''}</code></Result></>
}

export function TasteStudy(){
 const [choice,setChoice]=useState(0),[written,setWritten]=useState(false);
 const rules=['所有组件都禁止使用边框。','浮起表面使用 shadow-raised；输入框保留边框。','为了提升性能，删除项目中所有阴影。'];
 const reasons=['范围太宽：用户没有否定输入框的边框。','范围、例外与理由均有原话依据，可提交确认。','理由与结论没有来源，不能写成用户要求。'];
 return <><div className="taste-quote"><small>虚构用户原话</small><p>“浮起表面用 shadow-raised，层级更清楚；输入框仍保留边框。”</p></div><fieldset className="taste-options"><legend>哪一条可以成为可复用规则？</legend>{rules.map((rule,i)=><label key={rule}><input type="radio" name="taste-rule" checked={choice===i} onChange={()=>{setChoice(i);setWritten(false)}}/>{rule}</label>)}</fieldset><Result>{reasons[choice]}</Result><div className="lab-toolbar"><button className="small-button" disabled={choice!==1||written} onClick={()=>setWritten(true)}>确认并写入演示文档</button><button className="small-button" onClick={()=>{setChoice(0);setWritten(false)}}>重置练习</button></div><pre className="taste-document" aria-live="polite"><code>{written?'## Surfaces\n\n浮起表面使用 shadow-raised；输入框保留边框。\n理由：用户明确说明，这样的浮层层级更清楚。\n来源：本实验中的虚构用户原话。':'DESIGN.md · 演示\n\n尚未写入。先核对范围与理由，再确认。'}</code></pre><p className="source-note">仅更新当前实验的内存状态，不写入磁盘或保存真实偏好。</p></>
}

export function PropertyStudy({reduce}){
 const [mode,setMode]=useState(1),[open,setOpen]=useState(false);
 return <div className="inline-study property-study"><h3>先辨认布局语义，再比较开销</h3><p>展开侧栏：一种方式挤开正文，另一种方式覆盖正文。它们的布局含义不同，不能为了便宜而直接互换。</p><Choices items={['margin 推开内容','transform 覆盖内容']} value={mode} onChange={setMode}/><div className="property-window"><div className="property-body" style={{marginLeft:mode?0:open?92:0,transition:reduce?'none':'margin-left 240ms ease-out'}}><strong>阅读工作区</strong><i/><i/><i/></div><div className="property-sidebar" style={{transform:`translateX(${open?0:-100}%)`,transition:reduce?'none':'transform 240ms ease-out'}}><span>目 录</span><i/><i/><i/></div></div><button className="small-button" aria-pressed={open} onClick={()=>setOpen(v=>!v)}>{open?'收起示范侧栏':'展开示范侧栏'}</button><Result>{mode?'正文占位不变；侧栏用 transform 覆盖。':'正文 margin-left 改变，布局需要重新计算。'}</Result><p className="source-note">借鉴官网侧栏对比。这里展示真实 CSS 行为，不显示虚构 FPS；掉帧、绘制与合成路径仍需在 DevTools 中录制。教学舞台保留裁切边界。</p></div>
}
