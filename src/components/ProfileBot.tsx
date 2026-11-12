import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, Send, Square, Terminal, X } from 'lucide-react';
import { localHref } from './links';
import { emptyMemory, respond, starterQuestions, type Lang, type Memory, type Reply } from './profileBotEngine';

type ChatMessage = { role: 'user' | 'assistant'; content: string; reply?: Reply };
type Stage = { step: 'idle' } | { step: 'classify' } | { step: 'retrieve'; labels: string[] } | { step: 'stream' };

const STORE = 'cris-profile-bot:v2';
const copy = {
    es: {
        title: 'Cris profile',
        tagline: 'asistente local · sin servidor ni LLM',
        opener: 'Hola. Pregúntame por el perfil técnico de Cris: agentes de IA y MCP, Mercado Pago, Nexo, stack o contacto. Entiendo preguntas de seguimiento.',
        placeholder: 'Pregunta sobre Cris...',
        classify: 'clasificando la pregunta',
        retrieve: 'recuperando contexto',
        noContext: 'sin coincidencias en el perfil',
        sources: 'fuentes',
        launcher: 'Preguntar por Cris',
        close: 'Cerrar asistente',
        send: 'Enviar pregunta',
        stop: 'Mostrar respuesta completa',
        reset: 'Reiniciar conversación',
        you: 'ask',
    },
    en: {
        title: 'Cris profile',
        tagline: 'local assistant · no server or LLM',
        opener: 'Hi. Ask me about Cris’ technical profile: AI agents and MCP, Mercado Pago, Nexo, stack or contact. I understand follow-up questions.',
        placeholder: 'Ask about Cris...',
        classify: 'classifying the question',
        retrieve: 'retrieving context',
        noContext: 'no match in the profile',
        sources: 'sources',
        launcher: 'Ask about Cris',
        close: 'Close assistant',
        send: 'Send question',
        stop: 'Show full answer',
        reset: 'Restart conversation',
        you: 'ask',
    },
};

function getLang(): Lang {
    if (typeof document === 'undefined') return 'en';
    return document.documentElement.lang === 'es' ? 'es' : 'en';
}

function renderText(content: string) {
    return content.split(/(https:\/\/[^\s]+)/g).map((part, index) =>
        part.startsWith('https://') ? (
            <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-action underline underline-offset-4 hover:text-action-hover">
                {part.includes('linkedin.com') ? 'LinkedIn' : part}
            </a>
        ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
        ),
    );
}

// Splits a reply into small chunks so it can be revealed progressively.
const chunk = (text: string) => text.match(/\S+\s*/g) ?? [text];

