import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile('src/data/site.ts','utf8');
const en=JSON.parse(source.split('const en = ')[1].split('const es = ')[0].trim().replace(/;$/,''));
const root='https://kthyon.github.io/portafolio/';
const profile=`# Cristian Alvarado — Software Engineer

${en.about.background}

## Location and languages
${en.about.location}. ${en.about.language} (upper-intermediate English).

## Professional experience
${en.experience.jobs.map(j=>`### ${j.role} — ${j.company}\n${j.period}\n${j.description}\n${j.achievements.map(a=>'- '+a).join('\n')}`).join('\n\n')}

## Engineering cases
${en.about.cases.map(c=>`### ${c.title}\nContext: ${c.category}\nProblem: ${c.problem}\nMy contribution: ${c.contribution}\nResult: ${c.result}\nArchitecture / workflow: ${c.flow.join(' → ')}\nCase: ${root}about/#${c.id}`).join('\n\n')}

## Education
${en.about.education.name}, ${en.about.education.institution}. ${en.about.education.displayDate}.

## Technical practice
${en.about.skills.technical.map(s=>`- ${s.title}: ${s.description}`).join('\n')}

## Nexo — creator and instructor
${en.nexo.solution}
Architecture: ${[en.nexo.uiText,en.nexo.contentText,en.nexo.apiText,en.nexo.dbText,en.nexo.notebookText,en.nexo.localText].join(' ')}
${en.nexo.decisions[2].text}
The public case contains demonstration screenshots without real student records. Guided demonstrations are available by contact.
Case study: ${root}work/nexo/

## Professional links
- Portfolio: ${root}
- About: ${root}about/
- LinkedIn: https://www.linkedin.com/in/crisalvarado-ingeniero/
- GitHub: https://github.com/kthyon
- Résumé: ${root}CV_Cris_Alvarado.pdf

The formal role at Mercado Libre is Software Engineer. Regional coverage describes work context; no traffic, uptime, savings or employer-wide user metrics are claimed as personal results.
`;
await writeFile('public/cris-profile.md',profile);
await writeFile('public/llms-full.txt',profile);
await writeFile('public/llms.txt',`# Cristian Alvarado — Engineering Portfolio

> Software Engineer at Mercado Libre. Applied AI, MCP, developer tools, enterprise integrations and backend engineering. Creator of Nexo and ML / Deep Learning instructor at UTP.

## Profile and evidence
- [Portfolio](${root}): selected work, experience and contact.
- [Engineering cases and background](${root}about/): Jira/Slack user onboarding automation, collaborative Mercado Pago web delivery, Nexo, education and languages.
- [Factual profile](${root}cris-profile.md): plain-text professional facts.
- [Full profile](${root}llms-full.txt): experience, contributions, architecture and limitations.
- [Nexo case study](${root}work/nexo/): teaching problem, architecture, technology choices and demonstration screenshots. Guided demonstration by contact.

## Spanish
- [Portafolio](${root}es/)
- [Trayectoria y casos](${root}es/about/)
- [Caso de Nexo](${root}es/work/nexo/)

## Creative coding
- [Skills Invaders](${root}lab/): interactive browser game.
`);
const routes=['','about/','work/nexo/','lab/'];
const entries=routes.flatMap(route=>['en','es'].map(lang=>`  <url><loc>${root}${lang==='es'?'es/':''}${route}</loc><xhtml:link rel="alternate" hreflang="en" href="${root}${route}"/><xhtml:link rel="alternate" hreflang="es" href="${root}es/${route}"/><xhtml:link rel="alternate" hreflang="x-default" href="${root}${route}"/></url>`));
await writeFile('public/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
console.log('Generated factual profile, optional AI text files and bilingual sitemap from shared content.');
