// Local retrieval engine for the profile assistant. No network and no language model:
// it classifies the question, retrieves topics from a small knowledge graph, keeps
// conversational memory (follow-ups, repeats) and composes a reply. Every statement
// comes from the published portfolio content; anything else is answered as unknown.

export type Lang = 'es' | 'en';
type Text = Record<Lang, string>;
export type Source = { href: string; label: Text };
type Topic = {
    id: string;
    label: Text;
    ask: Text;
    keywords: string[];
    answer: Text;
    more?: Text;
    source?: Source;
    next: string[];
};
export type Memory = { last: string[]; seen: Record<string, number>; turns: number };
export type Reply = {
    kind: 'answer' | 'smalltalk' | 'fallback';
    lang: Lang;
    text: string;
    topics: { id: string; label: string }[];
    sources: { href: string; label: string }[];
    suggestions: string[];
};

export const emptyMemory = (): Memory => ({ last: [], seen: {}, turns: 0 });

const LINKEDIN = 'https://www.linkedin.com/in/crisalvarado-ingeniero/';
const src = {
    experience: { href: '/#experience', label: { es: 'Experiencia', en: 'Experience' } },
    work: { href: '/#work', label: { es: 'Trabajo seleccionado', en: 'Selected work' } },
    about: { href: '/about/', label: { es: 'Perfil técnico', en: 'Technical background' } },
    onboarding: { href: '/about/#user-onboarding', label: { es: 'Caso: altas de usuarios', en: 'Case: user onboarding' } },
    web: { href: '/about/#developer-experiences', label: { es: 'Caso: experiencias web', en: 'Case: web experiences' } },
    nexo: { href: '/work/nexo/', label: { es: 'Caso Nexo', en: 'Nexo case study' } },
    education: { href: '/about/#education', label: { es: 'Formación y docencia', en: 'Education & teaching' } },
    contact: { href: '/#contact', label: { es: 'Contacto', en: 'Contact' } },
    lab: { href: '/lab/', label: { es: 'Laboratorio creativo', en: 'Creative lab' } },
} satisfies Record<string, Source>;

