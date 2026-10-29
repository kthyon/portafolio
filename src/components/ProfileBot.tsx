import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Terminal, Send, X } from 'lucide-react';

type Lang = 'es' | 'en';
type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type LocalResult =
    | { type: 'answer'; content: string }
    | { type: 'fallback'; content: string };

type KnowledgeNode = {
    id: string;
    keywords: string[];
    es: string;
    en: string;
    related?: string[];
};

const knowledgeGraph: KnowledgeNode[] = [
    {
        "id": "positioning",
        "keywords": [
            "perfil",
            "resumen",
            "quien",
            "who",
            "about",
            "summary",
            "rol",
            "role",
            "senior",
            "staff",
            "focus",
            "enfoque"
        ],
        "es": "Cristian Alvarado es Software Engineer en Mercado Libre. Su trabajo combina agentes de IA, MCP, herramientas para desarrolladores, automatización e ingeniería backend y de producto para Mercado Pago.",
        "en": "Cristian Alvarado is a Software Engineer at Mercado Libre. His work combines AI agents, MCP, developer tools, workflow automation, and backend and product engineering for Mercado Pago."
    },
    {
        "id": "location",
        "keywords": [
            "remote",
            "remoto",
            "location",
            "ubicacion",
            "ingles",
            "english",
            "idiomas",
            "languages"
        ],
        "es": "Está en Pereira, Colombia, y considera trabajo remoto desde Colombia. Habla español y tiene inglés B2.",
        "en": "He is based in Pereira, Colombia, and considers remote work from Colombia. He speaks Spanish and has B2 English."
    },
    {
        "id": "automation",
        "keywords": [
            "jira",
            "slack",
            "automatizacion",
            "automation",
            "provisioning",
            "onboarding",
            "usuarios",
            "users"
        ],
        "es": "Creó una automatización que conecta Jira, Slack y altas de usuarios específicos en aplicaciones internas para Latinoamérica.",
        "en": "He created automation connecting Jira, Slack and specific user onboarding into internal applications across Latin America."
    },
    {
        "id": "product",
        "keywords": [
            "frontend",
            "front end",
            "react",
            "developers",
            "landing",
            "collaboration",
            "colaboracion",
            "fintech",
            "mercado"
        ],
        "es": "Colaboró con el equipo en landing pages y sitios de Developers de Mercado Pago. Su experiencia general incluye React, TypeScript, Go, Node.js, Java, bases de datos y CI/CD.",
        "en": "He collaborated with the team on Mercado Pago landing pages and Developers sites. His broader experience includes React, TypeScript, Go, Node.js, Java, databases and CI/CD."
    },
    {
        "id": "agents",
        "keywords": [
            "mcp",
            "agentes",
            "agents",
            "skills",
            "ai tooling",
            "ia",
            "ai"
        ],
        "es": "Construye agentes de IA, servidores MCP, skills reutilizables y automatizaciones integradas con herramientas y flujos de ingeniería.",
        "en": "He builds AI agents, MCP servers, reusable skills and automation integrated with engineering tools and workflows."
    },
    {
        "id": "nexo",
        "keywords": [
            "nexo",
            "architecture",
            "arquitectura",
            "reliability",
            "concurrencia",
            "concurrency",
            "distribuidos",
            "distributed",
            "resiliencia",
            "availability",
            "disponibilidad"
        ],
        "es": "Nexo es la herramienta que creó para sus clases. Usa una interfaz JavaScript/Three.js, notebooks Python/Colab y una API autenticada con D1/SQLite. Separa identidad y roles en el servidor y conserva cambios locales pendientes para reintentar. Los guardados son instantáneas; no hay fusión automática de cambios simultáneos desde varios dispositivos. La web muestra el caso y capturas; la demostración se solicita por contacto.",
        "en": "Nexo is the tool he created for teaching. It uses a JavaScript/Three.js interface, Python/Colab notebooks and an authenticated API with D1/SQLite. Server-side identity and role checks separate records, and pending local changes can be retried. Saves are snapshots; there is no automatic merging of simultaneous edits across devices. The portfolio shows the case and screenshots; demonstrations are available by contact."
    },
    {
        "id": "teaching",
        "keywords": [
            "utp",
            "teacher",
            "teaching",
            "profesor",
            "docente",
            "ml",
            "deep learning",
            "machine learning",
            "education",
            "educacion",
            "ciaf",
            "grado"
        ],
        "es": "Es Ingeniero de Software de CIAF, graduado el 14 de diciembre de 2022. Enseñó ML y Deep Learning en la UTP en 2025 y enseña de nuevo desde septiembre de 2026. Fue docente y conferencista en CIAF en 2023.",
        "en": "He holds a Software Engineering degree from CIAF, awarded December 14, 2022. He taught ML and Deep Learning at UTP in 2025 and teaches again from September 2026. He was a CIAF instructor and speaker in 2023."
    },
    {
        "id": "work_style",
        "keywords": [
            "liderazgo",
            "leadership",
            "ownership",
            "como trabaja",
            "how works",
            "communication",
            "comunicacion",
            "problemas",
            "problems"
        ],
        "es": "Su experiencia combina colaboración de producto, automatización de procesos internos, desarrollo backend e interfaces, y docencia técnica. El caso de Nexo explica decisiones de arquitectura y limitaciones concretas.",
        "en": "His experience combines product collaboration, internal workflow automation, backend and interface development, and technical teaching. The Nexo case explains concrete architecture decisions and limitations."
    },
    {
        "id": "contact",
        "keywords": [
            "contacto",
            "contact",
            "linkedin",
            "github",
            "cv",
            "resume",
            "demo"
        ],
        "es": "Puedes contactarlo por LinkedIn, explorar su GitHub y descargar el CV desde el sitio. Nexo se presenta mediante demostración guiada por contacto.",
        "en": "You can contact him on LinkedIn, explore his GitHub and download the résumé from this site. Nexo is available as a guided demonstration by contact."
    }
];

