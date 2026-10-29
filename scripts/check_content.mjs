import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
const root='https://kthyon.github.io/portafolio/';
const source=await readFile('src/data/site.ts','utf8');
const en=JSON.parse(source.split('const en = ')[1].split('const es = ')[0].trim().replace(/;$/,''));
const es=JSON.parse(source.split('const es = ')[1].split('export type Language')[0].trim().replace(/;$/,''));
const forbidden=/Staff Software Engineer|200M\+|2K hours|8 classes|8 clases|24 topics|24 temas|8 practical|8 cuadernos|nexo-ia-registros-utp|github\.com\/kthyon\/diplomado-utp-aula/i;
for(const c of [en,es]){
 assert.equal(c.work.cards.length,4);
 assert.equal(c.about.cases.length,3);
 assert.equal(c.about.education.date,'2022-12-14');
 assert.equal(c.experience.jobs[0].role,'Software Engineer');
 assert.equal(c.experience.jobs.length,5);
 assert.match(c.experience.jobs[1].period,/2026/);
 assert.match(c.experience.jobs[2].period,/2025/);
 assert.equal(c.work.cards[3].links.length,1);
 assert.equal(c.work.cards[3].links[0].href,'/work/nexo/');
 assert.equal(c.bentoGrid.cards.length,5);
 assert.equal(c.metrics.items.length,4);
 assert.doesNotMatch(JSON.stringify(c),forbidden);
}
const pages=new Map();
for(const lang of ['en','es'])for(const suffix of ['','about/','work/nexo/','lab/']){
 const route=(lang==='es'?'es/':'')+suffix;
 const html=await readFile(path.join('dist',route,'index.html'),'utf8');
 pages.set(route,html);
 assert.match(html,new RegExp('<html lang="'+lang+'"'));
 assert.equal((html.match(/<h1\b/g)||[]).length,1,route+': one primary heading');
 assert.doesNotMatch(html,forbidden);
 assert.match(html,/<meta name="description" content="[^"]{60,220}"/);
 assert.ok(html.includes('rel="canonical" href="'+root+route+'"'),route+': exact self canonical');
 for(const [locale,url] of [['en',root+suffix],['es',root+'es/'+suffix],['x-default',root+suffix]]){
  assert.ok(html.includes('hreflang="'+locale+'" href="'+url+'"'),route+': reciprocal language alternate '+locale);
 }
 assert.ok(html.includes('property="og:url" content="'+root+route+'"'));
 assert.match(html,/name="twitter:card" content="summary_large_image"/);
 const json=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
 assert.ok(json,route+': structured data present');
 const graph=JSON.parse(json[1])['@graph'];
 const person=graph.find(n=>n['@type']==='Person');
 assert.equal(person.jobTitle,'Software Engineer');
 assert.equal(person.name,'Cristian Alvarado');
 assert.equal(person.hasCredential.name,'Ingeniería de Software');
 const page=graph.find(n=>['WebPage','ProfilePage'].includes(n['@type']));
 assert.equal(page.url,root+route);assert.equal(page.inLanguage,lang);
 assert.ok(html.includes('ProfileBot'),route+': profile assistant retained');
 if(suffix==='')assert.match(html,/Skills Invaders|Skills <span[^>]*>Invaders/);
 if(suffix==='about/'){
  const about=html.match(/<article\b[\s\S]*?<\/article>/)?.[0];
  assert.ok(about?.includes('<canvas'),route+': abstract particle graphic');
  assert.doesNotMatch(about,/<img\b/,route+': portrait replaced');
  for(const paragraph of (lang==='en'?en:es).about.background.split('\n\n'))assert.ok(html.includes(paragraph),route+': complete introduction');
  for(const token of ['Jira','Slack','Developers','2022-12-14','Nexo','B2'])assert.ok(html.includes(token),route+': visible fact '+token);
  const headings=[...html.matchAll(/<h([1-6])\b/g)].map(m=>Number(m[1]));
  headings.forEach((level,i)=>assert.ok(i===0||level<=headings[i-1]+1,route+': heading hierarchy'));
 }
 for(const m of html.matchAll(/<img\b[^>]*>/g)){
  assert.match(m[0],/\balt="[^"]+"/);assert.match(m[0],/\bwidth="\d+"/);assert.match(m[0],/\bheight="\d+"/);
  const src=m[0].match(/\bsrc="([^"]+)"/)?.[1];
  if(src?.startsWith('/portafolio/'))await access(path.join('dist',src.slice(12)));
 }
}
let links=0;
for(const [route,html] of pages)for(const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
 const href=m[1];
 if(!href.startsWith('/portafolio/')&&!href.startsWith('#'))continue;
 const url=new URL(href,root+route);const targetRoute=url.pathname.slice('/portafolio/'.length);
 const filename=targetRoute===''||targetRoute.endsWith('/')?targetRoute+'index.html':targetRoute;
 await access(path.join('dist',filename));links++;
 if(url.hash){
  const target=pages.get(targetRoute)||await readFile(path.join('dist',filename),'utf8');
  assert.ok(target.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),route+': missing anchor '+href);
 }
}
for(const lang of ['','es/']){
 const nexo=pages.get(lang+'work/nexo/');
 assert.match(nexo,/nexo-overview\.png/);assert.match(nexo,/nexo-learning\.png/);
 assert.doesNotMatch(nexo,/href="https:\/\/(?:nexo-ia-registros-utp|kthyon.github.io\/diplomado-utp-aula|github.com\/kthyon\/diplomado-utp-aula)/);
}
for(const filename of ['cris-profile.md','llms.txt','llms-full.txt']){
 const text=await readFile('dist/'+filename,'utf8');
 assert.match(text,/Nexo/);assert.doesNotMatch(text,forbidden);
}
const profile=await readFile('dist/cris-profile.md','utf8');
for(const c of en.about.cases)assert.ok(profile.includes(c.contribution));
assert.equal(profile,await readFile('dist/llms-full.txt','utf8'));
const sitemap=await readFile('dist/sitemap.xml','utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,8);
for(const route of pages.keys())assert.ok(sitemap.includes('<loc>'+root+route+'</loc>'));
assert.match(await readFile('dist/404.html','utf8'),/noindex,follow/);
console.log('Passed: 8 bilingual pages, exact canonicals, hreflang, structured data, heading hierarchy, '+links+' internal links/anchors, visible facts, AI text consistency, Nexo privacy and retained interactions.');
