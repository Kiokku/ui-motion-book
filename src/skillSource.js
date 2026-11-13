const files=import.meta.glob('../sources/emilkowalski-skills/skills/*/SKILL.md',{query:'?raw',import:'default',eager:true});

// The numbers are lesson sections, not fractions of the file's length.
const topics={
 'emil-design-eng':[
  [/Core Philosophy/,/Taste is/,/Unseen details/,/Beauty is/],
  [/The Animation Decision/,/Should this animate/],
  [/What is the purpose/],
  [/What easing/,/How fast/,/Perceived performance/],
  [/Component Building/,/Buttons must/,/Never animate from/,/Make popovers/,/Tooltips:/,/scale\(\) scales/,/^transform-origin$/],
  [/Spring Animations/,/Use CSS transitions/],
  [/CSS Transform/,/clip-path for/,/Use blur/,/Animate enter states/,/Stagger Animations/],
  [/Gesture and Drag/],
  [/Performance Rules/],
  [/^Accessibility$/],
  [/The Sonner Principles/],
  [/Review Format/,/Review your work/,/Debugging Animations/,/Review Checklist/],
  []
 ],
 'animate':[[/Operating Posture/,/Hard Rules/,/The Build Sequence/],[/Should this animate/,/What is the purpose/],[/Pick the tool/],[/Pick the properties/],[/Easing and duration/],[/Interruption and exit/],[/Reduced motion/],[/Recipes/],[/Never Ship/,/Output/,/Tone/]],
 'animate-expo':[[/Operating Posture/,/Hard Rules/,/The Build Sequence/],[/Should this animate/,/What is the purpose/],[/Pick the tool/],[/Pick the properties/],[/Timing or spring/],[/Keep it off/],[],[/Press, not hover/,/Haptics/],[/Recipes/],[/Reduced motion/,/Setup that/,/120fps/,/Never Ship/,/Output/,/Tone/]],
 'animation-performance':[[/Why This Matters/,/Operating Posture/,/Hard Rules/,/The Frame Budget/],[/The Symptom Table/,/Workflow/,/Phase 1/],[/What You Animate/],[],[/Where It Runs/,/Should You Avoid JS/],[/React:/,/Two Traps/],[/will-change/],[/Phase 2/,/Phase 3/]],
 'animation-vocabulary':[[/Quick Start/,/Instructions/,/Examples/,/Glossary/],[/Entrances & Exits/],[/Sequencing & Timing/,/Movement & Transforms/,/Easing/],[/Transitions Between/],[/^Scroll /,/Feedback & Interaction/,/Spring Animations/],[/Looping & Ambient/,/Polish & Effects/,/^Performance/],[],[/Principles to Know/]],
 'apple-design':[[/The Core Idea/],[/Response/,/Direct manipulation/],[/Interruptibility/,/Behavior over animation/],[/Velocity handoff/,/Momentum projection/],[/Spatial consistency/,/Hint in/,/Rubber-banding/,/Gesture design/],[/Frame-level/,/Materials & depth/],[/Multimodal/,/Reduced motion/],[/Typography/],[/Design foundations/,/Process/,/Quick Reference/]],
 'review-animations':[[/Operating Posture/],[/The Ten/],[],[],[/Aggressive Escalation/,/Remedial Preference/],[/Required Output/,/Findings table/,/Verdict/],[/Guidelines/]],
 'improve-animations':[[/Operating Posture/,/Hard Rules/],[/Workflow/,/Phase 1/],[/Phase 2/],[/Phase 3/],[],[/Phase 4/],[/Invocation Variants/],[/Tone/]],
 'find-animation-opportunities':[[/Operating Posture/,/Hard Rules/],[/Workflow/],[/Where to Hunt/],[/The Gate/],[/Required Output/,/Opportunities table/],[/Rejected candidates/,/Verdict/],[/Tone/]],
 'prototype':[[/Operating Posture/,/Hard Rules/],[/Workflow/,/Phase 1/,/Phase 2/,/Phase 3/],[],[/Phase 4/],[/Phase 5/],[/Phase 6/,/Invocation Variants/,/Tone/]],
 'write-swift':[[],[/Model data with value/],[],[/Errors and optionals/],[/Concurrency:/,/The rule that changed/],[/Actor reentrancy/],[/Sendable/],[/Structured concurrency/],[],[/Concurrency in SwiftUI/],[/Protocols and generics/,/some.*vs.*any/],[/API design/],[/Performance/],[/ARC and object lifetime/],[/Testing/],[/Macros/,/Logging and debugging/],[/Unsafe code/,/Modern syntax/],[/Migrating/],[/Quick Reference/]],
 'pick-ui-library':[[],[/How to use/],[/The list/,/UI components/],[/Motion & visuals/],[/^Charts$/, /Interaction & performance/,/State & styling/],[/Common mismatches/],[]],
 'mobile-native':[[/Operating Posture/,/Hard Rules/,/The Symptom Table/,/The Fixes/],[/Hover state/,/Gray\/blue/],[/Layout has/,/Page zooms/],[/Tap feels/,/Pull-to-refresh/],[/Content stops/,/Long-press/],[/Carousel scrolls/],[/Status bar/],[/Right in Chrome/,/Output/,/Tone/],[/Baseline/,/Never Ship/]],
 'break-ui':[[/Operating Posture/,/Hard Rules/],[/Workflow/,/Phase 1/],[/Phase 2/],[/Phase 3/],[/Phase 4/,/Failure signatures/],[/Truncate, wrap/],[],[/Phase 5/,/Phase 6/,/Required Output/,/Part 1/,/Part 2/,/Part 3/,/Invocation Variants/],[/Tone/]],
 'ask-sonner':[[],[/Setup/],[/Picking the right call/],[/Recipes/],[/Styling/],[],[/Troubleshooting/],[]],
 'choreograph':[[/Operating Posture/,/Hard Rules/],[/Cast the Elements/],[/Pick the Relationship/,/Together, by default/],[/Overlap: the stagger/],[/Sync Secondary/,/Adapt Timing/],[/Sequence: when to wait/,/Direction and Exits/],[/Interruption/,/Attention Loops/,/Reduced Motion/],[/Implementation/,/Workflow/,/Required Output/,/Part 1/,/Part 2/,/Part 3/,/Tone/]],
 'gestures':[[/First decision/,/The two phases/],[/Track phase/],[/Release phase/],[/Interruptibility/,/Motion drag props/],[/Linked values/],[/Spatial consistency/,/Touch checklist/],[/Sheets without/,/Hold gestures/],[/Reduced motion/,/When it still/]],
 'remove-animations':[[/Operating Posture/,/Hard Rules/],[/The Gate/],[/Reducing/],[/Removal Hazards/],[],[/Cleanup/],[/Required Output/,/Part 1/,/Part 2/,/Part 3/],[/Where to Hunt/,/Workflow/,/Tone/]],
 'learn-taste':[[/Hard Rules/],[/Workflow/,/Phase 1/],[/Phase 2/],[/Phase 3/],[],[/Phase 4/,/Make it a check/],[/Phase 5/,/Phase 6/,/Required Output/,/Rules to add/,/Needs your answer/,/Conflicts/,/Skipped/],[/Invocation Variants/]]
};

