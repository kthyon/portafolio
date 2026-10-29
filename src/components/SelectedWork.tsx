import React,{useId} from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {useSiteConfig} from '../data/site';
import {localHref} from './links';

function NexoArtwork(){const id='nexo-art-'+useId().replace(/:/g,'');return <svg viewBox="0 0 580 260" className="w-full h-auto" fill="none" aria-hidden="true">
 <defs><linearGradient id={id} x1="115" y1="60" x2="470" y2="245" gradientUnits="userSpaceOnUse"><stop stopColor="#a2e872" stopOpacity=".16"/><stop offset="1" stopColor="#a2e872" stopOpacity=".015"/></linearGradient><radialGradient id={id+'-g'}><stop stopColor="#a2e872" stopOpacity=".12"/><stop offset="1" stopColor="#a2e872" stopOpacity="0"/></radialGradient></defs>
 <ellipse cx="300" cy="140" rx="250" ry="125" fill={`url(#${id}-g)`}/>
 {[42,21,0].map((offset,i)=><g key={i} transform={`translate(0 ${offset})`}><path d="M115 94L210 43H282L306 58H425L485 94L300 198Z" fill={i===2?`url(#${id})`:'#0a0e0a'} stroke="#a2e872" strokeOpacity={.12+i*.1}/><path d="M115 94L300 198L485 94" stroke="#a2e872" strokeOpacity={.1+i*.1}/></g>)}
 <g stroke="#a2e872" strokeOpacity=".3"><path d="M212 111L268 80L322 111L376 80M268 80L268 143L322 111L376 143M212 111L268 143L376 143L426 111M322 111L322 58"/><path d="M212 111V138M426 111V139" strokeDasharray="3 5"/></g>
 {[[212,111],[268,80],[322,111],[376,80],[268,143],[376,143],[426,111],[322,58]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="9" fill="#a2e872" fillOpacity=".04"/><circle cx={x} cy={y} r={i===2?4:2.5} fill={i===2?'#d9ffc6':'#a2e872'} fillOpacity={i===2?1:.7}/></g>)}
 <path d="M72 214H150M455 44H508" stroke="#a2e872" strokeOpacity=".18"/><circle cx="65" cy="214" r="2" fill="#a2e872" fillOpacity=".6"/><circle cx="515" cy="44" r="2" fill="#a2e872" fillOpacity=".6"/>
 </svg>;}

export default function SelectedWork({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const {config,lang}=useSiteConfig(initialLanguage);const es=lang==='es';const reduced=useReducedMotion();const cards=config.work.cards;
 const labels=es?[['Agentes de IA y MCP','Herramientas para ingeniería'],['Jira + Slack','Automatización para Latinoamérica'],['Mercado Pago Developers','Desarrollo web en equipo']]:[['AI agents & MCP','Developer tools'],['Jira + Slack','Workflow automation across LATAM'],['Mercado Pago Developers','Collaborative web delivery']];
 return <section id="work" className="section-shell border-y border-white/10"><div className="max-w-7xl mx-auto">
  <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14"><div><p className="eyebrow mb-4">{es?'Trabajo seleccionado':'Selected work'}</p><h2 className="section-heading">{es?'Proyectos y contribuciones':'Projects & contributions'}</h2></div><span className="hidden sm:block font-mono text-[11px] text-gray-500">01 — 04</span></div>
  <div className="grid lg:grid-cols-[1.12fr_1fr] gap-9 lg:gap-16 items-center">
   <motion.article id={cards[3].id} whileHover={reduced?{}:{y:-5}} transition={{duration:.35}} className="folder-panel group">
    <span className="folder-tab">Nexo / {es?'Proyecto':'Project'}</span>
    <a href={localHref('/work/nexo/',lang)} className="block" aria-label={es?'Nexo: explorar el caso y la arquitectura':'Nexo: explore the case and architecture'}>
     <div className="flex items-start justify-between gap-5"><div><p className="text-[11px] text-neon/70 font-mono mb-4">{es?'Creador · Docente de ML':'Creator · ML Instructor'}</p><h3 className="text-5xl sm:text-6xl font-display tracking-tight font-bold">Nexo<span className="text-neon">.</span></h3></div><ArrowUpRight size={26} strokeWidth={1.5} className="text-neon mt-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
     <p className="text-gray-400 leading-relaxed mt-5 max-w-sm">{es?'Del concepto a la práctica en Machine Learning.':'From concept to practice in Machine Learning.'}</p>
     <div className="-mx-3 sm:-mx-4 my-1 transition-transform duration-700 group-hover:-translate-y-1"><NexoArtwork/></div>
     <div className="flex justify-between items-center gap-5 border-t border-white/10 pt-5 text-xs"><span className="text-gray-500 font-mono">{es?'Aprendizaje interactivo':'Interactive learning'}</span><span className="text-neon">{es?'Explorar el caso':'Explore the case'} ↗</span></div>
    </a>
   </motion.article>
   <div>{cards.slice(0,3).map((c,i)=><article id={c.id} key={c.id} className="group border-t border-white/15 last:border-b">
    <a href={localHref(c.links[0].href,lang)} className="grid grid-cols-[28px_1fr_24px] sm:grid-cols-[38px_1fr_26px] gap-4 py-8 sm:py-9 items-center">
     <span className="text-[11px] font-mono text-gray-600 self-start pt-1.5">0{i+1}</span><div className="transition-transform duration-300 group-hover:translate-x-1"><p className="text-xs text-gray-500 mb-3">{labels[i][1]}</p><h3 className="text-xl sm:text-2xl font-semibold leading-tight group-hover:text-neon transition-colors">{labels[i][0]}</h3></div><ArrowUpRight size={22} strokeWidth={1.5} className="text-white/30 group-hover:text-neon transition-colors"/>
    </a>
   </article>)}</div>
  </div>
 </div></section>;
}