export const topics: Topic[] = [
    {
        id: 'positioning',
        label: { es: 'perfil', en: 'profile' },
        ask: { es: '¿Quién es Cris?', en: 'Who is Cris?' },
        keywords: ['perfil', 'resumen', 'quien es', 'who is', 'about', 'summary', 'rol', 'role', 'cargo', 'title', 'puesto', 'position', 'senior', 'staff', 'dedica', 'hace', 'does he do', 'presentate', 'introduce', 'overview'],
        answer: {
            es: 'Cristian Alvarado es Software Engineer en Mercado Libre. Construye agentes de IA, integraciones MCP, herramientas para desarrolladores y software backend y de producto para Mercado Pago. También es docente de Machine Learning y Deep Learning en la UTP.',
            en: 'Cristian Alvarado is a Software Engineer at Mercado Libre. He builds AI agents, MCP integrations, developer tools, and backend and product software for Mercado Pago. He also teaches Machine Learning and Deep Learning at UTP.',
        },
        more: {
            es: 'Su cargo formal es Software Engineer. Antes fue ingeniero de software en la UTP (2020–2023) y docente en CIAF (2023). Está en Pereira, Colombia.',
            en: 'His formal role is Software Engineer. Before that he was a software engineer at UTP (2020–2023) and an instructor at CIAF (2023). He is based in Pereira, Colombia.',
        },
        source: src.about,
        next: ['agents', 'experience', 'differentiator'],
    },
    {
        id: 'agents',
        label: { es: 'IA aplicada', en: 'applied AI' },
        ask: { es: '¿Qué hace con agentes de IA y MCP?', en: 'What does he build with AI agents and MCP?' },
        keywords: ['mcp', 'agentes', 'agents', 'agent', 'agente', 'skills', 'ai tooling', 'ia', 'ai', 'inteligencia artificial', 'artificial intelligence', 'llm', 'llms', 'foco', 'focus', 'enfoque', 'developer tools', 'herramientas para desarrolladores', 'tooling', 'productividad', 'productivity'],
        answer: {
            es: 'Su foco técnico es IA aplicada a flujos de ingeniería: construye agentes de IA, servidores MCP, skills reutilizables y automatizaciones integradas con las herramientas y servicios que los equipos ya usan en Mercado Pago.',
            en: 'His technical focus is AI applied to engineering workflows: he builds AI agents, MCP servers, reusable skills and automation integrated with the tools and services teams already use at Mercado Pago.',
        },
        more: {
            es: 'La idea es que la automatización corra dentro del flujo de trabajo y no al lado: conectar herramientas y servicios a tareas técnicas y automatizar procesos repetitivos. El detalle interno de esos sistemas no es público.',
            en: 'The idea is for automation to run inside the workflow rather than beside it: connecting tools and services to technical tasks and automating repetitive processes. The internals of those systems are not public.',
        },
        source: src.work,
        next: ['automation', 'stack', 'nexo'],
    },
    {
        id: 'automation',
        label: { es: 'automatización', en: 'automation' },
        ask: { es: '¿Qué automatizó con Jira y Slack?', en: 'What did he automate with Jira and Slack?' },
        keywords: ['jira', 'slack', 'automatizacion', 'automation', 'automatizo', 'automated', 'provisioning', 'onboarding', 'altas', 'usuarios internos', 'internal users', 'integraciones', 'integrations', 'workflow', 'flujo'],
        answer: {
            es: 'Creó una automatización que conecta tres sistemas: las solicitudes en Jira, la comunicación en Slack y las altas de usuarios en aplicaciones internas, para usuarios de Latinoamérica.',
            en: 'He created an automation connecting three systems: Jira requests, Slack communication and user onboarding into internal applications, for users across Latin America.',
        },
        more: {
            es: 'El problema: dar de alta usuarios específicos exigía coordinar solicitudes, comunicación y acceso. El resultado: una solicitud abierta en Jira llega hasta Slack y el alta en la aplicación interna como un solo flujo automatizado.',
            en: 'The problem: onboarding specific users meant coordinating requests, communication and access. The result: a request opened in Jira carries through to Slack and access in the internal application as one automated flow.',
        },
        source: src.onboarding,
        next: ['agents', 'fintech', 'problems'],
    },
    {
        id: 'product',
        label: { es: 'ingeniería de producto', en: 'product engineering' },
        ask: { es: '¿Cómo colabora con producto?', en: 'How does he work with product?' },
        keywords: ['frontend', 'front end', 'front-end', 'developers', 'landing', 'landings', 'producto', 'product', 'colabora', 'collaboration', 'collaborates', 'colaboracion', 'web', 'interfaces', 'ui', 'backend', 'back end', 'servicios', 'services'],
        answer: {
            es: 'Trabaja como parte de un equipo de producto: desarrolla servicios backend en Go, Node.js y Java e interfaces en React y TypeScript, y colaboró en las landing pages y los sitios de Developers de Mercado Pago.',
            en: 'He works as part of a product team: he develops backend services in Go, Node.js and Java and interfaces in React and TypeScript, and collaborated on Mercado Pago landing pages and Developers sites.',
        },
        more: {
            es: 'En ese caso el aporte fue de implementación web dentro del trabajo del equipo; el portafolio lo presenta como entrega colaborativa, no como autoría individual.',
            en: 'In that case his contribution was web implementation within the team’s work; the portfolio presents it as collaborative delivery, not individual authorship.',
        },
        source: src.web,
        next: ['stack', 'fintech', 'teams'],
    },
    {
        id: 'stack',
        label: { es: 'stack', en: 'stack' },
        ask: { es: '¿Cuál es su stack principal?', en: 'What is his main stack?' },
        keywords: ['stack', 'tecnologias', 'technologies', 'tech', 'lenguajes', 'languages he', 'programming', 'programacion', 'herramientas', 'tools', 'cloud', 'nube', 'devops', 'infraestructura', 'infrastructure', 'bases de datos', 'databases', 'habilidades', 'conocimientos'],
        answer: {
            es: 'Backend: Go, Node.js, Java y Python. Interfaces: TypeScript y React. IA aplicada: agentes, MCP y skills reutilizables. Entrega y operación: CI/CD, AWS/GCP, Kubernetes, Terraform y observabilidad, además de bases de datos.',
            en: 'Backend: Go, Node.js, Java and Python. Interfaces: TypeScript and React. Applied AI: agents, MCP and reusable skills. Delivery and operations: CI/CD, AWS/GCP, Kubernetes, Terraform and observability, plus databases.',
        },
        more: {
            es: 'En Nexo, su proyecto propio, usó JavaScript con Three.js, notebooks de Python en Colab y Cloudflare D1 (SQLite) detrás de una API autenticada.',
            en: 'In Nexo, his own project, he used JavaScript with Three.js, Python notebooks in Colab and Cloudflare D1 (SQLite) behind an authenticated API.',
        },
        source: src.about,
        next: ['agents', 'nexo', 'product'],
    },
    {
        id: 'fintech',
        label: { es: 'fintech', en: 'fintech' },
        ask: { es: '¿Qué experiencia tiene en fintech?', en: 'What fintech experience does he have?' },
        keywords: ['fintech', 'mercado pago', 'mercadopago', 'mercado libre', 'mercadolibre', 'meli', 'pagos', 'payments', 'banca', 'banking', 'escala', 'scale', 'usuarios activos'],
        answer: {
            es: 'Desde diciembre de 2023 desarrolla software, herramientas de IA y automatizaciones para Mercado Pago, la fintech de Mercado Libre, en seis mercados: Brasil, México, Argentina, Colombia, Chile y Perú.',
            en: 'Since December 2023 he has built software, AI tooling and automation for Mercado Pago, Mercado Libre’s fintech, across six markets: Brazil, Mexico, Argentina, Colombia, Chile and Peru.',
        },
        more: {
            es: 'Como contexto de escala, Mercado Libre reportó 93 millones de usuarios activos mensuales en Mercado Pago para el Q3 de 2026. Es una cifra de la compañía, no una métrica personal de Cris.',
            en: 'For scale, Mercado Libre reported 93 million monthly active users on Mercado Pago for Q3 2026. That is a company figure, not a personal metric of his.',
        },
        source: src.experience,
        next: ['agents', 'automation', 'teams'],
    },
    {
        id: 'teams',
        label: { es: 'equipos distribuidos', en: 'distributed teams' },
        ask: { es: '¿Cómo trabaja en equipos distribuidos?', en: 'How does he work in distributed teams?' },
        keywords: ['equipos', 'teams', 'team', 'equipo', 'distribuidos', 'distributed', 'regional', 'latam', 'latinoamerica', 'latin america', 'paises', 'countries', 'mercados', 'markets'],
        answer: {
            es: 'Trabaja en remoto desde Colombia en un entorno regional: contribuye a soluciones para Brasil, México, Argentina, Colombia, Chile y Perú, y conecta requisitos de producto con confiabilidad, mantenibilidad y restricciones de operación.',
            en: 'He works remotely from Colombia in a regional environment: he contributes to solutions for Brazil, Mexico, Argentina, Colombia, Chile and Peru, connecting product requirements with reliability, maintainability and operating constraints.',
        },
        source: src.about,
        next: ['work_style', 'location', 'fintech'],
    },
    {
        id: 'nexo',
        label: { es: 'Nexo', en: 'Nexo' },
        ask: { es: '¿Qué es Nexo y cómo está construido?', en: 'What is Nexo and how is it built?' },
        keywords: ['nexo', 'arquitectura', 'architecture', 'proyecto', 'project', 'proyectos', 'projects', 'side project', 'confiabilidad', 'reliability', 'concurrencia', 'concurrency', 'resiliencia', 'persistencia', 'persistence', 'offline', 'sincronizacion', 'sync', 'd1', 'sqlite', 'three.js', 'threejs', 'colab'],
        answer: {
            es: 'Nexo es la herramienta que creó para sus clases de ML: une explicaciones interactivas, práctica en notebooks y progreso individual. Tiene una interfaz en JavaScript con Three.js, notebooks de Python en Colab y una API autenticada sobre Cloudflare D1 (SQLite).',
            en: 'Nexo is the tool he created for his ML classes: it joins interactive explanations, notebook practice and individual progress. It has a JavaScript interface with Three.js, Python notebooks in Colab and an authenticated API on Cloudflare D1 (SQLite).',
        },
        more: {
            es: 'Decisiones clave: la identidad y los roles se validan en el servidor, nunca desde el navegador; los cambios locales pendientes se conservan y se reintentan cuando vuelve la conexión. Límite declarado: los guardados son instantáneas, así que no hay fusión automática de ediciones simultáneas desde varios dispositivos.',
            en: 'Key decisions: identity and roles are checked on the server, never from the browser; pending local changes are kept and retried when connectivity returns. Stated limit: saves are snapshots, so there is no automatic merging of simultaneous edits from several devices.',
        },
        source: src.nexo,
        next: ['teaching', 'stack', 'contact'],
    },
    {
        id: 'teaching',
        label: { es: 'docencia', en: 'teaching' },
        ask: { es: '¿Qué enseña en la UTP?', en: 'What does he teach at UTP?' },
        keywords: ['utp', 'teacher', 'teaching', 'teaches', 'profesor', 'docente', 'docencia', 'ensena', 'clases', 'classes', 'ml', 'deep learning', 'machine learning', 'diplomado', 'diploma', 'instructor', 'ciaf', 'universidad', 'university'],
        answer: {
            es: 'Enseña los módulos de Machine Learning y Deep Learning del Diplomado en Ciencia de Datos de la UTP: lo hizo en 2025 y de nuevo desde septiembre de 2026. En 2023 fue docente de ingeniería de software y conferencista en CIAF.',
            en: 'He teaches the Machine Learning and Deep Learning modules of UTP’s Data Science diploma: in 2025 and again from September 2026. In 2023 he was a software engineering instructor and speaker at CIAF.',
        },
        more: {
            es: 'Cubre regresión, clasificación, clustering, reducción de dimensionalidad y visión por computador con ejemplos prácticos. Dicta las clases sobre Nexo: cada tema va de una explicación interactiva a un notebook en Colab que cada estudiante resuelve en su propia copia.',
            en: 'He covers regression, classification, clustering, dimensionality reduction and computer vision with practical examples. He runs the classes on Nexo: each topic moves from an interactive explanation to a Colab notebook that students complete on their own copy.',
        },
        source: src.education,
        next: ['nexo', 'education', 'work_style'],
    },
    {
        id: 'education',
        label: { es: 'formación', en: 'education' },
        ask: { es: '¿Qué estudió?', en: 'What did he study?' },
        keywords: ['estudio', 'estudios', 'studied', 'study', 'degree', 'grado', 'titulo', 'carrera', 'graduado', 'graduated', 'formacion', 'education', 'educacion', 'ingeniero de software'],
        answer: {
            es: 'Es Ingeniero de Software de CIAF Educación Superior, graduado el 14 de diciembre de 2022.',
            en: 'He holds a Software Engineering degree from CIAF Educación Superior, awarded on December 14, 2022.',
        },
        source: src.education,
        next: ['teaching', 'experience'],
    },
    {
        id: 'experience',
        label: { es: 'trayectoria', en: 'career' },
        ask: { es: '¿Cuál es su trayectoria?', en: 'What is his career path?' },
        keywords: ['experiencia', 'experience', 'trayectoria', 'career', 'carrera profesional', 'historial', 'history', 'trabajos', 'jobs', 'anos', 'years', 'antes', 'before', 'previous', 'anterior', 'crm', 'cuanto tiempo', 'how long'],
        answer: {
            es: 'Software Engineer en Mercado Libre / Mercado Pago (dic 2023 – hoy). Docente de ML y Deep Learning en la UTP (2025 y desde sep 2026). Docente y conferencista en CIAF (2023). Software Engineer en la UTP (sep 2020 – oct 2023).',
            en: 'Software Engineer at Mercado Libre / Mercado Pago (Dec 2023 – present). ML and Deep Learning instructor at UTP (2025 and since Sep 2026). Instructor and speaker at CIAF (2023). Software Engineer at UTP (Sep 2020 – Oct 2023).',
        },
        more: {
            es: 'En la UTP rediseñó interfaces de aplicaciones académicas y lideró el desarrollo de un CRM modular para gestionar relaciones institucionales.',
            en: 'At UTP he redesigned interfaces for academic applications and led development of a modular CRM for institutional relationship management.',
        },
        source: src.experience,
        next: ['fintech', 'teaching', 'stack'],
    },
    {
        id: 'work_style',
        label: { es: 'forma de trabajo', en: 'working style' },
        ask: { es: '¿Cómo lidera técnicamente?', en: 'How does he lead technically?' },
        keywords: ['liderazgo', 'leadership', 'lidera', 'lead', 'leads', 'lider', 'leader', 'ownership', 'como trabaja', 'how does he work', 'working style', 'estilo', 'comunicacion', 'communication', 'soft skills', 'blandas', 'mentor', 'mentoria', 'manager', 'gerente', 'jefe', 'tech lead'],
        answer: {
            es: 'Su cargo formal es Software Engineer. El liderazgo que muestra el perfil es técnico: lideró el desarrollo de un CRM modular en la UTP, diseña arquitectura con contexto de producto y operación, y usa la docencia para volver inspeccionables conceptos complejos.',
            en: 'His formal role is Software Engineer. The leadership the profile shows is technical: he led development of a modular CRM at UTP, designs architecture with product and operating context, and uses teaching to make complex concepts inspectable.',
        },
        source: src.about,
        next: ['teams', 'problems', 'differentiator'],
    },
    {
        id: 'problems',
        label: { es: 'tipo de problemas', en: 'kind of problems' },
        ask: { es: '¿En qué tipo de problemas trabaja?', en: 'What kind of problems does he work on?' },
        keywords: ['problemas', 'problems', 'retos', 'challenges', 'desafios', 'intereses', 'interests', 'busca', 'looking for', 'le gusta', 'likes', 'motiva'],
        answer: {
            es: 'Trabaja en problemas de conexión: integrar IA en las herramientas que un equipo ya usa, automatizar flujos que cruzan varios sistemas (Jira, Slack, aplicaciones internas) y convertir conceptos de ML en algo que se puede manipular y ejecutar, como en Nexo.',
            en: 'He works on connection problems: integrating AI into the tools a team already uses, automating flows that cross several systems (Jira, Slack, internal applications) and turning ML concepts into something you can manipulate and run, as in Nexo.',
        },
        source: src.work,
        next: ['agents', 'automation', 'nexo'],
    },
    {
        id: 'differentiator',
        label: { es: 'diferencial', en: 'differentiator' },
        ask: { es: '¿Qué lo diferencia?', en: 'What makes him different?' },
        keywords: ['diferencia', 'diferencial', 'different', 'differentiator', 'unico', 'unique', 'destaca', 'stands out', 'fortalezas', 'strengths', 'por que contratar', 'why hire', 'valor', 'value'],
        answer: {
            es: 'La combinación: IA aplicada a flujos reales de ingeniería (agentes y MCP), ingeniería de producto en una fintech regional y docencia de ML y Deep Learning, para la que construyó su propia herramienta, Nexo. Explica lo que construye y documenta también sus límites.',
            en: 'The combination: AI applied to real engineering workflows (agents and MCP), product engineering at a regional fintech, and ML and Deep Learning teaching, for which he built his own tool, Nexo. He explains what he builds and documents its limits too.',
        },
        source: src.about,
        next: ['agents', 'nexo', 'contact'],
    },
    {
        id: 'location',
        label: { es: 'ubicación e idiomas', en: 'location & languages' },
        ask: { es: '¿Dónde está y qué idiomas habla?', en: 'Where is he based and which languages does he speak?' },
        keywords: ['remote', 'remoto', 'location', 'ubicacion', 'donde', 'where', 'vive', 'based', 'pereira', 'colombia', 'ingles', 'english', 'idiomas', 'spanish', 'espanol', 'habla', 'speaks', 'zona horaria', 'timezone', 'relocation', 'reubicacion'],
        answer: {
            es: 'Está en Pereira, Colombia, y trabaja en remoto desde Colombia. Habla español y tiene inglés B2.',
            en: 'He is based in Pereira, Colombia, and works remotely from Colombia. He speaks Spanish and has B2 English.',
        },
        source: src.contact,
        next: ['contact', 'teams'],
    },
    {
        id: 'contact',
        label: { es: 'contacto', en: 'contact' },
        ask: { es: '¿Cómo lo contacto?', en: 'How can I contact him?' },
        keywords: ['contacto', 'contact', 'contactar', 'contacto', 'linkedin', 'github', 'cv', 'resume', 'hoja de vida', 'curriculum', 'demo', 'email', 'correo', 'escribirle', 'reach', 'hablar con', 'talk to', 'agendar', 'reunion', 'meeting'],
        answer: {
            es: `La vía directa es LinkedIn: ${LINKEDIN} — desde la sección de contacto también puedes descargar el CV y ver su GitHub. Nexo se muestra en demostración guiada, pidiéndola por ahí.`,
            en: `The direct route is LinkedIn: ${LINKEDIN} — from the contact section you can also download the résumé and see his GitHub. Nexo is shown as a guided demonstration on request.`,
        },
        source: src.contact,
        next: ['positioning', 'nexo'],
    },
    {
        id: 'game',
        label: { es: 'Skills Invaders', en: 'Skills Invaders' },
        ask: { es: '¿Qué es Skills Invaders?', en: 'What is Skills Invaders?' },
        keywords: ['juego', 'game', 'invaders', 'skills invaders', 'jugar', 'play', 'lab', 'laboratorio', 'creativo', 'creative', 'canvas'],
        answer: {
            es: 'Skills Invaders es un experimento de creative coding: un juego de navegador que explora interacciones en canvas y animación. Está en el home y en el laboratorio; el perfil técnico se puede leer completo sin jugar.',
            en: 'Skills Invaders is a creative coding experiment: a browser game exploring canvas interactions and animation. It lives on the home page and in the lab; the technical profile is fully readable without playing.',
        },
        source: src.lab,
        next: ['stack', 'nexo'],
    },
];

