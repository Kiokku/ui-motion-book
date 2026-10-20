import React,{useState} from 'react';
import Demo,{Easing} from './Demos';
import {sourceRoot} from './content';

const coverage=[
 ['核心哲学','品味训练、细节累积、美感的产品价值',0],
 ['动效决策框架','频率、目的、曲线、时长、感知性能',1],
 ['弹簧','适用场景、两类参数、速度与中断',5],
 ['组件原则','按压、入场尺度、弹层原点、连续提示',4],
 ['状态交接','transition、keyframes、blur、@starting-style',5],
 ['变换与裁切','百分比、子项缩放、3D、inset 与四类用途',6],
 ['手势与拖动','距离和速度、阻力、捕获与多触点',7],
 ['性能','渲染路径、继承变量、Motion、CSS 与 WAAPI',8],
 ['可访问性','减少动态效果、触控悬停',9],
 ['Sonner 组件哲学','接入、默认值、命名、隐藏边界、文档与一致性',10],
 ['节奏协调','错峰、非对称时长、高度与透明度',10],
 ['调试与审查','表格、慢放、逐帧、隔日重看与真机',11]
];
function jump(e,index){e.preventDefault();document.getElementById(`section-${index}`)?.scrollIntoView()}

export function ChapterGuide({chapter}){return <div className="chapter-guide"><h2>这一章，分六步读</h2><p>前半章先建立判断，后半章解释实现的边界。代码可以展开查阅；先能解释“为什么”，再去自己的项目实现。</p><nav aria-label="第一章阅读导航">{chapter.path.map(([id,title],i)=><a key={id} href={'#'+id} onClick={e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView()}}><span>{i+1}</span>{title}</a>)}</nav></div>}

function ClipStudy(){const [visible,setVisible]=useState(45);return <div className="inline-study"><h3>观察裁切：内容不动，可见范围改变</h3><p>先预测 0% 与 100% 会发生什么，再拖动滑块。背景保留完整占位，蓝色副本只改变可见范围。</p><div className="clip-study" aria-hidden="true"><div>同一份内容 · 始终完整</div><div style={{clipPath:`inset(0 ${100-visible}% 0 0)`}}>同一份内容 · 始终完整</div></div><label className="range-label"><span>可见比例<output>{visible}%</output></span><input type="range" aria-label="裁切可见比例" min="0" max="100" value={visible} onChange={e=>setVisible(+e.target.value)}/></label><div className="readout" role="status"><code>clip-path: inset(0 {100-visible}% 0 0)</code><span>右侧裁去 {100-visible}%</span></div><p>标签高亮可以把“选中配色”的整组副本裁到当前标签处，避免文字、背景各自变色时不同步。长按确认、滚动揭示和图片对比，也是在改变这条可见边界；真实交互仍需另外处理提交、取消或指针事件。</p></div>}

export default function DesignEngineeringStudy({section,reduce}){
 if(section===1)return <div className="reading-table"><table><caption>原作者的频率分层 · 用于判断的经验量级</caption><thead><tr><th scope="col">场景</th><th scope="col">建议</th><th scope="col">保护什么</th></tr></thead><tbody><tr><td>每天上百次／键盘快捷操作</td><td>直接呈现</td><td>效率与连续思路</td></tr><tr><td>每天几十次</td><td>移除或极轻微反馈</td><td>不反复索取注意力</td></tr><tr><td>偶尔打开的菜单、抽屉</td><td>短暂且有目的的运动</td><td>状态与空间关系</td></tr><tr><td>首次引导、罕见完成</td><td>允许适度惊喜</td><td>理解与情绪记忆</td></tr></tbody></table></div>;
 if(section===3)return <div className="inline-study"><h3>只改曲线，先预测再播放</h3><p>把时间移到 50%。先猜哪种曲线已走得最远，再切换 Ease-out 与 Ease-in 对照。总时长相同；变化的是输入后最初一瞬的进度。</p><Easing reduce={reduce}/></div>;
 if(section===5)return <div className="inline-study"><h3>试一次释放，也试一次重新抓住</h3><p>先用按钮推动，再在运动途中拖动它。改变阻尼，比较反弹与收敛。“推向右”也提供键盘可用的替代操作。此处为浏览器弹簧实验，参数是下方显示的物理配置；它不是正文两组配置的逐值复现，也不是所有手势边界的完整实现。</p><Demo type="spring" reduce={reduce}/></div>;
 if(section===6)return <ClipStudy/>;
 if(section===11)return <div className="reading-table"><table><caption>项目菜单的一次审查 · 教学案例</caption><thead><tr><th scope="col">修改前 Before</th><th scope="col">修改后 After</th><th scope="col">原因 Why</th></tr></thead><tbody><tr><td>600ms ease-in</td><td>200ms 自定义 ease-out</td><td>更早响应，并缩短反复等待</td></tr><tr><td>从 scale(0) 中心展开</td><td>scale(.95)＋透明度，从触发点展开</td><td>交代来源，减少凭空长出的感受</td></tr><tr><td>快速反转时从头重播</td><td>从当前显示值转向目标</td><td>保持位置连续</td></tr><tr><td>鼠标和键盘都播放</td><td>高频键盘操作直接呈现</td><td>遵循作者对重复任务的克制</td></tr><tr><td>静阅时仍大幅缩放</td><td>移除运动，保留可见状态</td><td>信息不依赖位移</td></tr></tbody></table><p className="source-note">验收：正常速度重复操作，5 倍慢速检查原点和属性同步，中途反转，再用键盘和静阅模式完成同一任务。表中数值仅用于这个案例。</p></div>;
 if(section===12)return <>
  <section className="recall-study" aria-labelledby="recall-study-title"><h2 id="recall-study-title">先不看答案，解释三个取舍</h2><p>每题先口头回答或记在下方笔记里，再展开对照。能辨认答案只是开始，能在新场景中解释原因才更接近理解。</p>{[
   ['弹簧一定要弹吗？什么情境下比固定曲线更合适？','不一定。足够阻尼可以没有反弹；手势释放、重抓和反向需要保持连续，才是选择弹簧的主要理由。偶尔入场的简单淡化通常不需要它。'],
   ['给菜单加了按压缩放，为什么保存流程仍可能令人困惑？','缩放只确认输入。业务是否执行中、是否成功或失败，要由独立状态表达。增加按压反馈不能代替完整反馈，也不能证明真实操作更快。'],
   ['为什么菜单与居中对话框不必共用原点？Sonner 又为何可以采用不同节奏？','菜单依附触发器，需要表达来源；居中对话框没有相同锚点。Sonner 的曲线、视觉与组件气质共同决定节奏。一致性指行为有共同理由，不要求所有组件数值相同。']
  ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
  <details className="coverage-index"><summary>回到原文：本章主题索引</summary><p>以下映射覆盖原 Skill 的知识主题。原文件还含助手首次响应和审查输出等操作约定；本书保留其含义，不要求读者模拟助手的开场语。</p><dl>{coverage.map(([topic,desc,index])=><div key={topic}><dt><a href={`#section-${index}`} onClick={e=>jump(e,index)}>{topic}</a></dt><dd>{desc}</dd></div>)}</dl><a className="text-button" href={`${sourceRoot}/emil-design-eng/SKILL.md`} target="_blank" rel="noreferrer">对照固定版本的完整原文</a><p>后续可按问题深入：animate 学习构建顺序，animate-expo 检查原生手势，animation-performance 测量性能，review-animations 与 improve-animations 训练局部审查和全局改进。</p></details>
 </>;
 return null;
}
