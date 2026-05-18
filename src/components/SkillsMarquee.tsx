import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const capabilityGroups = [
    {
        title: 'AI Systems',
        caption: 'Agents, context, reasoning',
        tone: 'text-cyan',
        items: [
            { name: 'MCP Servers', icon: 'anthropic' },
            { name: 'AI Agents', icon: 'langchain' },
            { name: 'Python', icon: 'python' },
        ],
    },
    {
        title: 'Distributed Backend',
        caption: 'Concurrency, reliability, scale',
        tone: 'text-white',
        items: [
            { name: 'Go', icon: 'go' },
            { name: 'Rust', icon: 'rust' },
            { name: 'Kafka', icon: 'apachekafka' },
            { name: 'PostgreSQL', icon: 'postgresql' },
        ],
    },
    {
        title: 'Cloud & Platform',
        caption: 'Infra, delivery, operations',
        tone: 'text-neon',
        items: [
            { name: 'Kubernetes', icon: 'kubernetes' },
            { name: 'Terraform', icon: 'terraform' },
            { name: 'AWS', icon: 'amazonaws' },
            { name: 'GCP', icon: 'googlecloud' },
        ],
    },
    {
        title: 'Product Surface',
        caption: 'Interfaces engineers can trust',
        tone: 'text-coral',
        items: [
            { name: 'TypeScript', icon: 'typescript' },
            { name: 'React', icon: 'react' },
            { name: 'Docker', icon: 'docker' },
            { name: 'GitHub', icon: 'github' },
        ],
    },
];

export default function SkillsMarquee() {
    const ref = useRef(null);
    const [paused, setPaused] = useState(false);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], [35, -20]);

    return (
        <motion.section
            ref={ref}
            style={{ y }}
            className="relative border-y border-white/[0.06] py-10 sm:py-12"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40 mb-3">
                        Technology Stack
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-white">
                        Tools organized by the problems they solve.
                    </h2>
                </div>

                <div
                    className="relative overflow-hidden"
                    style={{
                        WebkitMaskImage:
                            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                        maskImage:
                            'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                    }}
                >
                    <div
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        className="flex w-max gap-5"
                        style={{
                            animation: 'skills-rail 28s linear infinite',
                            animationPlayState: paused ? 'paused' : 'running',
                        }}
                    >
                        {[...capabilityGroups, ...capabilityGroups].map((group, index) => (
                                <article
                                    key={`${group.title}-${index}`}
                                    className="glass-surface relative w-[360px] sm:w-[420px] lg:w-[460px] shrink-0 rounded-[2rem] p-6 sm:p-7"
                                >
                                    <div className="flex items-start justify-between gap-6 mb-8">
                                        <div>
                                            <h3 className={`font-display text-lg ${group.tone}`}>{group.title}</h3>
                                            <p className="text-sm text-white/40 mt-2">{group.caption}</p>
                                        </div>
                                        <span className="font-mono text-[10px] tracking-[0.3em] text-white/25">
                                            0{(index % capabilityGroups.length) + 1}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {group.items.map((item) => (
                                            <div
                                                key={item.name}
                                                className="glass-chip group inline-flex items-center gap-3 rounded-full px-4 py-3 transition-all hover:border-white/25 hover:bg-white/[0.08]"
                                            >
                                                <img
                                                    src={`https://cdn.simpleicons.org/${item.icon}/9ca3af`}
                                                    alt={item.name}
                                                    className="w-4 h-4 opacity-75 group-hover:opacity-100"
                                                />
                                                <span className="font-mono text-[11px] tracking-[0.16em] text-white/70">
                                                    {item.name.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