const byId = new Map(topics.map((t) => [t.id, t]));

// Technologies named in the published profile, mapped to the topic that supports them.
const knownTech: Record<string, [string, string]> = {
    go: ['Go', 'stack'], golang: ['Go', 'stack'], node: ['Node.js', 'stack'], nodejs: ['Node.js', 'stack'], 'node.js': ['Node.js', 'stack'],
    java: ['Java', 'stack'], python: ['Python', 'stack'], typescript: ['TypeScript', 'stack'], ts: ['TypeScript', 'stack'],
    javascript: ['JavaScript', 'nexo'], js: ['JavaScript', 'nexo'], react: ['React', 'stack'], 'three.js': ['Three.js', 'nexo'], threejs: ['Three.js', 'nexo'],
    sqlite: ['SQLite', 'nexo'], d1: ['Cloudflare D1', 'nexo'], cloudflare: ['Cloudflare D1', 'nexo'], sql: ['SQL (D1 / SQLite)', 'nexo'],
    aws: ['AWS', 'stack'], gcp: ['GCP', 'stack'], kubernetes: ['Kubernetes', 'stack'], k8s: ['Kubernetes', 'stack'], terraform: ['Terraform', 'stack'],
    'ci/cd': ['CI/CD', 'stack'], cicd: ['CI/CD', 'stack'], mcp: ['MCP', 'agents'], colab: ['Google Colab', 'nexo'], jira: ['Jira', 'automation'], slack: ['Slack', 'automation'],
};
const unknownTech = ['rust', 'php', 'c#', 'csharp', '.net', 'dotnet', 'angular', 'vue', 'svelte', 'ruby', 'rails', 'kotlin', 'swift', 'flutter', 'dart', 'django', 'flask', 'fastapi', 'laravel', 'spring', 'docker', 'azure', 'mongodb', 'mongo', 'postgres', 'postgresql', 'mysql', 'redis', 'kafka', 'rabbitmq', 'graphql', 'grpc', 'pytorch', 'tensorflow', 'keras', 'scikit', 'pandas', 'langchain', 'openai', 'claude', 'gemini', 'elixir', 'scala', 'c++', 'cobol', 'solidity', 'blockchain', 'unity', 'android', 'ios', 'nextjs', 'next.js', 'astro', 'tailwind', 'wordpress', 'salesforce', 'sap', 'snowflake', 'spark', 'airflow', 'linux', 'bash'];

