import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Globe, Github } from 'lucide-react';
import { useSiteConfig } from '../data/site';
import { languageBase, localHref } from './links';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

const resolveNavHref = (href: string, lang: 'en' | 'es') => {
    if (href.startsWith('http://') || href.startsWith('https://')) return href;
    if (href.startsWith('/#')) return localHref(href,lang);
    if (href.startsWith('/')) return localHref(href,lang);
    return href;
};

export default function Navbar({initialLanguage = 'en', pagePath = ''}: {initialLanguage?: 'en' | 'es', pagePath?: string}) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { config, lang } = useSiteConfig(initialLanguage);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { logoText, logoInitials, github, links, ctaText } = config.navbar;
    const route = pagePath;
    const languageSwitchHref = lang === 'en' ? `${baseUrl}es/${route}` : `${baseUrl}${route}`;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-dark-900/55 backdrop-blur-2xl border-b border-white/10' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href={languageBase(lang)} className="flex items-center gap-3 group">
                        <div className="relative flex h-11 w-11 items-center justify-center">
                            <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
                                <circle cx="24" cy="24" r="20.5" fill="none" stroke="rgba(211,215,218,0.5)" strokeWidth="1.5" />
                                <path d="M16 28.5V19.5H26.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M31.5 19.5L36 28.5M29.2 25H34.1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="sr-only">{logoInitials}</span>
                        </div>
                        <span className="text-white font-display font-bold text-xs sm:text-lg tracking-[0.1em] sm:tracking-[0.18em] group-hover:text-action transition-colors">
                            {logoText}
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <a
                                key={link.name}
                                href={resolveNavHref(link.href,lang)}
                                className="text-sm font-medium text-gray-300 hover:text-action transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-action transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <a 
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-action transition-colors"
                            aria-label="GitHub" title="GitHub Profile"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a href={languageSwitchHref} hrefLang={lang === 'en' ? 'es' : 'en'} 
                            className="flex items-center gap-2 text-gray-400 hover:text-action transition-colors"
                            aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'} title="Translate / Traducir"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase">{lang === 'es' ? 'EN' : 'ES'}</span>
                        </a>
                        <a href="https://www.linkedin.com/in/crisalvarado-ingeniero/" target="_blank" rel="noopener noreferrer" className="group/cta relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.035] px-5 py-2.5 text-sm font-bold text-action shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:border-action/45 hover:bg-white/[0.06]">
                            <span className="absolute inset-y-0 left-0 w-px bg-action/70" />
                            <span>{ctaText}</span>
                            <ArrowRight className="h-4 w-4 text-action transition-transform group-hover/cta:translate-x-1" />
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4 text-white">
                        <a 
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-action transition-colors" aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a href={languageSwitchHref} hrefLang={lang === 'en' ? 'es' : 'en'} aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'} className="text-gray-400 hover:text-action">
                            <span className="text-sm font-bold uppercase">{lang === 'es' ? 'EN' : 'ES'}</span>
                        </a>
                        <button aria-label={isOpen ? (lang === 'en' ? 'Close navigation' : 'Cerrar navegación') : (lang === 'en' ? 'Open navigation' : 'Abrir navegación')} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        id="mobile-navigation" className="md:hidden glass-surface border-b border-white/10"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={resolveNavHref(link.href,lang)}
                                    className="block text-gray-300 hover:text-action transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a href="https://www.linkedin.com/in/crisalvarado-ingeniero/" target="_blank" rel="noopener noreferrer" className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-sm font-bold text-action">
                                <span className="absolute inset-y-0 left-0 w-px bg-action/70" />
                                {ctaText}
                                <ArrowRight className="h-4 w-4 text-action" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
