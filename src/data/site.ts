import { useState, useEffect } from 'react';
import { Database, Cpu, Bot, GitMerge, Shield, Zap, Users } from 'lucide-react';

const es = {
    metadata: {
        title: "Cris Alvarado | Staff Software Engineer · AI Systems",
        description: "Portfolio de Cris Alvarado, Staff Engineer especializado en MCP Servers, AI Agents, Sistemas Distribuidos de alta escala y Platform Engineering.",
    },
    navbar: {
        logoText: "CRIS ALVARADO",
        logoInitials: "CA",
        github: "https://github.com/",
        links: [
            { name: 'Expertise', href: '/#services' },
            { name: 'Impacto', href: '/#advantages' },
            { name: 'Acerca de', href: '/about' },
            { name: 'Contacto', href: 'https://www.linkedin.com/in/crisalvarado-ingeniero/' }
        ],
        ctaText: "Conectar"
    },
    about: {
        title: "Acerca de Mí",
        role: "Staff Software Engineer · Sistemas Distribuidos · IA en Producción",
        description: "Más de 10 años construyendo software para entornos de alta escala, con experiencia reciente en sistemas distribuidos y herramientas de IA llevadas a producción.",
        background: "Soy Staff Software Engineer en Mercado Libre, donde trabajo en sistemas que sirven a más de 200 millones de usuarios en producción. Mi experiencia se concentra en backend, sistemas distribuidos y herramientas de IA para ingeniería: he desarrollado MCP servers en producción, agentes autónomos con memoria persistente y Skills para Claude Code que automatizan flujos de trabajo técnicos. También soy docente universitario, una práctica que refuerza mi capacidad de explicar decisiones complejas, acompañar a otros ingenieros y trabajar con equipos de distintos niveles.",
        skills: {
            technical: [
                { title: "Sistemas de IA en Producción", description: "MCP servers, agentes y automatizaciones de IA integradas con flujos reales de ingeniería." },
                { title: "Sistemas Distribuidos", description: "Diseño de servicios backend de alta concurrencia, resiliencia y operación a gran escala." },
                { title: "Developer Tooling", description: "Skills, automatizaciones y herramientas que reducen fricción en procesos técnicos." },
                { title: "Cloud & Platform", description: "AWS/GCP, Kubernetes, Terraform e infraestructura orientada a operación confiable." },
                { title: "Backend", description: "Go, Python y TypeScript aplicados a servicios, automatización y APIs modernas." },
                { title: "Observabilidad", description: "Monitoreo distribuido, trazabilidad y definición de SLOs/SLAs." }
            ],
            soft: [
                { title: "Liderazgo Técnico", description: "Participación en decisiones de arquitectura y acompañamiento técnico de equipos." },
                { title: "Comunicación", description: "Explicación clara de temas técnicos a perfiles técnicos y no técnicos." },
                { title: "Mentoría", description: "Experiencia docente y acompañamiento a ingenieros en crecimiento." }
            ]
        }
    },
    hero: {
        badge: "Open to Senior / Staff Engineer Roles",
        title: {
            line1: "STAFF SOFTWARE",
            highlight: "ENGINEER",
            subtitle: "AI SYSTEMS · DISTRIBUTED SYSTEMS · PLATFORM ENGINEERING"
        },
        description: "Construyo sistemas distribuidos y herramientas de IA que operan en producción a gran escala.",
        primaryCta: "Ver Expertise",
        secondaryCta: "Descargar CV",
        trustIndicators: ['MCP Servers · Producción', 'AI Agents & Skills', 'Mercado Libre Scale', 'Distributed Systems']
    },
    bentoGrid: {
        title: "Expertise",
        subtitle: "Áreas donde he construido experiencia real",
        cards: [
            {
                title: "MCP Servers en Producción",
                description: "Diseño y desarrollo de servidores MCP integrados con sistemas reales y usados en flujos de ingeniería.",
                icon: Cpu,
                variant: "neon",
                colSpan: "md:col-span-1",
                delay: 0.1
            },
            {
                title: "AI Agents & Skills",
                description: "Agentes autónomos, memoria persistente y automatizaciones para tareas técnicas concretas.",
                icon: Bot,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.2
            },
            {
                title: "Developer Tooling",
                description: "Herramientas internas y automatizaciones para hacer más simples los flujos de desarrollo.",
                icon: GitMerge,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.3
            },
            {
                title: "Distributed Systems",
                description: "Servicios backend de alta concurrencia y tolerancia a fallos en entornos de gran escala.",
                icon: Database,
                variant: "default",
                colSpan: "md:col-span-2",
                delay: 0.4
            },
            {
                title: "Cloud & Observability",
                description: "AWS/GCP, Kubernetes, Terraform y prácticas para operar sistemas de forma confiable.",
                icon: Shield,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.5
            }
        ]
    },
    metrics: {
        title: "Impacto",
        items: [
            { value: "10+", label: "Años de Experiencia", sublabel: "En sistemas de alta escala", icon: Shield },
            { value: "200M+", label: "Usuarios en Producción", sublabel: "Mayor plataforma tech de LatAm", icon: Users },
            { value: "15+", label: "MCPs, Agents & Skills", sublabel: "Deployados en producción", icon: Cpu },
            { value: "99.9%", label: "Disponibilidad SLA", sublabel: "Sistemas críticos en ML", icon: Zap }
        ]
    },
    experience: {
        title: "Experiencia Profesional",
        jobs: [
            {
                role: "Staff Software Engineer",
                company: "Mercado Libre / Mercado Pago",
                period: "Hace 3 años - Presente",
                description: "Arquitectura y construcción de sistemas distribuidos resilientes de alta escala y mantenimiento de ecosistemas complejos de repositorios internos. Trabajo en colaboración internacional con equipos de Brasil, Argentina y México.",
                achievements: [
                    "Diseño e implementación de sistemas resilientes y tolerantes a fallos operando a escala de 200M+ de usuarios.",
                    "Mantenimiento y optimización de múltiples repositorios internos críticos, asegurando alta disponibilidad y excelencia técnica.",
                    "Liderazgo en decisiones de arquitectura de alto impacto enfocadas en observabilidad, performance y escalabilidad inter-regional."
                ]
            },
            {
                role: "Docente Diplomado IA",
                company: "Universidad Tecnológica de Pereira (UTP)",
                period: "1er Semestre 2025",
                description: "Docencia en el diplomado de Inteligencia Artificial.",
                achievements: [
                    "Enseñanza y formación de profesionales en fundamentos y aplicaciones de Inteligencia Artificial."
                ]
            },
            {
                role: "Docente Universitario",
                company: "CIAF",
                period: "Reciente",
                description: "Docencia en programas de tecnología e ingeniería.",
                achievements: [
                    "Combinación de teoría y práctica para inspirar y capacitar a futuros profesionales en el desarrollo de software."
                ]
            },
            {
                role: "Ingeniero de Software",
                company: "Universidad Tecnológica de Pereira (UTP)",
                period: "Durante 3 años",
                description: "Desarrollo de soluciones tecnológicas y sistemas académicos institucionales.",
                achievements: [
                    "Rediseño de interfaces de usuario mejorando significativamente la interactividad y experiencia en los sistemas académicos.",
                    "Liderazgo en el desarrollo de un CRM modular para la gestión de relaciones institucionales."
                ]
            }
        ]
    }
};