const stop = new Set('a al algo and are as at be but by con cual cuales cuando de del do does el ella en es esa ese eso esta este esto for from ha has have he her him his how i if in is it la las le lo los me mi my no o of on or para pero por que se si sin su sus te that the their them this to tu un una uno y you your what which who why with como donde quien cris cristian alvarado el'.split(' '));
const esHints = new Set('que como cual cuales donde quien cuando por para con una uno los las del sus tiene hace sabe usa trabaja esta es y de el la en su mas eso hola gracias cuentame dime'.split(' '));
const enHints = new Set('what how which where who when why does did is are has have the his he with and of in about more tell hello hi thanks can'.split(' '));

export function normalize(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!,;:()"“”]/g, ' ').replace(/\s+/g, ' ').trim();
}
const tokenize = (q: string) => q.split(' ').map((t) => t.replace(/^\.+|\.+$/g, '')).filter(Boolean);
function stem(t: string) {
    if (t.length > 5 && t.endsWith('es')) return t.slice(0, -2);
    if (t.length > 4 && t.endsWith('s')) return t.slice(0, -1);
    return t;
}
function distance(a: string, b: string, max: number) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const row = [i];
        for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = row;
    }
    return prev[b.length];
}
function detectLang(tokens: string[], pageLang: Lang): Lang {
    let es = 0, en = 0;
    for (const t of tokens) { if (esHints.has(t)) es++; if (enHints.has(t)) en++; }
    return es === en ? pageLang : es > en ? 'es' : 'en';
}

