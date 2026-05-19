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
        id: 'positioning',
        keywords: ['perfil', 'resumen', 'quien', 'who', 'about', 'summary'],
        es: 'Cris es Staff Software Engineer con foco en backend, sistemas distribuidos, platform engineering y herramientas de IA aplicadas a flujos reales de ingeniería.',
        en: 'Cris is a Staff Software Engineer focused on backend, distributed systems, platform engineering, and AI tooling applied to real engineering workflows.',
        related: ['scale', 'work_style'],
    },
    {
        id: 'remote',
        keywords: ['remoto', 'remote', 'modalidad', 'location', 'ubicacion', 'distribuido'],
        es: 'Cris trabaja bien en equipos distribuidos y tiene experiencia colaborando con equipos de Latinoamérica en distintos idiomas.',
        en: 'Cris works well in distributed teams and has experience collaborating with teams across Latin America and languages.',
        related: ['latam', 'role'],
    },
    {
        id: 'role',
        keywords: ['rol', 'role', 'scope', 'senior', 'staff', 'enfoque', 'focus'],
        es: 'Su scope natural está en backend, sistemas distribuidos, platform engineering, developer tooling e IA aplicada a ingeniería.',
        en: 'His natural scope is backend, distributed systems, platform engineering, developer tooling, and AI applied to engineering workflows.',
        related: ['ownership', 'stack'],
    },
    {
        id: 'fintech',
        keywords: ['fintech', 'mercado pago', 'mercadolibre', 'mercado libre', 'partners', 'marketplace'],
        es: 'Su contexto actual está en Mercado Libre / Mercado Pago: un ecosistema fintech y marketplace regional, con trabajo relacionado con partners y sistemas de Mercado Pago.',
        en: 'His current context is Mercado Libre / Mercado Pago: a regional fintech and marketplace ecosystem, with work related to Mercado Pago partners and systems.',
        related: ['scale', 'distributed_systems'],
    },
    {
        id: 'scale',
        keywords: ['escala', 'scale', '200m', 'usuarios', 'users', 'impacto', 'impact'],
        es: 'Ha trabajado en un entorno de escala regional dentro del ecosistema Mercado Libre y Mercado Pago, donde la confiabilidad, la operación y la evolución técnica importan tanto como construir features.',
        en: 'He has worked in a regional-scale environment within the Mercado Libre and Mercado Pago ecosystem, where reliability, operations, and technical evolution matter as much as feature delivery.',
        related: ['distributed_systems', 'observability'],
    },
    {
        id: 'stack',
        keywords: ['stack', 'tecnologia', 'tecnologías', 'technologies', 'go', 'python', 'kubernetes', 'aws', 'terraform'],
        es: 'Su stack combina backend y plataforma: Go, Python, TypeScript, AWS, GCP, Kubernetes, Terraform, PostgreSQL, Kafka y herramientas modernas de IA como MCP servers y agentes.',
        en: 'His stack combines backend and platform work: Go, Python, TypeScript, AWS, GCP, Kubernetes, Terraform, PostgreSQL, Kafka, and modern AI tooling such as MCP servers and agents.',
        related: ['distributed_systems', 'ai_tooling'],
    },
    {
        id: 'ai_tooling',
        keywords: ['ia', 'ai', 'mcp', 'agents', 'agentes', 'skills', 'tooling'],
        es: 'Tiene experiencia reciente construyendo herramientas de IA para ingeniería: MCP servers, agentes, skills y automatizaciones integradas a flujos técnicos reales.',
        en: 'He has recent experience building AI tooling for engineering: MCP servers, agents, skills, and automations integrated into real technical workflows.',
        related: ['developer_experience', 'stack'],
    },
    {
        id: 'distributed_systems',
        keywords: ['sistemas distribuidos', 'distributed', 'backend', 'concurrencia', 'resiliencia', 'reliability'],
        es: 'Su experiencia técnica se concentra en backend de alta concurrencia, sistemas distribuidos, resiliencia y operación de servicios que deben mantenerse claros para los equipos que los evolucionan.',
        en: 'His technical experience centers on high-concurrency backend systems, distributed systems, resilience, and services that must remain understandable for the teams evolving them.',
        related: ['observability', 'work_style'],
    },
    {
        id: 'developer_experience',
        keywords: ['developer experience', 'dx', 'herramientas', 'tools', 'automation', 'automatizacion', 'productividad'],
        es: 'Le interesa reducir fricción para otros ingenieros mediante tooling, automatización y sistemas que hagan más claro el trabajo técnico.',
        en: 'He is interested in reducing friction for other engineers through tooling, automation, and systems that make technical work clearer.',
        related: ['ai_tooling', 'work_style'],
    },
    {
        id: 'observability',
        keywords: ['observabilidad', 'observability', 'slo', 'sla', 'operacion', 'operation', 'reliability'],
        es: 'Su enfoque conecta arquitectura con operación: observabilidad, confiabilidad, trade-offs técnicos y sistemas que puedan sostenerse en producción.',
        en: 'His approach connects architecture with operations: observability, reliability, technical trade-offs, and systems that can hold up in production.',
        related: ['distributed_systems', 'ownership'],
    },
    {
        id: 'leadership',
        keywords: ['liderazgo', 'leadership', 'mentor', 'mentoria', 'docente', 'teaching', 'comunicacion'],
        es: 'Tiene experiencia tomando decisiones técnicas, acompañando equipos y enseñando. Eso se nota en cómo comunica trade-offs entre arquitectura, operación y producto.',
        en: 'He has experience making technical decisions, supporting teams, and teaching. That shows in how he communicates trade-offs across architecture, operations, and product needs.',
        related: ['work_style', 'ownership'],
    },
    {
        id: 'work_style',
        keywords: ['como trabaja', 'how works', 'estilo', 'style', 'colaboracion', 'collaboration'],
        es: 'Trabaja conectando contexto de producto, arquitectura y operación. Prefiere sistemas que no solo funcionen, sino que puedan ser entendidos, mantenidos y evolucionados por el equipo.',
        en: 'He works by connecting product context, architecture, and operations. He prefers systems that not only work, but can be understood, maintained, and evolved by the team.',
        related: ['leadership', 'developer_experience'],
    },
    {
        id: 'ownership',
        keywords: ['ownership', 'impacto', 'impact', 'responsabilidad', 'responsibility'],
        es: 'Su perfil encaja bien con equipos que valoran ownership: entender el problema, tomar decisiones técnicas con criterio y cuidar la operación después de construir.',
        en: 'His profile fits teams that value ownership: understanding the problem, making sound technical decisions, and caring about operations after building.',
        related: ['role', 'observability'],
    },
    {
        id: 'contact',
        keywords: ['contacto', 'contact', 'linkedin', 'github', 'cv', 'resume', 'whatsapp'],
        es: 'Puedes contactarlo por LinkedIn, revisar su GitHub o descargar el CV desde el sitio. Si necesitas una conversación directa, WhatsApp también está disponible.',
        en: 'You can reach him on LinkedIn, review his GitHub, or download the CV from the site. If you need a direct conversation, WhatsApp is also available.',
    },
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
        fallback: 'Ese detalle no está en mi perfil local. Para algo específico, lo mejor es preguntarme directamente por LinkedIn o WhatsApp.',
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
        fallback: 'That detail is not in my local profile. For something specific, it is better to ask me directly on LinkedIn or WhatsApp.',
    },
};

function normalize(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function getLang(): Lang {
    if (typeof window === 'undefined') return 'es';
    return (localStorage.getItem('lang') === 'en' ? 'en' : 'es') as Lang;
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
                    className="font-bold text-neon underline underline-offset-4"
                >
                    WhatsApp
                </a>
            );
        }

        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    });
}

export default function ProfileBot() {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState<Lang>('es');
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
                <section className="mb-4 w-[calc(100vw-2rem)] max-w-[410px] overflow-hidden rounded-[1.2rem] border border-white/14 bg-[#050605]/94 font-mono shadow-[0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
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
                                <span className="text-neon/70">$</span> {copy[lang].suggestionsLabel}
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
                className="group flex items-center gap-3 rounded-[1rem] border border-neon/20 bg-[#050605]/88 px-3 py-3 font-mono text-sm font-bold text-white shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition hover:border-neon/50 hover:bg-white/[0.055]"
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