export default function ProfileBot({ initialLanguage = 'en' }: { initialLanguage?: Lang }) {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<Lang>(initialLanguage);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [stage, setStage] = useState<Stage>({ step: 'idle' });
    const [partial, setPartial] = useState('');
    const memory = useRef<Memory>(emptyMemory());
    const pending = useRef<{ reply: Reply; timers: number[] } | null>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const t = copy[lang];
    const busy = stage.step !== 'idle';

    useEffect(() => {
        const sync = () => setLang(getLang());
        sync();
        window.addEventListener('languageChange', sync);
        return () => window.removeEventListener('languageChange', sync);
    }, []);

    // Restore the conversation across page navigations within the same tab.
    useEffect(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem(STORE) ?? 'null');
            if (saved?.messages?.length) {
                setMessages(saved.messages);
                memory.current = saved.memory ?? emptyMemory();
                setOpen(Boolean(saved.open));
            }
        } catch { /* storage unavailable: start fresh */ }
        return () => pending.current?.timers.forEach(clearTimeout);
    }, []);
    useEffect(() => {
        try { sessionStorage.setItem(STORE, JSON.stringify({ messages, memory: memory.current, open })); } catch { /* ignore */ }
    }, [messages, open]);

    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages, stage, partial, open]);
    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus({ preventScroll: true });
        const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const finish = useCallback(() => {
        const current = pending.current;
        if (!current) return;
        current.timers.forEach(clearTimeout);
        pending.current = null;
        setMessages((prev) => [...prev, { role: 'assistant', content: current.reply.text, reply: current.reply }]);
        setPartial('');
        setStage({ step: 'idle' });
    }, []);

    const ask = (raw?: string) => {
        const question = (raw ?? input).trim();
        if (question.length < 2) return;
        if (pending.current) finish();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: question }]);

        const result = respond(question, lang, memory.current);
        memory.current = result.memory;
        const reply = result.reply;
        const timers: number[] = [];
        pending.current = { reply, timers };
        const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }

        // Staged reveal: classify → show what was retrieved → stream the composed reply.
        setStage({ step: 'classify' });
        later(() => setStage({ step: 'retrieve', labels: reply.topics.map((topic) => topic.label) }), 320);
        const parts = chunk(reply.text);
        let at = 760;
        later(() => setStage({ step: 'stream' }), at);
        let shown = '';
        parts.forEach((part) => {
            at += 16 + Math.min(part.length, 12) * 3 + (/[.:;]\s*$/.test(part) ? 150 : /,\s*$/.test(part) ? 60 : 0);
            later(() => { shown += part; setPartial(shown); }, at);
        });
        later(finish, at + 120);
    };

    const reset = () => {
        pending.current?.timers.forEach(clearTimeout);
        pending.current = null;
        memory.current = emptyMemory();
        setMessages([]); setPartial(''); setStage({ step: 'idle' });
        inputRef.current?.focus();
    };

    const lastReply = useMemo(() => [...messages].reverse().find((m) => m.role === 'assistant')?.reply, [messages]);
    const suggestions = busy ? [] : messages.length ? lastReply?.suggestions ?? [] : starterQuestions(lang).slice(0, 4);
    const chip = 'rounded-md border border-white/10 px-2 py-1 text-[11px] leading-snug text-white/60 transition hover:border-neon/40 hover:text-white';

    return (
        <div className="fixed bottom-5 right-4 z-[120] sm:bottom-6 sm:right-6" data-component="ProfileBot">
            {open && (
                <section aria-label={t.title} className="mb-4 w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-[1.2rem] border border-white/14 bg-[#181818]/95 font-mono shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                        <div className="min-w-0">
                            <h3 className="flex items-center gap-2 text-sm text-white"><span className={`h-1.5 w-1.5 rounded-full bg-neon ${busy ? 'animate-pulse' : ''}`} aria-hidden="true" />{t.title}</h3>
                            <p className="mt-1 truncate text-[10px] tracking-wide text-white/35">{t.tagline}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button onClick={reset} className="rounded-lg border border-white/10 p-2 text-white/55 transition hover:border-white/20 hover:text-white" aria-label={t.reset} title={t.reset}><RotateCcw className="h-4 w-4" /></button>
                            <button onClick={() => setOpen(false)} className="rounded-lg border border-white/10 p-2 text-white/55 transition hover:border-white/20 hover:text-white" aria-label={t.close} title={t.close}><X className="h-4 w-4" /></button>
                        </div>
                    </div>

                    <div ref={listRef} className="max-h-[min(380px,52vh)] space-y-4 overflow-y-auto px-4 py-4 text-sm leading-relaxed">
                        <div><p className="text-white/45"><span className="text-white/25">$</span> cris</p><div className="mt-1 border-l border-white/10 pl-3 text-white/72">{t.opener}</div></div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <p className={message.role === 'user' ? 'text-neon' : 'text-white/45'}><span className="text-white/25">$</span> {message.role === 'user' ? t.you : 'cris'}</p>
                                <div className={message.role === 'user' ? 'mt-1 text-white' : 'mt-1 border-l border-white/10 pl-3 text-white/72'}>
                                    {renderText(message.content)}
                                    {message.reply && message.reply.sources.length > 0 && (
                                        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/35">
                                            <span>{copy[message.reply.lang].sources}:</span>
                                            {message.reply.sources.map((source) => (
                                                <a key={source.href} href={localHref(source.href, lang)} className="inline-flex items-center gap-1 text-action hover:text-action-hover">{source.label}<ArrowUpRight className="h-3 w-3" /></a>
                                            ))}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {busy && (
                            <div aria-hidden="true">
                                <p className="text-white/45"><span className="text-white/25">$</span> cris</p>
                                <div className="mt-1 border-l border-white/10 pl-3">
                                    {stage.step !== 'stream' && (
                                        <p className="text-[11px] text-white/40">
                                            <span className="animate-pulse text-neon">▍</span>{' '}
                                            {stage.step === 'classify' ? t.classify : stage.labels.length ? `${t.retrieve}: ${stage.labels.join(' · ')}` : t.noContext}
                                        </p>
                                    )}
                                    {stage.step === 'stream' && <p className="text-white/72">{renderText(partial)}<span className="animate-pulse text-neon">▍</span></p>}
                                </div>
                            </div>
                        )}
                        <p className="sr-only" role="status" aria-live="polite">{!busy && messages.length && messages[messages.length - 1].role === 'assistant' ? messages[messages.length - 1].content : ''}</p>
                    </div>

                    <div className="border-t border-white/10 p-4">
                        {suggestions.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-1.5">
                                {suggestions.map((prompt) => <button key={prompt} onClick={() => ask(prompt)} className={chip}><span className="text-white/25">›</span> {prompt}</button>)}
                            </div>
                        )}
                        <form onSubmit={(event) => { event.preventDefault(); ask(); }} className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/35 px-3 py-2 focus-within:border-neon/45">
                            <span className="text-neon">$</span>
                            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.placeholder} aria-label={t.placeholder} maxLength={240} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none focus-visible:outline-none placeholder:text-white/30" />
                            {busy ? (
                                <button type="button" onClick={finish} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/70 transition hover:text-white" aria-label={t.stop} title={t.stop}><Square className="h-3.5 w-3.5" /></button>
                            ) : (
                                <button type="submit" disabled={input.trim().length < 2} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neon text-dark-900 transition disabled:cursor-not-allowed disabled:opacity-40" aria-label={t.send}><Send className="h-4 w-4" /></button>
                            )}
                        </form>
                    </div>
                </section>
            )}

            <button onClick={() => setOpen((value) => !value)} aria-expanded={open} className="group flex items-center gap-3 rounded-[1rem] border border-neon/20 bg-[#181818]/88 px-3 py-3 font-mono text-sm font-bold text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition hover:border-neon/50 hover:bg-white/[0.055]" aria-label={t.launcher}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon/35 bg-neon/10 text-neon"><Terminal className="h-5 w-5" /></span>
                <span className="hidden sm:inline">{t.launcher}</span>
            </button>
        </div>
    );
}