const copy = {
    es: {
        title: 'Cris profile',
        opener:
            'Hola. Puedo ayudarte a entender rápido el perfil técnico de Cris: sistemas, stack, fintech, liderazgo, colaboración o contacto.',
        suggestionsLabel: 'Sugerencias',
        quickPrompts: [
            '¿Cómo trabaja en equipos distribuidos?',
            '¿Cuál es su foco técnico?',
            '¿Qué experiencia tiene en fintech?',
            '¿Cuál es su stack principal?',
            '¿Cómo lidera técnicamente?',
            '¿Qué tipo de problemas busca?',
            '¿Cómo colabora con producto?',
            '¿Qué lo diferencia?',
        ],
        placeholder: 'Pregunta sobre Cris...',
        thinking: 'Revisando el perfil...',
        launcher: 'Preguntar por Cris',
        close: 'Cerrar bot',
        send: 'Enviar pregunta',
        fallback: 'Ese detalle no está en mi perfil local. Para algo específico, lo mejor es preguntarme directamente por LinkedIn.',
    },
    en: {
        title: 'Cris profile',
        opener:
            'Hi. I can help you quickly understand Cris’ technical profile: systems, stack, fintech background, leadership, collaboration, or contact details.',
        suggestionsLabel: 'Suggestions',
        quickPrompts: [
            'How does he work in distributed teams?',
            'What is his technical focus?',
            'What fintech experience does he have?',
            'What is his main stack?',
            'How does he lead technically?',
            'What problems does he work on?',
            'How does he work with product?',
            'What makes him different?',
        ],
        placeholder: 'Ask about Cris...',
        thinking: 'Reading the profile...',
        launcher: 'Ask about Cris',
        close: 'Close bot',
        send: 'Send question',
        fallback: 'That detail is not in my local profile. For something specific, it is better to ask me directly on LinkedIn.',
    },
};

function normalize(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function getLang(): Lang {
    if (typeof window === 'undefined') return 'en';
    return (document.documentElement.lang === 'es' ? 'es' : 'en') as Lang;
}

function scoreNode(question: string, node: KnowledgeNode) {
    const q = normalize(question);
    return node.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalize(keyword);
        if (q.includes(normalizedKeyword)) return score + normalizedKeyword.length;
        return score;
    }, 0);
}

