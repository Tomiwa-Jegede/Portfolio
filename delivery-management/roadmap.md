# Product Roadmap

## Purpose

Sequences how Victor Portfolio delivers visitor trust and inquiry conversion — from narrative shell to project proof to deploy polish — tracked by dependency, not by page wish list.

## Product North Star

Any visitor understands in 15 seconds that Victor builds revenue systems not just websites, can verify proof via live shipped projects, and can reach out in one tap — on any device, with motion that never breaks readability.

## Product Surfaces

### Current Core Surfaces

- `src/pages/Home/Home.tsx` — immersive scroll narrative (BuildSequence intro -> DesktopHome 600vh pinned or MobileHome stacked)
- `src/pages/Projects/Projects.tsx` — project proof carousel (desktop) / stack (mobile) with live links and screenshots from `public/images/`
- `src/pages/About/About.tsx` — credibility narrative + skills + stat strip
- `src/pages/Contact/Contact.tsx` — conversion CTA with contact channels
- `src/components/hero/HeroOverlay.tsx` + `src/components/ide/*` — hero value prop and IDE storytelling veneer
- `src/components/layout/Nav.tsx` — route navigation, stays in sync with `App.tsx` route table

### Planning Focus Areas

- Narrative performance: keep 600vh pinned transforms smooth, guard reduced-motion and sub-768px viewports
- Proof depth: replace placeholder screenshots, add 1-2 new case studies, harden outbound link telemetry
- Conversion & polish: form/CTA copy, a11y, image optimization, build/deploy verification

## Architecture Boundary

- `src/` — owns presentation, routing, motion, and scroll orchestration; no backend; reads only static assets from `public/`
- `public/` — owns deploy-time assets (screenshots, icons); served as-is by Vite/Netlify
- `delivery-management/` — owns sequencing by dependency; `product-management/` owns value thesis

Product semantics should stay in the correct layer.

## Milestone Map

Each subsection maps 1:1 to a numbered tracker file (`milestone-N.md`). The tracker is the source of truth for scope, execution order, and verification; this file shows sequencing and status roll-up.

### Milestone 1: Narrative Shell & Foundation

- Goal: Visitor lands on a coherent story that pins and reveals Hero -> About -> Projects -> Contact without breaking scroll or routes.
- Includes: `App.tsx` BrowserRouter + Lenis provider + AnimatePresence, `Home.tsx` DesktopHome/MobileHome branching, `HeroOverlay`, `BuildSequence`, Lenis `1.2` duration + motion transforms, `react-helmet-async` canonical, `Nav` routing, Netlify deploy via `netlify.toml`
- Status summary: Delivered — `Home.tsx:33` pinned logic + `App.tsx:42` Lenis singleton + 5 routes verified; `npm run build` passes
- Tracker: see [`milestone-1.md`](./milestone-1.md)

### Milestone 2: Proof & Conversion Hardening

- Goal: Projects and About prove shipped outcomes and make contact the obvious next step.
- Includes: `Projects.tsx:14` live links (Convertly, Trend Tribe, Jegz Menswear) + carousel/stack branching at `Projects.tsx:304`, `ProjectCard` glare/tilt, image handling via `object-cover` + `public/images/`, `About.tsx` story + skills, `Contact.tsx` CTA and channels
- Status summary: Partially complete — cards and routing shipped, screenshots are provisional, no contact form yet, mobile overflow partially hardened
- Tracker: see [`milestone-2.md`](./milestone-2.md)

### Milestone 3: Polish, Performance & Deploy

- Goal: Every interaction feels fast, accessible, and survives build/deploy.
- Includes: Tailwind + Framer + GSAP deduplication, reduced-motion guards, 768px `useIsMobile` consistency, image `loading=lazy` + sizing, a11y (keyboard, contrast, focus), `tsc && vite build` + `vite preview` regression, Netlify cache/redirect verification
- Status summary: Not started — verification is build + manual scroll/route check; tracker to be created
- Tracker: see [`milestone-3.md`](./milestone-3.md)

## Sequencing Rules

- Foundation before proof: M1 scroll/routing shell must land before project-specific UI is layered (Projects/About depend on `LenisScrollContext` and route stability)
- Shell before polish: image optimization and a11y passes need stable surfaces to measure
- Desktop and mobile ship together: any motion change must be verified at >768px and <768px in the same milestone
- Static proof before dynamic proof: screenshots and live links before any future CMS or form backend

## Regression Guardrails

- No milestone ships without `npm run build` passing and Home pinned scroll verified on desktop (600vh) and stacked flow on mobile
- Never create a second Lenis instance; consumers use `useLenisScrollContext` only — `App.tsx:42` remains the single owner
- Keep `BrowserRouter` singleton at `App.tsx:77`; do not nest additional routers
- Preserve `AnimatePresence mode="wait"` for route transitions; do not remove `Suspense` around lazy pages
