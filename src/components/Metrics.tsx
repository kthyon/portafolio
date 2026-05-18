import React from 'react';
import { useSiteConfig } from '../data/site';

const AdvantageItem = ({ value, label, sublabel, icon: Icon }: any) => (
    <div className="glass-surface flex flex-col p-8 rounded-[2rem] hover:border-neon transition-colors relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
            <span className="text-4xl md:text-5xl font-display font-bold font-outline text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                {value}
            </span>
            {Icon && <Icon className="w-6 h-6 text-neon" />}
        </div>
        <span className="text-white text-lg font-display font-bold mb-2 block">{label}</span>
        <span className="text-gray-400 text-sm leading-snug">{sublabel}</span>
    </div>
);

export default function Metrics() {
    const { config } = useSiteConfig();
    const { title, items } = config.metrics;

    return (
        <section className="py-32 px-4 border-t border-white/5" id="advantages">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-white mb-16">{title}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <AdvantageItem
                            key={index}
                            value={item.value}
                            label={item.label}
                            sublabel={item.sublabel}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
