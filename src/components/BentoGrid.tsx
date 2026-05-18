import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSiteConfig } from '../data/site';

const BentoCard = ({ children, className, title, icon: Icon, delay = 0, variant = "default", scrollYProgress, index }: any) => {
    const isNeon = variant === 'neon';
    const yOffsets = [0, -30, -60];
    const y = useTransform(scrollYProgress, [0, 1], [0, yOffsets[index % 3] || 0]);

    return (
        <motion.div style={{ y }} className={`${className} min-h-[220px] sm:min-h-[260px]`}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay }}
                className={`h-full flex flex-col relative rounded-[2rem] p-6 sm:p-8 overflow-hidden group transition-all duration-300 hover:-translate-y-1 ${
                    isNeon
                        ? 'bg-neon text-dark-900'
                        : 'glass-surface hover:border-white/25'
                }`}
            >
                {/* Icon container */}
                {Icon && (
                    <div className={`mb-6 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isNeon
                            ? 'bg-dark-900/10 border border-dark-900/10'
                            : 'glass-chip group-hover:bg-neon/10 group-hover:border-neon/25'
                    }`}>
                        <Icon className={`w-5 h-5 ${isNeon ? 'text-dark-900' : 'text-neon'}`} strokeWidth={1.75} />
                    </div>
                )}

                {/* Title + description */}
                <div className="flex-1">
                    <h3 className={`font-display font-bold mb-3 leading-tight ${
                        isNeon ? 'text-dark-900 text-xl' : 'text-white text-lg'
                    }`}>
                        {title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                        isNeon ? 'text-dark-900/72 font-medium' : 'text-gray-500'
                    }`}>
                        {children}
                    </p>
                </div>

                {/* Bottom arrow */}
                {!isNeon && (
                    <div className="mt-6 flex items-center gap-1 text-neon text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Explorar <ArrowUpRight className="w-3 h-3" />
                    </div>
                )}

                {/* Hover gradient */}
                {!isNeon && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}

            </motion.div>
        </motion.div>
    );
};

export default function BentoGrid() {
    const { config } = useSiteConfig();
    const { title, subtitle, cards } = config.bentoGrid;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={ref} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="services">
            <div className="mb-10 sm:mb-16">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-neon w-10" />
                    <span className="text-neon font-display text-xs tracking-[0.25em] uppercase">{title}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-bold leading-tight text-white max-w-3xl">{subtitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <BentoCard
                        key={index}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        title={card.title}
                        icon={card.icon}
                        className={card.colSpan}
                        variant={card.variant}
                        delay={card.delay}
                    >
                        {card.description}
                    </BentoCard>
                ))}
            </div>
        </section>
    );
}
