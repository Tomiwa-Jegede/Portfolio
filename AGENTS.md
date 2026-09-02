# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

- Communication: concise, direct, technical; reference file paths as `path:line` when citing code
- Code style: TypeScript + React with Vite, no emojis in code, explicit props, Tailwind for styling, Framer Motion + GSAP for motion, functional components only
- Verification: `npm run build` (tsc && vite build) must pass, `npm run dev` for local dev (Vite at :5173), manual scroll/motion check on Home
- Workflow: prefer editing existing files over creating new ones; verify with execution before claiming fixes; keep DOX chain current

## Project Overview

Victor Portfolio — Personal portfolio for a revenue-systems developer that showcases shipped products and converts visitors into qualified inquiries.

**Stack:** React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + Framer Motion 11 + GSAP 3 + Lenis 1 + React Router 6 + React Helmet Async 3; npm; `npm run dev`, `npm run build` (`tsc && vite build`), `npm run preview`; Netlify hosting via `netlify.toml`

**Repo layout:**
- `/` — repo root: `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `netlify.toml`, `index.html`
- `src/` — SPA source: `App.tsx`, `main.tsx`, `index.css`
- `src/pages/` — route pages: `Home/`, `Projects/`, `About/`, `Contact/`, `NotFound/`
- `src/components/` — shared UI: `layout/`, `hero/`, `ide/`, `ui/`
- `src/hooks/` + `src/context/` + `src/lib/` + `src/scenes/` — hooks, scroll context, utils, scene experiments
- `public/` — static assets: `images/` (project screenshots), other public files
- `dist/` — Vite production output (not committed)
- `delivery-management/` — engineering delivery planning (roadmap + milestone trackers)
- `product-management/` — product value workspace (value map + opportunity map)

## Repository Layout Contract

- Git: single repo, default branch `main`; do not commit `node_modules/`, `dist/`, `.netlify/`
- Ignores: `.gitignore` covers `node_modules/`, `dist/`, `.env*` (no secrets in repo); Vite/Tailwind outputs are generated
- Secrets: no backend secrets; env vars only if analytics added (e.g. GA id) — keep in Netlify dashboard, never committed
- Lockfiles: commit `package-lock.json`; use `npm ci` in CI
- Artifacts: `dist/` is build output from `npm run build`; screenshots live in `public/images/` and are committed

## Frontend Direction

- Owns: SPA shell (`App.tsx:36`, `main.tsx`), routing (`react-router-dom` in `App.tsx:4`), scroll orchestration (`LenisScrollContext.tsx`, `App.tsx:41`), page composition (`pages/Home/Home.tsx`, `pages/Projects/Projects.tsx`), motion (Framer Motion, GSAP, `@studio-freight/lenis`), SEO (`react-helmet-async` in each page)
- Contracts: single `BrowserRouter` at `App.tsx:77`; Lenis instance created once in `App.tsx:42` and provided via `LenisScrollContext`; `AnimatePresence mode="wait"` for route transitions in `App.tsx:23`; lazy-load heavy pages via `React.lazy` + `Suspense` at `App.tsx:11`; path alias `@` -> `src/` via `vite.config.ts:8`; no direct `window.scrollTo` outside Lenis/motion contexts
- Execution order: component/hook change -> `npm run dev` visual check -> `npm run build` typecheck -> manual scroll/route verification on Home (desktop 600vh pinned + mobile stacked)

## Experience Direction

- Owns: narrative and conversion flow — hero value prop (`components/hero/HeroOverlay.tsx`), immersive scroll storytelling (`pages/Home/Home.tsx:32` DesktopHome vs MobileHome), project proof (`pages/Projects/Projects.tsx:14` with live links), about credibility (`pages/About/About.tsx`), contact CTA (`pages/Contact/Contact.tsx`)
- Contracts: Home is either `BuildSequence` intro then `DesktopHome` (pin + opacity transforms at `Home.tsx:90`) or `MobileHome` (stacked sections); Projects uses carousel on desktop / stack on mobile at `Projects.tsx:304`; motion must not break reduced-motion or mobile viewport (`isMobileViewport` guards); images served from `public/images/` with `object-cover`
- Guardrails: keep `useIsMobile` match at 768px consistent across Home/Projects/About; `AnimatePresence` for section reveals; `Helmet` canonical stays `https://vctdev.netlify.app/` until domain changes

## Cross-Module Contracts

- Routing boundary: `App.tsx` owns all routes (`/`, `/projects`, `/about`, `/contact`, `*`); `Nav.tsx` drives navigation and must stay in sync with route table
- Scroll boundary: only `App.tsx` creates Lenis; consumers read `useLenisScrollContext`; never instantiate a second Lenis
- Styling boundary: Tailwind is the only styling system (`tailwind.config.js`, `postcss.config.js`, `src/index.css`); no CSS-in-JS outside Tailwind + Framer motion props
- Motion boundary: Framer Motion for declarative transforms, GSAP for imperative sequences, Lenis for smooth scroll — do not duplicate scroll listeners (use `scrollYProgress` from context)
- SEO boundary: each page sets `Helmet` title/meta/canonical; do not add duplicate Helmet providers (single `HelmetProvider` assumed at app root or page level)
- Delivery/value boundary: `delivery-management/` sequences by dependency; `product-management/` argues value by stakeholder — neither duplicates the other's artifact

## Child DOX Index

This root doc owns:
- `/` — repo root and cross-module contracts
- `src/` — Vite React SPA (code-local source)
- `public/` — static assets and screenshots
- `delivery-management/` — Engineering delivery planning (sequencing by dependency)
- `product-management/` — Product value workspace (value by stakeholder)
- `wayfinder/` — Wayfinding decision maps (destination + tickets, plan before build)

Child docs:
- `delivery-management/AGENTS.md` — Delivery workspace contract: roadmap and milestone tracking
- `product-management/AGENTS.md` — Value workspace contract: value map and opportunity analysis
- `wayfinder/AGENTS.md` — Wayfinding workspace contract: decision maps and tickets
