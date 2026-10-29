import ScrollReveal from './ScrollReveal';
import React from 'react';
import {motion,useReducedMotion} from 'framer-motion';
import {ArrowUpRight} from 'lucide-react';
import {useSiteConfig} from '../data/site';
import {localHref} from './links';
import NexoArchitectureArt from './NexoArchitectureArt';

export default function SelectedWork({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const {config,lang}=useSiteConfig(initialLanguage);const es=lang==='es';const reduced=useReducedMotion();const cards=config.work.cards;
 return <section id="work" className="section-shell border-y border-white/10"><div className="max-w-7xl mx-auto">
  <ScrollReveal preset="title" className="flex items-end justify-between gap-6 mb-10 sm:mb-14"><div><p className="eyebrow mb-4">{es?'Ingeniería aplicada':'Selected engineering work'}</p><h2 className="section-heading">{es?'Sistemas, integraciones y producto':'Systems, integrations & product'}</h2></div></ScrollReveal>
  <div className="grid lg:grid-cols-[1.12fr_1fr] gap-9 lg:gap-16 items-center">
   <ScrollReveal as="article" preset="product" id={cards[3].id} whileHover={reduced?{}:{y:-5}} transition={{duration:.35}} className="folder-panel group">
    <span className="folder-tab">Nexo / {es?'Proyecto':'Project'}</span>
    <a href={localHref('/work/nexo/',lang)} className="block" aria-label={es?'Nexo: explorar el caso y la arquitectura':'Nexo: explore the case and architecture'}>
     <div className="flex items-start justify-between gap-5"><div><p className="text-[11px] text-neon/70 font-mono mb-3">{es?'Creador · Docente de ML':'Creator · ML Instructor'}</p><h3 className="text-4xl sm:text-5xl font-display tracking-tight font-bold">Nexo<span className="text-neon">.</span></h3></div><ArrowUpRight size={22} strokeWidth={1.5} className="text-neon mt-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></div>
     <p className="text-sm text-gray-400 leading-relaxed mt-4 max-w-sm">{es?'Machine Learning interactivo y práctica en Python.':'Interactive Machine Learning and hands-on Python practice.'}</p>
     <div className="w-full mx-auto my-5 transition-transform duration-700 group-hover:-translate-y-1"><NexoArchitectureArt initialLanguage={lang}/></div>
     <div className="flex justify-end items-center border-t border-white/10 pt-5 text-xs"><span className="text-neon">{es?'Explorar el caso':'Explore the case'} ↗</span></div>
    </a>
   </ScrollReveal>
   <div>{cards.slice(0,3).map((c,i)=><ScrollReveal as="article" preset="slide" delay={i*.065} id={c.id} key={c.id} className="group border-t border-white/15 last:border-b">
    <a href={localHref(c.links[0].href,lang)} className="grid grid-cols-[28px_1fr_24px] sm:grid-cols-[38px_1fr_26px] gap-4 py-8 sm:py-9 items-center">
     <span className="text-[11px] font-mono text-gray-600 self-start pt-1.5">0{i+1}</span><div className="transition-transform duration-300 group-hover:translate-x-1"><p className="text-xs text-gray-500 mb-3">{c.category}</p><h3 className="text-xl sm:text-2xl font-semibold leading-tight group-hover:text-neon transition-colors">{c.title}</h3><p className="text-sm text-gray-400 leading-relaxed mt-3 max-w-md">{c.summary}</p></div><ArrowUpRight size={22} strokeWidth={1.5} className="text-white/30 group-hover:text-neon transition-colors"/>
    </a>
   </ScrollReveal>)}</div>
  </div>
 </div></section>;
}