const weak = new Set(['experiencia', 'experience', 'hace', 'proyecto', 'project', 'proyectos', 'projects', 'web', 'tech', 'herramientas', 'tools', 'producto', 'product', 'equipo', 'team', 'flujo', 'workflow', 'servicios', 'services', 'valor', 'value', 'habla', 'antes', 'before']);
function score(q: string, tokens: string[], topic: Topic) {
    let total = 0;
    const content = tokens.filter((t) => !stop.has(t));
    for (const raw of topic.keywords) {
        const k = normalize(raw);
        if (k.includes(' ')) { if (q.includes(k)) total += 4 + k.length / 4; continue; }
        for (const t of content) {
            if (t === k || stem(t) === stem(k)) total += k.length <= 2 || weak.has(k) ? 3 : 5;
            else if (k.length >= 5 && t.length >= 5 && distance(t, k, k.length >= 8 ? 2 : 1) <= (k.length >= 8 ? 2 : 1)) total += 2.5;
            else if (k.length >= 6 && t.length >= 6 && (t.startsWith(k.slice(0, 6)) || k.startsWith(t.slice(0, 6)))) total += 2;
        }
    }
    return total;
}

const re = {
    greet: /^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|hi|hello|que tal|saludos|good morning|good afternoon)\b/,
    thanks: /\b(gracias|thanks|thank you|genial|perfecto|great|awesome|excelente|ok gracias|vale gracias)\b/,
    bye: /^(adios|chao|bye|hasta luego|nos vemos|see you|goodbye)\b/,
    meta: /\b(eres (una |un )?(ia|ai|bot|robot|humano|persona|real|llm|chatgpt|gpt|claude)|are you (an? )?(ai|bot|robot|human|real|llm|person|chatgpt|gpt|claude)|quien eres|who are you|como funcionas|how do you work|que modelo|which model|what model|que eres|what are you|usas (un )?(llm|gpt|ia)|do you use (an? )?(llm|gpt|ai))\b/,
    help: /\b(ayuda|help|que puedes|what can you|que sabes|what do you know|opciones|options|temas|topics|que te puedo preguntar|what can i ask)\b/,
    more: /^(y eso|y\b.*\bmas|mas|cuentame mas|dime mas|amplia|profundiza|detalla|detalles|sigue|continua|ejemplo|un ejemplo|por que|como asi|a que te refieres|explica|explicame|more|tell me more|go on|continue|elaborate|details|example|an example|why|how so|what do you mean|explain)\b|\b(mas detalle|mas sobre eso|more about that|more detail|sobre eso|about that)\b/,
    hiring: /\b(salario|sueldo|salary|compensation|compensacion|cuanto (gana|cobra)|rate|tarifa|disponible|disponibilidad|available|availability|open to work|busca trabajo|looking for (a )?job|contratar|hire|hiring|vacante|oferta|offer|notice period|preaviso|visa|freelance)\b/,
    personal: /\b(edad|age|how old|cuantos anos tiene|casado|married|esposa|wife|novia|girlfriend|hijos|kids|children|familia|family|religion|politica|politics|telefono|phone|direccion|address|whatsapp)\b/,
    yesno: /^(sabe|conoce|usa|maneja|domina|tiene experiencia|trabaja con|ha trabajado con|ha usado|programa en|does he|has he|is he|can he|did he)\b/,
    techQ: /\b(sabe|conoce|usa|maneja|domina|experiencia (con|en)|trabaja con|ha trabajado con|ha usado|programa en|know|knows|use|uses|used|work with|worked with|experience (with|in)|familiar with)\b/,
};