const en = {
    metadata: {
        title: "Cris Alvarado | Staff Software Engineer · AI Systems",
        description: "Portfolio of Cris Alvarado, Staff Engineer specialized in MCP Servers, AI Agents, high-scale Distributed Systems, and Platform Engineering.",
    },
    navbar: {
        logoText: "CRIS ALVARADO",
        logoInitials: "CA",
        github: "https://github.com/",
        links: [
            { name: 'Expertise', href: '/#services' },
            { name: 'Impact', href: '/#advantages' },
            { name: 'About', href: '/about' },
            { name: 'Contact', href: 'https://www.linkedin.com/in/crisalvarado-ingeniero/' }
        ],
        ctaText: "Connect"
    },
    about: {
        title: "About Me",
        role: "Staff Software Engineer · Distributed Systems · Production AI",
        description: "10+ years building software for high-scale environments, with recent experience in distributed systems and AI tooling shipped to production.",
        background: "I'm a Staff Software Engineer at Mercado Libre, where I work on systems serving more than 200 million users in production. My experience centers on backend engineering, distributed systems, and AI tooling for engineers: I have built production MCP servers, autonomous agents with persistent memory, and Claude Code Skills that automate technical workflows. I also teach at the university level, which strengthens my ability to explain complex decisions, support other engineers, and work across teams with different levels of technical depth.",
        skills: {
            technical: [
                { title: "Production AI Systems", description: "MCP servers, agents, and AI automations integrated into real engineering workflows." },
                { title: "Distributed Systems", description: "Backend services designed for high concurrency, resilience, and large-scale operation." },
                { title: "Developer Tooling", description: "Skills, automations, and tools that reduce friction in technical workflows." },
                { title: "Cloud & Platform", description: "AWS/GCP, Kubernetes, Terraform, and infrastructure built for reliable operation." },
                { title: "Backend", description: "Go, Python, and TypeScript across services, automation, and modern APIs." },
                { title: "Observability", description: "Distributed monitoring, tracing, and SLO/SLA definition." }
            ],
            soft: [
                { title: "Technical Leadership", description: "Contributing to architecture decisions and supporting teams through technical guidance." },
                { title: "Communication", description: "Explaining technical topics clearly to both technical and non-technical audiences." },
                { title: "Mentoring", description: "Teaching experience and support for engineers in growth." }
            ]
        }
    },
    hero: {
        badge: "Open to Senior / Staff Engineer Roles",
        title: {
            line1: "STAFF SOFTWARE",
            highlight: "ENGINEER",
            subtitle: "AI SYSTEMS · DISTRIBUTED SYSTEMS · PLATFORM ENGINEERING"
        },
        description: "Building distributed systems and AI tooling that operate in production at large scale.",
        primaryCta: "View Expertise",
        secondaryCta: "Download CV",
        trustIndicators: ['MCP Servers · Production', 'AI Agents & Skills', 'Mercado Libre Scale', 'Distributed Systems']
    },
    bentoGrid: {
        title: "Expertise",
        subtitle: "Areas where I have built real experience",
        cards: [
            {
                title: "MCP Servers in Production",
                description: "Design and development of MCP servers integrated with real systems and used in engineering workflows.",
                icon: Cpu,
                variant: "neon",
                colSpan: "md:col-span-1",
                delay: 0.1
            },
            {
                title: "AI Agents & Skills",
                description: "Autonomous agents, persistent memory, and automations for concrete technical tasks.",
                icon: Bot,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.2
            },
            {
                title: "Developer Tooling",
                description: "Internal tools and automations that simplify engineering workflows.",
                icon: GitMerge,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.3
            },
            {
                title: "Distributed Systems",
                description: "High-concurrency, fault-tolerant backend services in large-scale environments.",
                icon: Database,
                variant: "default",
                colSpan: "md:col-span-2",
                delay: 0.4
            },
            {
                title: "Cloud & Observability",
                description: "AWS/GCP, Kubernetes, Terraform, and practices for reliable system operation.",
                icon: Shield,
                variant: "default",
                colSpan: "md:col-span-1",
                delay: 0.5
            }
        ]
    },
    metrics: {
        title: "Impact",
        items: [
            { value: "10+", label: "Years of Experience", sublabel: "High-scale systems", icon: Shield },
            { value: "200M+", label: "Users in Production", sublabel: "Largest tech platform in LatAm", icon: Users },
            { value: "15+", label: "MCPs, Agents & Skills", sublabel: "Deployed in production", icon: Cpu },
            { value: "99.9%", label: "Availability SLA", sublabel: "Critical ML systems", icon: Zap }
        ]
    },
    experience: {
        title: "Professional Experience",
        jobs: [
            {
                role: "Staff Software Engineer",
                company: "Mercado Libre / Mercado Pago",
                period: "3 years - Present",
                description: "Architecture and development of high-scale resilient distributed systems and maintenance of complex internal repository ecosystems. Collaborative work with international teams from Brazil, Argentina, and Mexico.",
                achievements: [
                    "Designed and implemented fault-tolerant, resilient systems operating at a 200M+ user scale.",
                    "Maintained and optimized multiple critical internal repositories, ensuring high availability and technical excellence.",
                    "Led high-impact architectural decisions focused on cross-regional observability, performance, and scalability."
                ]
            },
            {
                role: "AI Diploma Professor",
                company: "Universidad Tecnológica de Pereira (UTP)",
                period: "1st Semester 2025",
                description: "Teaching the Artificial Intelligence diploma program.",
                achievements: [
                    "Taught and mentored professionals on the fundamentals and applied usage of Artificial Intelligence."
                ]
            },
            {
                role: "University Professor",
                company: "CIAF",
                period: "Recent",
                description: "Teaching technology and software engineering programs.",
                achievements: [
                    "Combined theory and practice to inspire and train future software development professionals."
                ]
            },
            {
                role: "Software Engineer",
                company: "Universidad Tecnológica de Pereira (UTP)",
                period: "For 3 years",
                description: "Development of technological solutions and institutional academic systems.",
                achievements: [
                    "Redesigned user interfaces, significantly improving interactivity and user experience in academic systems.",
                    "Led the development of a modular CRM for institutional relationship management."
                ]
            }
        ]
    }
};

export const siteData = { es, en };

// Fallback for non-React server rendering
export const siteConfig = es;

export function useSiteConfig() {
    const [config, setConfig] = useState(es);
    const [lang, setLang] = useState('es');

    useEffect(() => {
        const storedLang = localStorage.getItem('lang') || 'es';
        setLang(storedLang);
        setConfig(siteData[storedLang as 'es' | 'en']);
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'es' ? 'en' : 'es';
        localStorage.setItem('lang', newLang);
        setLang(newLang);
        setConfig(siteData[newLang as 'es' | 'en']);
        window.dispatchEvent(new Event('languageChange'));
    };

    useEffect(() => {
        const handleLangChange = () => {
            const storedLang = localStorage.getItem('lang') || 'es';
            setLang(storedLang);
            setConfig(siteData[storedLang as 'es' | 'en']);
        };
        window.addEventListener('languageChange', handleLangChange);
        return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);

    return { config, lang, toggleLanguage };
}
