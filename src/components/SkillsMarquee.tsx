import React,{useRef,useState} from 'react';
import {motion,useScroll,useTransform} from 'framer-motion';
import {ArrowUpRight,Bot,Cloud,Code2,GraduationCap,Pause,Play} from 'lucide-react';
import {useSiteConfig} from '../data/site';
import {localHref} from './links';
const icons=[Bot,Code2,Cloud,GraduationCap];
export default function SkillsMarquee({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const {config,lang}=useSiteConfig(initialLanguage);const ref=useRef(null);const [paused,setPaused]=useState(false);const [hovering,setHovering]=useState(false);
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});const y=useTransform(scrollYProgress,[0,1],[35,-20]);
 const groups=[...config.stack.groups,{title:lang==='en'?'ML & technical teaching':'ML y docencia técnica',items:'Machine Learning · Deep Learning · Python / Colab',href:'/work/nexo/',link:lang==='en'?'Explore Nexo':'Explorar Nexo'}];
 return <motion.section ref={ref} style={{y}} className="relative border-y border-white/[0.06] py-12 sm:py-16">
  <div className="max-w-7xl mx-auto px-5 sm:px-8"><div className="mb-8 flex items-end justify-between gap-6"><div><p className="eyebrow mb-4">{config.stack.title}</p><h2 className="section-heading max-w-3xl">{config.stack.subtitle}</h2></div><button type="button" aria-label={paused?(lang==='en'?'Resume technology animation':'Reanudar animación de tecnologías'):(lang==='en'?'Pause technology animation':'Pausar animación de tecnologías')} aria-pressed={paused} onClick={()=>setPaused(!paused)} className="glass-chip rounded-full p-3 text-neon shrink-0">{paused?<Play size={17}/>:<Pause size={17}/>}</button></div>
   <div className="relative overflow-hidden" onMouseEnter={()=>setHovering(true)} onMouseLeave={()=>setHovering(false)} style={{WebkitMaskImage:'linear-gradient(to right,transparent,black 4%,black 96%,transparent)',maskImage:'linear-gradient(to right,transparent,black 4%,black 96%,transparent)'}}>
    <div className="flex w-max gap-5 pr-5" style={{animation:'skills-rail 36s linear infinite',animationPlayState:paused||hovering?'paused':'running'}}>
     {[...groups,...groups].map((g,i)=>{const Icon=icons[i%groups.length];const duplicate=i>=groups.length;return <article key={i} aria-hidden={duplicate?true:undefined} className="relative w-[310px] sm:w-[420px] lg:w-[460px] shrink-0 border-l border-white/15 p-6 sm:p-7"><div className="flex justify-between items-start gap-5 mb-7"><div><Icon size={24} className="text-neon mb-5" aria-hidden="true"/><h3 className="text-lg font-display text-white leading-relaxed">{g.title}</h3></div><span className="font-mono text-[10px] text-white/30">0{i%groups.length+1}</span></div><div className="flex flex-wrap gap-2.5 mb-7">{g.items.split(' · ').map(item=><span key={item} className="border-b border-white/10 pb-1 text-xs text-gray-300">{item}</span>)}</div><a href={localHref(g.href,lang)} tabIndex={duplicate?-1:undefined} onFocus={()=>setHovering(true)} onBlur={()=>setHovering(false)} className="text-sm text-neon inline-flex items-center gap-2">{g.link}<ArrowUpRight size={15}/></a></article>})}
    </div>
   </div>
  </div>
 </motion.section>;
}