const say = {
    greet: { es: 'Hola. Soy el asistente del perfil de Cris: pregúntame por su trabajo con agentes de IA y MCP, su experiencia en Mercado Pago, Nexo, su stack o cómo contactarlo.', en: 'Hi. I’m the assistant for Cris’ profile: ask me about his work with AI agents and MCP, his experience at Mercado Pago, Nexo, his stack or how to reach him.' },
    thanks: { es: 'Con gusto. Si quieres seguir, puedo contarte más de cualquiera de estos temas.', en: 'You’re welcome. If you want to keep going, I can tell you more about any of these.' },
    bye: { es: 'Hasta luego. Si quieres hablar con Cris directamente, LinkedIn es la vía.', en: 'See you. If you want to talk to Cris directly, LinkedIn is the way.' },
    meta: { es: 'Soy un asistente local, no un modelo de lenguaje: no hay servidor ni LLM detrás. Todo corre en tu navegador: clasifico tu pregunta, recupero los temas relevantes de un pequeño grafo de conocimiento con el contenido publicado en este portafolio y compongo la respuesta, recordando de qué veníamos hablando. Si algo no está en el perfil, te lo digo en vez de inventarlo.', en: 'I’m a local assistant, not a language model: there is no server or LLM behind me. Everything runs in your browser: I classify your question, retrieve the relevant topics from a small knowledge graph built from this portfolio’s published content and compose the reply, remembering what we were talking about. If something is not in the profile, I say so instead of making it up.' },
    help: { es: 'Puedo responder sobre lo que está publicado en el portafolio: IA aplicada y MCP, automatización con Jira y Slack, ingeniería de producto en Mercado Pago, Nexo y su arquitectura, docencia, stack, trayectoria, ubicación e idiomas, y contacto. También entiendo preguntas de seguimiento como “cuéntame más” o “¿sabe Go?”.', en: 'I can answer about what is published in the portfolio: applied AI and MCP, automation with Jira and Slack, product engineering at Mercado Pago, Nexo and its architecture, teaching, stack, career, location and languages, and contact. I also understand follow-ups like “tell me more” or “does he know Go?”.' },
    hiring: { es: `Eso no está en el perfil publicado (disponibilidad, condiciones o compensación), y prefiero no suponerlo. Lo responde Cris directamente por LinkedIn: ${LINKEDIN}`, en: `That is not in the published profile (availability, terms or compensation), and I’d rather not guess. Cris answers that directly on LinkedIn: ${LINKEDIN}` },
    personal: { es: 'Solo tengo información profesional publicada en el portafolio; los datos personales no hacen parte de él.', en: 'I only have the professional information published in the portfolio; personal details are not part of it.' },
    noMore: { es: 'No veníamos hablando de un tema concreto. ¿Sobre qué quieres que profundice?', en: 'We weren’t on a specific topic yet. What would you like me to go deeper on?' },
    fallback: { es: 'Eso no aparece en el perfil publicado, así que no puedo responderlo con certeza. Para algo tan específico, lo mejor es preguntarle a Cris por LinkedIn. Mientras tanto, sí puedo ayudarte con esto:', en: 'That is not in the published profile, so I can’t answer it reliably. For something that specific, it’s best to ask Cris on LinkedIn. Meanwhile, I can help with these:' },
    exhausted: { es: (l: string) => `Eso es todo lo que el perfil publica sobre ${l}. El detalle completo está en la sección enlazada abajo.`, en: (l: string) => `That is everything the profile publishes about ${l}. The full detail is in the section linked below.` },
    recap: { es: 'Como te comentaba: ', en: 'As I mentioned: ' },
    techYes: { es: (t: string) => `Sí, ${t} aparece en su perfil. `, en: (t: string) => `Yes, ${t} is part of his profile. ` },
    techNo: { es: (t: string) => `${t} no aparece en el perfil publicado, así que no puedo afirmar que lo use. Lo que sí está documentado: Go, Node.js, Java, Python, TypeScript y React; CI/CD, AWS/GCP, Kubernetes y Terraform; y en Nexo, JavaScript con Three.js y Cloudflare D1.`, en: (t: string) => `${t} is not in the published profile, so I can’t claim he uses it. What is documented: Go, Node.js, Java, Python, TypeScript and React; CI/CD, AWS/GCP, Kubernetes and Terraform; and in Nexo, JavaScript with Three.js and Cloudflare D1.` },
};

