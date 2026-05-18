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
    const lineScale = useTransform(scrollYProgress, [0.08, 0.85], [0, 1]);

    if (!experience) return null;

    return (
        <section id="experience" ref={ref} className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
            <motion.div 
                style={{ y, opacity }}
                className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-neon/10 blur-[120px] rounded-full pointer-events-none" 
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-10 sm:mb-14">
                    <div className="h-px bg-neon w-12" />
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider">
                        {experience.title}
                    </h2>
                </div>

                <ol className="relative ml-3 sm:ml-6">
                    <span className="absolute bottom-5 left-[15px] top-5 w-px bg-white/10" aria-hidden="true" />
                    <motion.span
                        className="absolute left-[15px] top-5 w-px origin-top bg-gradient-to-b from-neon via-neon/45 to-transparent"
                        style={{ bottom: 20, scaleY: lineScale }}
                        aria-hidden="true"
                    />
                    {experience.jobs.map((job: any, index: number) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative mb-5 pl-12 sm:pl-14 last:mb-0"
                        >
                            <span className="absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-dark-900 shadow-[0_0_0_6px_rgba(7,7,7,1)]">
                                <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_16px_rgba(162,232,114,0.55)]" />
                            </span>

                            <div className="glass-soft rounded-[1.5rem] p-5 sm:p-6">
                                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white">{job.role}</h3>
                                        <p className="text-neon font-mono text-xs sm:text-sm mt-1">{job.company}</p>
                                    </div>
                                    <span className="text-gray-400 font-mono text-xs sm:text-sm px-3 py-1 glass-chip rounded-full w-fit">
                                        {job.period}
                                    </span>
                                </div>

                                <p className="text-gray-400 mb-5 leading-relaxed text-sm sm:text-base">
                                    {job.description}
                                </p>

                                <ul className="space-y-3">
                                    {job.achievements.map((achievement: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon/80" />
                                            <span className="text-gray-300 text-sm leading-relaxed">{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
