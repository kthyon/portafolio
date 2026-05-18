import React from 'react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../data/site';

const AdvantageItem = ({ value, label, sublabel, icon: Icon, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, delay: index * 0.08, ease: 'easeOut' }}
        className="glass-surface flex min-h-[210px] flex-col justify-between p-7 pr-16 rounded-[2rem] hover:border-neon transition-colors relative overflow-hidden group"
    >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {Icon && (
            <span className="glass-chip absolute right-6 bottom-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                <Icon className="h-5 w-5 text-neon" />
            </span>
        )}
        <div className="mb-6">
            <span className="block text-4xl md:text-[2.65rem] xl:text-[2.75rem] font-display font-bold leading-none text-white">
                {value}
            </span>
        </div>
        <div>
            <span className="text-white text-base lg:text-lg font-display font-bold mb-2 block leading-tight">{label}</span>
            <span className="text-gray-400 text-sm leading-relaxed">{sublabel}</span>
        </div>
    </motion.div>
);

export default function Metrics() {
    const { config } = useSiteConfig();
    const { title, items } = config.metrics;

    return (
        <section className="py-20 sm:py-28 lg:py-32 px-4 border-t border-white/5" id="advantages">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-white mb-10 sm:mb-16">{title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <AdvantageItem
                            key={index}
                            value={item.value}
                            label={item.label}
                            sublabel={item.sublabel}
                            icon={item.icon}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
