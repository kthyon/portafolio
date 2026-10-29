import React,{useEffect,useRef,useState,type RefObject} from 'react';
import {motion,useInView,useMotionTemplate,useReducedMotion,useScroll,useSpring,useTransform,type HTMLMotionProps,type MotionStyle} from 'framer-motion';

type Preset='rise'|'title'|'depth'|'slide';

export function useScrollScene(ref:RefObject<HTMLElement>,preset:Preset='rise',delay=0){
 const [ready,setReady]=useState(false);const reduced=useReducedMotion();
 const near=useInView(ref,{margin:'200px 0px 200px 0px'});
 const {scrollYProgress}=useScroll({target:ref,offset:['start .98','start .4']});
 const progress=useSpring(scrollYProgress,{stiffness:95,damping:28,mass:.65,restDelta:.001});
 const start=Math.min(delay,.22),end=Math.min(.82+start,1);
 const reveal=useTransform(progress,[start,end],[0,1]);
 const y=useTransform(reveal,[0,1],[preset==='depth'?105:preset==='title'?64:preset==='slide'?28:78,0]);
 const x=useTransform(reveal,[0,1],[preset==='slide'?58:0,0]);
 const scale=useTransform(reveal,[0,1],[preset==='depth'?.9:preset==='title'?.97:.98,1]);
 const rotateX=useTransform(reveal,[0,1],[preset==='depth'?9:0,0]);
 const opacity=useTransform(reveal,[0,.55,1],[.04,.86,1]);
 const blur=useTransform(reveal,[0,.7,1],[preset==='title'?5:preset==='depth'?1.5:2,0,0]);
 const filter=useMotionTemplate`blur(${blur}px)`;
 useEffect(()=>{setReady(true);},[]);
 const active=ready&&!reduced;
 // The initial server render remains fully readable; movement starts after hydration.
 const style:MotionStyle=active?{x,y,scale,rotateX,opacity,filter,transformPerspective:1100,transformOrigin:'50% 70%',willChange:near?'transform, opacity':undefined}:{x:0,y:0,scale:1,rotateX:0,opacity:1,filter:'blur(0px)'};
 return {style,active};
}

type Props=HTMLMotionProps<'div'>&{as?:'div'|'section'|'article'|'figure';preset?:Preset;delay?:number};
export default function ScrollReveal({as='div',preset='rise',delay=0,children,className='',style,...props}:Props){
 const ref=useRef<HTMLDivElement>(null);const scene=useScrollScene(ref,preset,delay);
 const Component=motion[as] as typeof motion.div;
 return <Component {...props} ref={ref} initial={false} className={`scroll-scene ${className}`} style={{...style,...scene.style}} data-scroll-scene={preset} data-motion-ready={scene.active?'true':'false'}>{children}</Component>;
}
