import React,{useEffect,useLayoutEffect,useRef,useState,type RefObject} from 'react';
import {motion,useInView,useReducedMotion,type HTMLMotionProps} from 'framer-motion';

type Preset='rise'|'title'|'depth'|'slide'|'product';
type Phase='static'|'hidden'|'shown';

const useIsoLayoutEffect=typeof window==='undefined'?useEffect:useLayoutEffect;
const ease=[.2,.65,.3,1] as const;
const from:Record<Preset,{x?:number;y?:number;scale?:number}>={
 rise:{y:28},
 title:{y:18},
 depth:{y:36,scale:.97},
 product:{y:36,scale:.97},
 slide:{x:28},
};
const rest={opacity:1,x:0,y:0,scale:1};

// One-shot reveal. Server render and anything already on screen at hydration stay
// fully readable ('static'); only content still below the fold is hidden, then
// plays a single time-based entrance when it enters the viewport.
export function useReveal(ref:RefObject<HTMLElement>,preset:Preset='rise',delay=0){
 const reduced=useReducedMotion();
 const [phase,setPhase]=useState<Phase>('static');
 const inView=useInView(ref,{once:true,margin:'0px 0px -8% 0px'});
 useIsoLayoutEffect(()=>{
  const el=ref.current;if(!el||reduced)return;
  if(el.getBoundingClientRect().top>window.innerHeight*.92)setPhase('hidden');
 },[reduced]);
 useEffect(()=>{if(phase==='hidden'&&inView)setPhase('shown');},[phase,inView]);
 const hidden=phase==='hidden'&&!reduced;
 return {
  phase,
  animate:hidden?{opacity:0,x:0,y:0,scale:1,...from[preset]}:rest,
  transition:phase==='shown'?{duration:preset==='title'?.55:.7,delay:Math.min(delay,.4),ease}:{duration:0},
 };
}

type Props=HTMLMotionProps<'div'>&{as?:'div'|'section'|'article'|'figure';preset?:Preset;delay?:number};
export default function ScrollReveal({as='div',preset='rise',delay=0,children,className='',transition,...props}:Props){
 const ref=useRef<HTMLDivElement>(null);const reveal=useReveal(ref,preset,delay);
 const Component=motion[as] as typeof motion.div;
 // A caller-supplied transition only applies once the entrance has finished (e.g. hover).
 return <Component {...props} ref={ref} initial={false} animate={reveal.animate} transition={reveal.phase==='static'&&transition?transition:reveal.transition} className={`scroll-scene ${className}`} data-scroll-scene={preset} data-reveal={reveal.phase}>{children}</Component>;
}