function buildGraphAnswer(question: string, lang: Lang): string | null {
    const ranked = knowledgeGraph
        .map((node) => ({ node, score: scoreNode(question, node) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

    if (!ranked.length) return null;

    const selected = new Map<string, KnowledgeNode>();
    ranked.slice(0, 2).forEach(({ node }) => {
        selected.set(node.id, node);
        node.related?.slice(0, 1).forEach((relatedId) => {
            const related = knowledgeGraph.find((item) => item.id === relatedId);
            if (related && selected.size < 3) selected.set(related.id, related);
        });
    });

    const parts = Array.from(selected.values()).map((node) => node[lang]);
    return parts.join(' ');
}

function localAnswer(question: string, lang: Lang): LocalResult {
    const dictionary = copy[lang];
    const graphAnswer = buildGraphAnswer(question, lang);

    if (graphAnswer) return { type: 'answer', content: graphAnswer };

    return {
        type: 'fallback',
        content: dictionary.fallback,
    };
}

function renderMessage(content: string) {
    const parts = content.split(/(https:\/\/wa\.me\/\d+)/g);

    return parts.map((part, index) => {
        if (part.startsWith('https://wa.me/')) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-action hover:text-action-hover underline underline-offset-4"
                >
                    WhatsApp
                </a>
            );
        }

        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    });
}

export default function ProfileBot({initialLanguage='en'}:{initialLanguage?:Lang}) {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<Lang>(initialLanguage);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const syncLanguage = () => setLang(getLang());
        syncLanguage();
        window.addEventListener('languageChange', syncLanguage);
        window.addEventListener('storage', syncLanguage);
        return () => {
            window.removeEventListener('languageChange', syncLanguage);
            window.removeEventListener('storage', syncLanguage);
        };
    }, []);

    useEffect(() => {
        setMessages([{ role: 'assistant', content: copy[lang].opener }]);
    }, [lang]);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

    const canAsk = useMemo(() => input.trim().length > 1 && !loading, [input, loading]);

    const ask = async (rawQuestion?: string) => {
        const question = (rawQuestion ?? input).trim();
        if (!question || loading) return;

        setInput('');
        setLoading(true);
        setMessages((prev) => [...prev, { role: 'user', content: question }]);

        window.setTimeout(() => {
            const result = localAnswer(question, lang);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: result.content },
            ]);
            setLoading(false);
        }, 180);
    };

    return (
        <div className="fixed bottom-5 right-4 z-[120] sm:bottom-6 sm:right-6">
            {open && (
                <section className="mb-4 w-[calc(100vw-2rem)] max-w-[410px] overflow-hidden rounded-[1.2rem] border border-white/14 bg-[#181818]/94 font-mono shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
                    <div className="border-b border-white/10 px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h3 className="text-sm text-white">{copy[lang].title}</h3>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-white/10 p-2 text-white/55 transition hover:border-white/20 hover:text-white"
                                aria-label={copy[lang].close}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div ref={listRef} className="max-h-[360px] space-y-4 overflow-y-auto px-4 py-4">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className="text-sm leading-relaxed"
                            >
                                <p className={message.role === 'user' ? 'text-neon' : 'text-white/45'}>
                                    <span className="text-white/25">$</span>{' '}
                                    {message.role === 'user' ? 'ask' : 'cris'}
                                </p>
                                <div className={message.role === 'user' ? 'mt-1 text-white' : 'mt-1 border-l border-white/10 pl-3 text-white/72'}>
                                    {renderMessage(message.content)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-sm text-white/50">
                                <span className="text-white/25">$</span> {copy[lang].thinking}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 p-4">
                        <details className="group mb-3 rounded-lg border border-white/10 bg-black/25">
                            <summary className="cursor-pointer list-none px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/40 transition hover:text-neon">
                                <span className="text-accent-light">$</span> {copy[lang].suggestionsLabel}
                            </summary>
                            <div className="grid gap-1 border-t border-white/10 p-2">
                                {copy[lang].quickPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => ask(prompt)}
                                        className="rounded-md px-2 py-2 text-left text-xs leading-snug text-white/55 transition hover:bg-white/[0.04] hover:text-white"
                                    >
                                        <span className="text-white/25">›</span> {prompt}
                                    </button>
                                ))}
                            </div>
                        </details>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                ask();
                            }}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/35 px-3 py-2 focus-within:border-neon/45"
                        >
                            <span className="text-neon">$</span>
                            <input
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder={copy[lang].placeholder}
                                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-white/30"
                            />
                            <button
                                type="submit"
                                disabled={!canAsk}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neon text-dark-900 transition disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={copy[lang].send}
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </section>
            )}

            <button
                onClick={() => setOpen((value) => !value)}
                className="group flex items-center gap-3 rounded-[1rem] border border-neon/20 bg-[#181818]/88 px-3 py-3 font-mono text-sm font-bold text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition hover:border-neon/50 hover:bg-white/[0.055]"
                aria-label={copy[lang].launcher}
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon/35 bg-neon/10 text-neon">
                    <Terminal className="h-5 w-5" />
                </span>
                <span className="hidden sm:inline">{copy[lang].launcher}</span>
            </button>
        </div>
    );
}
