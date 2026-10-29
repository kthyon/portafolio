import ScrollReveal,{useScrollScene} from './ScrollReveal';
import React,{useEffect,useRef,useState} from 'react';
import {motion,useInView,useReducedMotion,useScroll,useSpring,useTransform} from 'framer-motion';
import {Building2,Code2,GraduationCap} from 'lucide-react';
import {useSiteConfig} from '../data/site';

type Job={role:string;company:string;period:string;description:string;achievements:string[]};
function ExperienceNode({job,index}:{job:Job;index:number}){
 const ref=useRef<HTMLLIElement>(null);const seen=useInView(ref,{once:true,amount:.16,margin:'0px 0px -55px 0px'});const reduced=useReducedMotion();const [ready,setReady]=useState(false);const scene=useScrollScene(ref,'slide');
 useEffect(()=>setReady(true),[]);
 const active=!ready||seen||!!reduced;const Icon=index===0?Building2:index===4?Code2:GraduationCap;
 return <motion.li ref={ref} className="experience-node scroll-scene" style={scene.style} data-scroll-scene="timeline" data-revealed={active?'true':'false'} initial={false} transition={{duration:reduced?0:.75,ease:[.2,.65,.3,1]}}>
  <span className="career-node-orbit" style={{animationDelay:`${index*-.85}s`}} aria-hidden="true"><Icon size={20} className="text-neon" strokeWidth={1.5}/></span><span className="career-connector" aria-hidden="true"/>
  <div className="career-copy"><div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5"><div><p className="text-accent-light text-[11px] sm:text-xs font-mono mb-3 leading-relaxed">{job.company}</p><h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-xl">{job.role}</h3></div><span className="text-gray-500 text-[11px] sm:text-xs font-mono sm:text-right sm:pt-1 shrink-0 leading-relaxed">{job.period}</span></div>
   <p className="text-gray-400 leading-relaxed mb-6">{job.description}</p><ul className="space-y-3 max-w-3xl">{job.achievements.map(a=><li key={a} className="flex items-start gap-3"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neon/60"/><span className="text-gray-300 text-sm leading-[1.8]">{a}</span></li>)}</ul>
  </div>
 </motion.li>;
}
export default function Experience({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const {config}=useSiteConfig(initialLanguage);const ref=useRef(null);const {scrollYProgress}=useScroll({target:ref,offset:['start .8','end .6']});const lineScale=useTransform(scrollYProgress,[0,1],[0,1]);const smoothTrack=useSpring(lineScale,{stiffness:95,damping:28});
 return <section id="experience" ref={ref} className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
  <div className="absolute -left-64 top-1/3 w-[550px] h-[700px] bg-neon/[.035] blur-[130px] rounded-full pointer-events-none" aria-hidden="true"/>
  <div className="max-w-6xl mx-auto relative"><ScrollReveal preset="title" className="mb-14 sm:mb-20 flex gap-5 items-center"><span className="h-px w-12 bg-neon"/><h2 className="section-heading">{config.experience.title}</h2></ScrollReveal>
   <div className="relative"><div className="career-track" aria-hidden="true"><motion.div className="career-track-fill" style={{scaleY:smoothTrack}}/></div><ol>{config.experience.jobs.map((job,index)=><ExperienceNode key={`${job.company}-${job.period}`} job={job} index={index}/>)}</ol></div>
  </div>
 </section>;
}
