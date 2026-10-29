import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const output=fileURLToPath(new URL('../public/CV_Cris_Alvarado.pdf',import.meta.url));
const doc=new PDFDocument({size:'A4',margin:48,bufferPages:true,info:{Title:'Cristian Alvarado - Software Engineer',Author:'Cristian Alvarado'}});
const stream=fs.createWriteStream(output);doc.pipe(stream);
const ink='#192624',accent='#315D46',muted='#596562';
function section(t){doc.moveDown(.6);doc.font('Helvetica-Bold').fontSize(10).fillColor(accent).text(t.toUpperCase(),{characterSpacing:1});doc.moveDown(.5);}
function body(t){doc.font('Helvetica').fontSize(10).fillColor(ink).text(t,{lineGap:3});doc.moveDown(.45);}
function job(t,c,d){doc.font('Helvetica-Bold').fontSize(12).fillColor(ink).text(t);doc.moveDown(.2);doc.font('Helvetica').fontSize(10).fillColor(muted).text(`${c} | ${d}`);doc.moveDown(.5);}
function bullet(t){body(`- ${t}`);}
function link(t,u){doc.font('Helvetica').fontSize(9).fillColor(accent).text(t,{link:u,underline:true});doc.moveDown(.4);}
doc.rect(0,0,doc.page.width,12).fill(accent);
doc.font('Helvetica-Bold').fontSize(27).fillColor(ink).text('CRISTIAN ALVARADO');doc.moveDown(.25);
doc.font('Helvetica').fontSize(13).fillColor(accent).text('Software Engineer | AI Systems & Distributed Software');doc.moveDown(.5);
doc.font('Helvetica').fontSize(9).fillColor(muted).text('Pereira, Colombia | English B2 (upper-intermediate)');doc.moveDown(.5);
link('kthyon.github.io/portafolio/','https://kthyon.github.io/portafolio/');
link('linkedin.com/in/crisalvarado-ingeniero/','https://www.linkedin.com/in/crisalvarado-ingeniero/');
link('github.com/kthyon','https://github.com/kthyon');
section('Profile');
body('Software Engineer at Mercado Libre, building software and automation for Mercado Pago across Latin America. Experience combines AI agents, MCP servers, reusable skills and developer tooling with backend services and React/TypeScript interfaces. Machine Learning and Deep Learning instructor at Universidad Tecnologica de Pereira (UTP).');
section('Current experience');
job('Software Engineer','Mercado Libre / Mercado Pago','Dec 2023 - Present');
bullet('Build AI agents, MCP integrations, reusable skills and automated workflows connected to engineering tools and services.');
bullet('Develop backend services and integrations with Go, Node.js and Java, and product interfaces with React and TypeScript.');
bullet('Work with databases, CI/CD, observability and regional solutions across Brazil, Mexico, Argentina, Colombia, Chile and Peru.');
job('Machine Learning & Deep Learning Instructor','Universidad Tecnologica de Pereira','Sep 2026 - Present');
body('Teach Machine Learning and Deep Learning in the Data Science diploma program, connecting model training and evaluation with applied problems.');
bullet('Created Nexo, a teaching tool connecting interactive explanations, practical Python/Colab exercises and learning progress.');
section('Featured project');
doc.font('Helvetica-Bold').fontSize(11).fillColor(ink).text('Nexo - a teaching tool I created');doc.moveDown(.4);
body('Practical notebooks and visual tools connecting preprocessing, training and evaluation with regression, classification, clustering, dimensionality reduction and computer vision.');
body('Architecture: JavaScript, Three.js, Python/Colab and an authenticated records API backed by D1/SQLite. Guided demonstrations available by contact.');
doc.addPage();
doc.font('Helvetica-Bold').fontSize(17).fillColor(ink).text('CRISTIAN ALVARADO');
doc.font('Helvetica').fontSize(10).fillColor(muted).text('Software Engineer | Experience & technical practice');
section('Earlier experience');
job('Machine Learning & Deep Learning Instructor','Universidad Tecnologica de Pereira','Sep - Oct 2025');
body('Taught Machine Learning and Deep Learning in the Data Science diploma program, connecting learning algorithms and artificial neural networks with practical applications for professional learners.');
job('Software Engineering Instructor & Speaker','CIAF Educacion Superior','Jan - Dec 2023');
body('Taught programming and software engineering across multiple levels. Covered programming logic, architecture, agile methods and project management through practical learning activities.');
job('Software Engineer','Universidad Tecnologica de Pereira','Sep 2020 - Oct 2023');
bullet('Developed and supported institutional software and academic systems.');
bullet('Redesigned interfaces to improve interaction and usability in academic applications.');
bullet('Led development of a modular CRM for institutional relationship management.');
section('Technical practice');
body('Applied AI: AI agents, Model Context Protocol (MCP), reusable skills, workflow automation and developer tooling.');
body('Backend and product: Go, Node.js, Java, Python, TypeScript, React, APIs and databases.');
body('Delivery and operations: CI/CD, AWS/GCP, Kubernetes, Terraform, observability and distributed software.');
body('Teaching: Machine Learning, Deep Learning, model evaluation, practical notebooks and interactive technical explanations.');
section('Education');body('Software Engineering - CIAF Educacion Superior.');
section('Public work & contact');
link('Portfolio: kthyon.github.io/portafolio/','https://kthyon.github.io/portafolio/');
link('LinkedIn: linkedin.com/in/crisalvarado-ingeniero/','https://www.linkedin.com/in/crisalvarado-ingeniero/');
const range=doc.bufferedPageRange();for(let i=0;i<range.count;i++){doc.switchToPage(i);doc.font('Helvetica').fontSize(8).fillColor(muted).text(`Cristian Alvarado | ${i+1} / ${range.count}`,48,doc.page.height-35,{lineBreak:false});}
doc.end();await new Promise((resolve,reject)=>{stream.on('finish',resolve);stream.on('error',reject);});console.log(`Resume generated (${range.count} pages)`);
