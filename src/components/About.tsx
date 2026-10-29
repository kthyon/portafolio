import React from 'react';
import {motion} from 'framer-motion';
import {ArrowDown, ArrowRight, ArrowUpRight, Code2, Cpu, GraduationCap, MapPin, Users} from 'lucide-react';
import {useSiteConfig} from '../data/site';
import {baseUrl, localHref} from './links';

function SkillCard({title,description}:{title:string;description:string}) {
 return <motion.div initial={false} whileHover={{y:-3}} className="glass-soft p-6 rounded-[1.6rem] hover:border-neon/35 transition-colors">
  <h3 className="text-neon font-semibold mb-3">{title}</h3><p className="text-gray-400 text-sm leading-relaxed">{description}</p>
 </motion.div>;
}

export default function About({initialLanguage='en'}:{initialLanguage?:'en'|'es'}){
 const {config,lang}=useSiteConfig(initialLanguage);const a=config.about;
 return <article className="pt-32 sm:pt-40 pb-20 px-5 sm:px-8 overflow-hidden"><div className="max-w-7xl mx-auto">
  <header className="relative grid lg:grid-cols-[1fr_270px] gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
   <div className="pointer-events-none absolute -top-20 -left-24 w-80 h-80 bg-neon/5 rounded-full blur-3xl" aria-hidden="true"/>
   <div className="relative"><p className="eyebrow mb-6">{config.navbar.links[2].name} · Cristian Alvarado</p>
    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-display font-bold leading-[1.2] tracking-tight mb-7">{a.title}</h1>
    <p className="text-neon text-base sm:text-lg mb-5">{a.role}</p>
    <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{a.description}</p>
    <div className="flex flex-wrap gap-3 mt-7 text-xs text-gray-300"><span className="glass-chip rounded-full px-4 py-2 inline-flex items-center gap-2"><MapPin size={14} className="text-neon"/>{a.location}</span><span className="glass-chip rounded-full px-4 py-2">{a.language}</span></div>
    <div className="flex flex-wrap gap-3 mt-8"><a className="primary-link" href="#engineering-cases">{a.caseTitle}<ArrowDown size={16}/></a><a className="secondary-link" href={`${baseUrl}CV_Cris_Alvarado.pdf`} download>{config.contact.resume}<ArrowUpRight size={16}/></a></div>
   </div>
   <div className="hidden lg:block relative p-3 glass-surface rounded-[2.5rem] rotate-2 hover:rotate-0 transition-transform duration-500">
    <div className="absolute -inset-5 rounded-[3rem] border border-neon/10 -rotate-6 pointer-events-none"/>
    <img src={`${baseUrl}avatar.webp`} width="510" height="680" alt="Cristian Alvarado, Software Engineer" className="rounded-[1.8rem] w-full aspect-[3/4] object-cover"/>
    <p className="text-xs font-mono text-neon px-3 pt-4 pb-2">Software Engineer · Mercado Libre</p>
   </div>
  </header>

  <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
   <div className="lg:col-span-7 space-y-10">
    <section><h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3"><Cpu className="text-neon shrink-0" size={23}/>{a.sections.profile}</h2><div className="glass-surface p-7 sm:p-9 rounded-[2rem]"><p className="text-gray-300 leading-[1.9]">{a.background}</p></div></section>
    <section><h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3"><Users className="text-neon shrink-0" size={23}/>{a.sections.workingStyle}</h2><div className="grid sm:grid-cols-2 gap-4">{a.skills.soft.map(s=><SkillCard key={s.title} {...s}/>)}</div></section>
   </div>
   <section className="lg:col-span-5"><h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3"><Code2 className="text-neon shrink-0" size={23}/>{a.sections.practiceAreas}</h2><div className="space-y-4">{a.skills.technical.map(s=><SkillCard key={s.title} {...s}/>)}</div></section>
  </div>

  <section id="engineering-cases" className="mb-20"><p className="eyebrow mb-4">{lang==='en'?'Selected engineering cases':'Casos de ingeniería'}</p><h2 className="section-heading">{a.caseTitle}</h2><p className="text-gray-400 mt-4 mb-9 max-w-2xl leading-relaxed">{a.caseIntro}</p>
   <div className="space-y-6">{a.cases.map((c,i)=><section key={c.id} id={c.id} className="glass-surface rounded-[2rem] p-6 sm:p-9 relative overflow-hidden group">
    <div className="absolute right-0 top-0 h-56 w-56 bg-neon/[0.025] rounded-full blur-2xl pointer-events-none group-hover:bg-neon/5 transition-colors" aria-hidden="true"/>
    <div className="relative grid lg:grid-cols-[.85fr_1.15fr] gap-7 lg:gap-12">
     <div><p className="eyebrow mb-5">0{i+1} / {c.category}</p><h3 className="text-2xl sm:text-3xl font-semibold leading-tight mb-6">{c.title}</h3><div className="flex flex-wrap gap-2 mb-7">{c.tags.map(t=><span className="glass-chip rounded-full text-[11px] text-gray-300 py-1.5 px-3" key={t}>{t}</span>)}</div><a href={localHref(c.href,lang)} className="text-sm text-neon inline-flex items-center gap-2 leading-relaxed">{c.link}<ArrowUpRight className="shrink-0" size={16}/></a></div>
     <dl className="space-y-5">{[[a.problemLabel,c.problem],[a.contributionLabel,c.contribution],[a.resultLabel,c.result]].map(([label,value])=><div key={label}><dt className="text-xs text-neon uppercase tracking-widest mb-2 font-mono">{label}</dt><dd className="text-gray-300 text-sm leading-[1.8]">{value}</dd></div>)}</dl>
    </div>
    <ol className="relative grid sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">{c.flow.map((step,j)=><li key={step} className="glass-soft rounded-xl px-4 py-3 text-xs text-gray-300 flex items-center justify-between gap-3 leading-relaxed"><span><span className="text-neon/70 mr-2 font-mono">{j+1}.</span>{step}</span>{j<2&&<ArrowRight size={14} className="text-neon/50 shrink-0" aria-hidden="true"/>}</li>)}</ol>
   </section>)}</div>
  </section>

  <section id="education" className="grid md:grid-cols-[1fr_1.1fr] gap-7 glass-soft rounded-[2rem] p-7 sm:p-10 mb-10">
   <div><GraduationCap className="text-neon mb-6" size={30}/><h2 className="section-heading mb-6">{a.educationTitle}</h2><h3 className="text-white font-semibold text-xl">{a.education.name}</h3><p className="text-gray-300 mt-2">{a.education.institution}</p><p className="text-gray-400 text-sm mt-2"><time dateTime={a.education.date}>{a.education.displayDate}</time></p></div>
   <div className="md:border-l border-white/10 md:pl-8"><h3 className="text-neon font-semibold mb-4">Machine Learning & Deep Learning · UTP</h3><p className="text-gray-300 leading-relaxed mb-7">{a.teaching}</p><a className="secondary-link" href={localHref('/work/nexo/',lang)}>{lang==='en'?'See the tool I built for teaching':'Conoce la herramienta que creé para enseñar'}<ArrowUpRight size={16}/></a></div>
  </section>
 </div></article>;
}
