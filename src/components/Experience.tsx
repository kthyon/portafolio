import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSiteConfig } from '../data/site';

export default function Experience() {
    const { config } = useSiteConfig();
    const { experience } = config;
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    if (!experience) return null;

    return (
        <section id="experience" ref={ref} className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
            <motion.div 
                style={{ y, opacity }}
                className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-neon/10 blur-[120px] rounded-full pointer-events-none" 
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px bg-neon w-12" />
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider">
                        {experience.title}
                    </h2>
                </div>

                <div className="relative border-l border-white/10 ml-6 md:ml-8 pb-8">
                    {experience.jobs.map((job: any, index: number) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="mb-12 relative pl-8 md:pl-12"
                        >
                            <span className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-dark-900 border-2 border-neon shadow-[0_0_10px_rgba(162,232,114,0.5)]" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{job.role}</h3>
                                    <p className="text-neon font-mono text-sm mt-1">{job.company}</p>
                                </div>
                                <span className="text-gray-400 font-mono text-sm mt-2 md:mt-0 px-3 py-1 glass-chip rounded-full w-fit">
                                    {job.period}
                                </span>
                            </div>

                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {job.description}
                            </p>

                            <ul className="space-y-3">
                                {job.achievements.map((achievement: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="text-neon mt-1.5 opacity-70">▹</span>
                                        <span className="text-gray-300 text-sm leading-relaxed">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
