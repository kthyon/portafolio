import React, { useRef } from 'react';
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../data/site';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

function Portrait() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 220, damping: 28 });
    const mouseY = useSpring(y, { stiffness: 220, damping: 28 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ['3deg', '-3deg']);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-4deg', '4deg']);
    const glowX = useTransform(mouseX, [-0.5, 0.5], ['78%', '22%']);
    const glowY = useTransform(mouseY, [-0.5, 0.5], ['75%', '25%']);
    const glare = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(0,0,0,0.18), transparent 45%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="relative -left-[184px] h-[500px] w-[360px] sm:left-0 sm:h-[620px] sm:w-[470px] lg:left-0 lg:h-[680px] lg:w-[510px]"
        >
            <motion.div
                style={{
                    x: useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
                    y: useTransform(mouseY, [-0.5, 0.5], [-8, 8]),
                    transform: 'translateZ(8px)',
                }}
                className="absolute inset-x-12 bottom-0 h-[72%] rounded-full bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.12),rgba(255,255,255,0.04)_28%,rgba(0,0,0,0.16)_52%,transparent_76%)] blur-3xl"
            />

            <motion.img
                src={`${baseUrl}avatar.webp`}
                alt="Cris Alvarado"
                className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 object-contain object-top [filter:brightness(1.01)_contrast(1.08)_saturate(1.03)]"
                style={{
                    x: useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
                    y: useTransform(mouseY, [-0.5, 0.5], [-4, 4]),
                    transform: 'translateZ(72px)',
                    WebkitMaskImage:
                        'radial-gradient(120% 72% at 50% 18%, black 58%, transparent 100%), radial-gradient(105% 46% at 50% 100%, transparent 0%, transparent 28%, black 60%)',
                    WebkitMaskComposite: 'source-in',
                    maskImage:
                        'radial-gradient(120% 72% at 50% 18%, black 58%, transparent 100%), radial-gradient(105% 46% at 50% 100%, transparent 0%, transparent 28%, black 60%)',
                    maskComposite: 'intersect',
                }}
            />

            <motion.div
                style={{
                    background: glare,
                    transform: 'translateZ(100px)',
                    WebkitMaskImage:
                        'radial-gradient(120% 72% at 50% 18%, black 58%, transparent 100%), radial-gradient(105% 46% at 50% 100%, transparent 0%, transparent 28%, black 60%)',
                    WebkitMaskComposite: 'source-in',
                    maskImage:
                        'radial-gradient(120% 72% at 50% 18%, black 58%, transparent 100%), radial-gradient(105% 46% at 50% 100%, transparent 0%, transparent 28%, black 60%)',
                    maskComposite: 'intersect',
                }}
                className="absolute inset-0 pointer-events-none"
            />
        </motion.div>
    );
}

export default function Hero() {
    const { config } = useSiteConfig();
    const { hero } = config;
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '70%']);
    const yText = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
    const yTags = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
    const yPortrait = useTransform(scrollYProgress, [0, 1], ['0%', '42%']);

    return (
        <section
            ref={ref}
            className="relative min-h-screen overflow-hidden px-4 pt-28 sm:px-6 lg:px-8"
        >
            <motion.div
                style={{ y: yBackground }}
                className="absolute left-0 top-[18%] h-[64%] w-[42%] border-y border-white/5 pointer-events-none"
            />

            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[120px_minmax(0,1fr)_420px] lg:gap-12">
                <aside className="hidden h-full flex-col justify-between border-r border-white/10 py-2 pr-8 text-xs font-mono text-white/35 lg:flex">
                    <span>01</span>
                    <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.35em]">
                        SYSTEMS / AI / PLATFORM
                    </span>
                    <span>2026</span>
                </aside>

                <motion.div
                    style={{ y: yText }}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="mb-8 flex items-center gap-4">
                        <span className="h-px w-12 bg-white/25" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/55">
                            {hero.badge}
                        </span>
                    </div>

                    <h1 className="relative z-20 mb-8 font-display text-4xl font-bold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
                        <span className="relative inline-block">
                            <span className="relative z-10">{hero.title.line1}</span>
                            <span className="pointer-events-none absolute inset-0 z-0 text-white/25 [clip-path:polygon(0_44%,100%_44%,100%_100%,0_100%)]">
                                {hero.title.line1}
                            </span>
                        </span>{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-neon">{hero.title.highlight}</span>
                            <span className="pointer-events-none absolute inset-0 z-30 text-neon [clip-path:polygon(0_0,100%_0,100%_42%,0_42%)]">
                                {hero.title.highlight}
                            </span>
                        </span>
                        <br />
                        <span className="mt-6 block max-w-3xl font-mono text-base font-medium leading-relaxed tracking-[0.18em] text-white/60 sm:text-xl lg:text-[1.35rem]">
                            {hero.title.subtitle}
                        </span>
                    </h1>

                    <p className="mb-10 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
                        {hero.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href="https://www.linkedin.com/in/crisalvarado-ingeniero/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 border-b border-neon py-2 font-bold text-white"
                        >
                            Initialize Project
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>

                        <a
                            href={`${baseUrl}CV_Cris_Alvarado.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block border-b border-white/15 py-2 font-medium text-white/65 transition-all hover:border-white/40 hover:text-white"
                        >
                            {hero.secondaryCta}
                        </a>
                    </div>

                    <motion.div
                        style={{ y: yTags }}
                        className="mt-16 grid max-w-xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
                    >
                        {hero.trustIndicators.map((brand) => (
                            <span
                                key={brand}
                                className="border-t border-white/10 pt-3 text-xs font-medium text-gray-400 sm:text-sm"
                            >
                                {brand}
                            </span>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ y: yPortrait }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.15 }}
                    className="relative z-20 flex h-[540px] items-center justify-center lg:-ml-[36.5rem] lg:h-[720px]"
                >
                    <Portrait />
                </motion.div>
            </div>
        </section>
    );
}
