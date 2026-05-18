import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = new PDFDocument({ margin: 50 });
const outputPath = path.join(__dirname, '../public/CV_Cris_Alvarado.pdf');

// Ensure public directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

doc.pipe(fs.createWriteStream(outputPath));

// Styling functions
const title = (text) => doc.font('Helvetica-Bold').fontSize(24).fillColor('#000000').text(text, { align: 'center' }).moveDown(0.5);
const subtitle = (text) => doc.font('Helvetica').fontSize(14).fillColor('#666666').text(text, { align: 'center' }).moveDown(2);
const heading = (text) => doc.font('Helvetica-Bold').fontSize(16).fillColor('#333333').text(text).moveDown(0.5);
const subHeading = (text) => doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000').text(text).moveDown(0.2);
const body = (text) => doc.font('Helvetica').fontSize(10).fillColor('#444444').text(text, { align: 'justify' }).moveDown(0.5);

// Header
title('CRISTIAN ALVARADO');
subtitle('Software Engineer');

// Contact info
doc.font('Helvetica').fontSize(10).fillColor('#666666')
    .text('Pereira, Risaralda | 311 625 31 76 | crosalvardo@gmail.com | github.com/kthyon | kthyon.github.io/portfolio', { align: 'center' })
    .moveDown(2);

// Summary
heading('PERFIL PROFESIONAL');
body('Ingeniero de software con amplia experiencia en la creación de soluciones tecnológicas de vanguardia, destacando en los sectores público y privado por mi rápida adaptación a entornos dinámicos. Impulsado por la curiosidad constante y el compromiso con la excelencia. Más de 10 años construyendo sistemas de alta escala, y actualmente 3 años en Mercado Libre desarrollando sistemas distribuidos resilientes y sirviendo a más de 200 millones de usuarios junto a equipos de Brasil, Argentina y México. Experiencia profunda aplicando tecnologías para optimizar procesos y mejorar experiencias de usuario, fusionando perspectivas técnicas y estratégicas para impulsar la transformación digital.');
doc.moveDown();

// Experience
heading('EXPERIENCIA PROFESIONAL');

subHeading('Staff Software Engineer — Mercado Libre / Mercado Pago');
doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text('Hace 3 años - Presente').moveDown(0.5);
body('Arquitectura y construcción de sistemas distribuidos resilientes de alta escala y mantenimiento de ecosistemas complejos de repositorios internos. Trabajo internacional con equipos de Brasil, Argentina y México.');
doc.font('Helvetica').fontSize(10).fillColor('#444444');
doc.list([
    'Diseño e implementación de sistemas resilientes y tolerantes a fallos operando a escala de 200M+ de usuarios.',
    'Mantenimiento y optimización de repositorios internos críticos, asegurando alta disponibilidad.',
    'Liderazgo en decisiones de arquitectura de alto impacto (observabilidad, performance, escalabilidad).'
], { bulletRadius: 2 }).moveDown(1.5);

subHeading('Docente Diplomado IA — Universidad Tecnológica de Pereira (UTP)');
doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text('1er Semestre 2025').moveDown(0.5);
body('Docencia en el diplomado de Inteligencia Artificial, enseñando fundamentos y aplicaciones prácticas de IA.').moveDown(1.5);

subHeading('Docente Universitario — CIAF');
doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text('Docente Universitario').moveDown(0.5);
body('Docencia en programas de tecnología e ingeniería, combinando teoría y práctica para formar futuros profesionales en desarrollo de software.').moveDown(1.5);

subHeading('Ingeniero de Software — Universidad Tecnológica de Pereira (UTP)');
doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text('2019 - 2022').moveDown(0.5);
body('Desarrollo de soluciones tecnológicas y sistemas académicos institucionales.');
doc.list([
    'Desarrollo del portal estudiantil universitario, mejorando la interacción y accesibilidad para los estudiantes.',
    'Integración de sistemas internos usando HTML/CSS/JS, Node.js, Material Design, Angular y bases de datos PL/SQL.',
    'Creación del "Front Concept", el núcleo innovador actualmente en uso institucional.',
    'Administración institucional (email, SMS) y soporte a áreas financieras y recursos humanos.'
], { bulletRadius: 2 }).moveDown(1.5);

subHeading('Soporte IT / Desarrollador — UTP & Entidades Gubernamentales (DPS, MINTIC)');
doc.font('Helvetica-Oblique').fontSize(10).fillColor('#666666').text('2015 - 2018').moveDown(0.5);
body('Soporte técnico a aplicaciones y procesos de ingeniería en la Universidad Tecnológica de Pereira y entidades públicas (DPS, Registraduría Nacional, MINTIC). Creador del software POSNET (POS para comercios).').moveDown(1.5);

// Core Competencies
heading('HABILIDADES TÉCNICAS');
doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000').text('Frontend: ', { continued: true })
   .font('Helvetica').fillColor('#444444').text('React, Angular, JS/CSS, Tailwind, Bootstrap, UI/UX, Figma, Affinity').moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000').text('Backend & Data: ', { continued: true })
   .font('Helvetica').fillColor('#444444').text('Node.js, Go, Python, PL/SQL, PostgreSQL, Excel/Power BI').moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000').text('Infra & DevOps: ', { continued: true })
   .font('Helvetica').fillColor('#444444').text('AWS, Linux, Git/GitHub, Microservices, Kubernetes, Agile/Scrum').moveDown(2);

// Education
heading('EDUCACIÓN');
subHeading('Ingeniería de Sistemas y Computación / Tecnólogo en Desarrollo');
doc.font('Helvetica').fontSize(10).fillColor('#444444').text('CIAF (Centro de Investigación y Actualización Formativa)').moveDown();

doc.end();

console.log('CV successfully generated at public/CV_Cris_Alvarado.pdf');