const defaultNext = ['agents', 'fintech', 'nexo', 'stack', 'contact'];

function suggest(ids: string[], memory: Memory, lang: Lang, exclude: string[] = []) {
    const pool = [...ids, ...defaultNext].filter((id, i, a) => a.indexOf(id) === i && !exclude.includes(id) && byId.has(id));
    const fresh = pool.filter((id) => !memory.seen[id]);
    return (fresh.length >= 2 ? fresh : pool).slice(0, 3).map((id) => byId.get(id)!.ask[lang]);
}

function build(kind: Reply['kind'], lang: Lang, text: string, used: Topic[], memory: Memory, suggestIds: string[]): Reply {
    const sources = used.filter((t) => t.source).map((t) => ({ href: t.source!.href, label: t.source!.label[lang] })).filter((s, i, a) => a.findIndex((x) => x.href === s.href) === i);
    return { kind, lang, text, topics: used.map((t) => ({ id: t.id, label: t.label[lang] })), sources, suggestions: suggest(suggestIds, memory, lang, used.map((t) => t.id)) };
}

// Picks the next thing to say about a topic given what was already said: answer → more → exhausted.
function speak(topic: Topic, memory: Memory, lang: Lang) {
    const n = memory.seen[topic.id] ?? 0;
    memory.seen[topic.id] = n + 1;
    if (n === 0) return topic.answer[lang];
    if (n === 1 && topic.more) return topic.more[lang];
    if (n === 1) return say.recap[lang] + topic.answer[lang].charAt(0).toLowerCase() + topic.answer[lang].slice(1);
    return say.exhausted[lang](topic.label[lang]);
}