// A few long source sections contain several separately taught concepts.
// Split at their existing lines without changing the file text or line numbers.
const paragraphSteps={
 'review-animations':[[/^5\. \*\*Origin/,2,'来源、连续与性能'],[/^8\. \*\*Accessibility/,3,'可访问性、时序与协调']],
 'write-swift':[[/^- \*\*Enums are/,2,'枚举与互斥状态'],[/^\*\*Noncopyable types/,2,'唯一所有权'],[/^\*\*Cancellation is cooperative/,8,'取消与回调桥接']],
 'ask-sonner':[[/^\*\*Multiple toasters/,5,'多个通知出口'],[/^\*\*Close callbacks/,3,'关闭原因'],[/^\*\*Icons/,4,'图标'],[/^\*\*Theme/,5,'主题']]
};

export function skillDocument(chapter){
 const source=files[`../sources/emilkowalski-skills/skills/${chapter.id}/SKILL.md`];
 const lines=source.replace(/\n$/,'').split('\n');
 const boundaries=[{start:0,title:'文件信息',level:0,step:-1}];
 let fenced=false;
 for(let i=0;i<lines.length;i++){
  if(/^\s*```/.test(lines[i])){fenced=!fenced;continue}
  const heading=!fenced&&/^(#{1,4}) (.+)$/.exec(lines[i]);
  if(heading)boundaries.push({start:i,title:heading[2],level:heading[1].length});
  else if(!fenced){
   const split=paragraphSteps[chapter.id]?.find(([pattern])=>pattern.test(lines[i]));
   if(split)boundaries.push({start:i,title:split[2],level:3,explicitStep:split[1]});
   else if(chapter.recall&&lines[i].trim()&&lines[i-2]==='Do not provide any other information until the user asks a question.')boundaries.push({start:i,title:'技能宗旨与前提',level:2,explicitStep:0});
  }
 }
 const parents=[];
 const blocks=boundaries.map((block,index)=>{
  let step=-1;
  if(block.level>1){
   const matched=topics[chapter.id].findIndex(patterns=>patterns.some(pattern=>pattern.test(block.title)));
   while(parents.length&&parents.at(-1).level>=block.level)parents.pop();
   step=block.explicitStep??(matched>=0?matched:(parents.at(-1)?.step??chapter.sections.length));
   if(block.title==='Initial Response')step=chapter.sections.length;
   parents.push({...block,step});
  }
  return {...block,step,end:boundaries[index+1]?.start??lines.length};
 });
 return {source,lines,blocks};
}
