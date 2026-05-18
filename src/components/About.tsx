import React from 'react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '../data/site';
import { Cpu, Code, Users } from 'lucide-react';

const SkillCard = ({ title, description, delay }: { title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="glass-soft p-6 rounded-[2rem] hover:border-neon/30 transition-all hover:translate-y-[-2px]"
    >
        <h4 className="text-neon font-display font-bold text-sm mb-3 uppercase tracking-wider">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default function About() {
    const { config } = useSiteConfig();
    const { title, role, description, background, skills, sections } = config.about;

    return (
        <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 sm:mb-20"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px bg-neon w-12" />
                        <span className="text-neon font-display text-sm tracking-widest uppercase">Profile</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
                        {title}
                    </h1>
                    <p className="text-xl text-white font-medium mb-6">{role}</p>
                    <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">{description}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Main Content - Background */}
                    <div className="lg:col-span-7 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-invert max-w-none"
                        >
                            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                <span className="glass-chip flex h-10 w-10 items-center justify-center rounded-2xl">
                                    <Cpu className="h-5 w-5 text-neon" />
                                </span>
                                {sections.profile}
                            </h3>
                            <div className="glass-surface p-8 rounded-[2.5rem]">
                                <p className="text-gray-300 leading-relaxed font-light">
                                    {background}
                                </p>
                            </div>
                        </motion.div>

                        {/* Working style */}
                        <div>
                            <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                                <span className="glass-chip flex h-10 w-10 items-center justify-center rounded-2xl">
                                    <Users className="h-5 w-5 text-neon" />
                                </span>
                                {sections.workingStyle}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {skills.soft.map((skill, idx) => (
                                    <SkillCard
                                        key={idx}
                                        title={skill.title}
                                        description={skill.description}
                                        delay={idx * 0.1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Practice areas */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                                <span className="glass-chip flex h-10 w-10 items-center justify-center rounded-2xl">
                                    <Code className="h-5 w-5 text-neon" />
                                </span>
                                {sections.practiceAreas}
                            </h3>
                            <div className="space-y-4">
                                {skills.technical.map((skill, idx) => (
                                    <SkillCard
                                        key={idx}
                                        title={skill.title}
                                        description={skill.description}
                                        delay={idx * 0.1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