export function respond(question: string, pageLang: Lang, previous: Memory): { reply: Reply; memory: Memory } {
    const memory: Memory = { last: [...previous.last], seen: { ...previous.seen }, turns: previous.turns + 1 };
    const q = normalize(question);
    const tokens = tokenize(q);
    const lang = detectLang(tokens, pageLang);
    const done = (reply: Reply) => ({ reply, memory });
    const small = (text: string, ids: string[] = defaultNext) => done(build('smalltalk', lang, text, [], memory, ids));

    if (re.meta.test(q)) return small(say.meta[lang]);
    if (re.personal.test(q)) return small(say.personal[lang]);
    if (re.hiring.test(q) && !/\b(why hire|por que contratar)/.test(q)) { const t = byId.get('contact')!; memory.last = ['contact']; return done(build('answer', lang, say.hiring[lang], [t], memory, t.next)); }

    // Technology questions: answer yes/no from the profile instead of guessing.
    const techAsked = re.techQ.test(q) || re.yesno.test(q) || (tokens.length <= 2 && !re.more.test(q));
    if (techAsked) {
        const hit = tokens.find((t) => knownTech[t]);
        const miss = tokens.find((t) => unknownTech.includes(t));
        if (hit) {
            const [name, id] = knownTech[hit];
            const t = byId.get(id)!;
            const body = memory.seen[id] ? t.answer[lang] : speak(t, memory, lang);
            memory.last = [id];
            const asked = re.techQ.test(q) || re.yesno.test(q);
            return done(build('answer', lang, (asked ? say.techYes[lang](name) : '') + body, [t], memory, t.next));
        }
        if (miss) {
            const name = miss.charAt(0).toUpperCase() + miss.slice(1);
            return done(build('fallback', lang, say.techNo[lang](name), [byId.get('stack')!], memory, ['stack', 'agents', 'nexo']));
        }
    }

    const exact = topics.find((t) => normalize(t.ask.es) === q || normalize(t.ask.en) === q);
    const ranked = (exact ? [{ t: exact, s: 99 }] : topics.map((t) => ({ t, s: score(q, tokens, t) }))).filter((r) => r.s >= 3).sort((a, b) => b.s - a.s);

    // Follow-ups ("tell me more", "why?") continue the previous topic when nothing new was asked.
    if (re.more.test(q) && (!ranked.length || ranked[0].s < 6)) {
        const t = memory.last.map((id) => byId.get(id)).find(Boolean);
        if (!t) return small(say.noMore[lang]);
        if ((memory.seen[t.id] ?? 0) === 0) memory.seen[t.id] = 1;
        return done(build('answer', lang, speak(t, memory, lang), [t], memory, t.next));
    }

    if (ranked.length) {
        const picked = [ranked[0].t];
        if (ranked[1] && ranked[1].s >= ranked[0].s * 0.75 && !memory.seen[ranked[1].t.id]) picked.push(ranked[1].t);
        const text = picked.map((t) => speak(t, memory, lang)).join(' ');
        memory.last = picked.map((t) => t.id);
        return done(build('answer', lang, text, picked, memory, picked.flatMap((t) => t.next)));
    }

    if (re.greet.test(q)) return small(say.greet[lang]);
    if (re.bye.test(q)) return small(say.bye[lang], ['contact']);
    if (re.thanks.test(q)) return small(say.thanks[lang], memory.last.flatMap((id) => byId.get(id)?.next ?? []));
    if (re.help.test(q)) return small(say.help[lang]);
    return done(build('fallback', lang, say.fallback[lang], [], memory, defaultNext));
}

export const starterQuestions = (lang: Lang) => ['agents', 'fintech', 'nexo', 'stack', 'teams', 'work_style', 'differentiator', 'contact'].map((id) => byId.get(id)!.ask[lang]);
