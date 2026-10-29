# Cristian Alvarado - Engineering Portfolio

Astro + React portfolio. English is the default; Spanish can be selected in the navigation. All professional content uses the same bilingual data source in `src/data/site.ts`.

## Local development

`npm ci` then `npm run dev -- --host 127.0.0.1`.

`npm run build` generates factual text profiles and the sitemap from shared content, checks types and produces the static site. `npm run check:content` verifies the eight routes, canonical URLs, language alternates, structured data, links, headings and content boundaries. `npm run build:cv` rebuilds the English resume. GitHub Actions runs the build and content checks before deploying `main` to GitHub Pages.

## Content

The selected work section describes AI tooling, Jira/Slack onboarding automation, collaborative Mercado Pago web delivery and Nexo. Do not add employer-internal code, invented impact metrics, or titles not formally held. Nexo has a public case study and demonstration screenshots; application and repository links are not published. Skills Invaders remains on the home page and at `/lab/`. The local profile assistant is preserved.

English routes are `/`, `/about/`, `/work/nexo/` and `/lab/`; Spanish equivalents are under `/es/`. Each page has its own canonical URL and reciprocal language alternates. The factual text files are optional reading aids, not a ranking guarantee. A robots.txt under the project path does not control host-wide crawling.
