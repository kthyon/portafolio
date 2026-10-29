import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {useSiteConfig} from '../data/site';
import {localHref} from './links';
export default function SelectedWork({initialLanguage = 'en'}: {initialLanguage?: 'en' | 'es'}){
 const {config,lang}=useSiteConfig(initialLanguage); const w=config.work;
 return <section id="work" className="section-shell border-y border-white/10"><div className="max-w-7xl mx-auto">
  <p className="eyebrow mb-5">{w.eyebrow}</p><h2 className="section-heading max-w-4xl">{w.title}</h2><p className="text-gray-400 mt-5 mb-10 max-w-2xl leading-relaxed">{w.intro}</p>
  <div className="grid gap-5 md:grid-cols-2">{w.cards.map((c,i)=><article key={c.id} id={c.id} className="glass-soft rounded-3xl p-6 sm:p-8 flex flex-col min-w-0 hover:border-neon/30 transition-colors">
   <div className="flex items-start justify-between gap-3 mb-7"><span className="text-xs text-neon leading-relaxed">{c.category}</span><span className="text-xs text-white/30 font-mono">0{i+1}</span></div>
   <h3 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">{c.title}</h3><p className="text-gray-400 text-sm leading-relaxed mb-6">{c.summary}</p>
   <div className="flex flex-wrap gap-2 mb-7">{c.tags.map(t=><span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-gray-300">{t}</span>)}</div>
   <details className="border-t border-white/10 pt-4 mb-7"><summary className="text-sm text-white cursor-pointer py-1">{w.details}</summary><div className="pt-5 text-sm leading-relaxed"><h4 className="text-neon mb-2">{w.scope}</h4><p className="text-gray-400 mb-5">{c.scope}</p><h4 className="text-neon mb-2">{w.contribution}</h4><ul className="space-y-3 list-disc pl-4 text-gray-300">{c.contribution.map(p=><li key={p}>{p}</li>)}</ul><p className="text-xs text-gray-400 mt-5 border-l border-neon/40 pl-3">{c.note}</p></div></details>
   <div className="mt-auto flex flex-col gap-3">{c.links.map(l=><a key={l.href} href={localHref(l.href,lang)} className="text-sm text-neon inline-flex items-center gap-2 w-fit" {...(l.href.startsWith('https:')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{l.label}<ArrowUpRight size={15}/></a>)}</div>
  </article>)}</div>
 </div></section>;
}
