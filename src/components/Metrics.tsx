import ScrollReveal from './ScrollReveal';
import React from 'react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../data/site';
import { Globe2, Workflow, GraduationCap, Code2 } from 'lucide-react';
const icons = [Globe2, GraduationCap, Code2, Workflow];

const AdvantageItem = ({ value, label, sublabel, icon: Icon, index }: any) => (
    <ScrollReveal preset="rise" delay={index*.065}
        className="flex min-h-[240px] flex-col justify-between border-t border-white/20 pt-6 pb-4 px-2 hover:border-neon transition-colors relative group"
    >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {Icon && (
            <span className="absolute right-2 top-6 flex h-5 w-5 items-center justify-center">
                <Icon className="h-5 w-5 text-neon" />
            </span>
        )}
        <div className="mb-7 pt-8">
            <span className="block text-3xl md:text-[2.1rem] xl:text-[2.25rem] font-display font-bold leading-tight text-white">
                {value}
            </span>
        </div>
        <div>
            <span className="text-white text-base lg:text-lg font-display font-bold mb-2 block leading-tight">{label}</span>
            <span className="text-gray-400 text-sm leading-relaxed">{sublabel}</span>
        </div>
    </ScrollReveal>
);

export default function Metrics({initialLanguage = 'en'}: {initialLanguage?: 'en' | 'es'}) {
    const { config } = useSiteConfig(initialLanguage);
    const { title, items } = config.metrics;

    return (
        <section className="py-20 sm:py-28 lg:py-32 px-4 border-t border-white/5" id="advantages">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal preset="title"><h2 className="text-3xl font-display font-bold text-white mb-10 sm:mb-16">{title}</h2></ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-9 gap-y-7">
                    {items.map((item, index) => (
                        <AdvantageItem
                            key={index}
                            value={item.value}
                            label={item.label}
                            sublabel={item.sublabel}
                            icon={icons[index]}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
