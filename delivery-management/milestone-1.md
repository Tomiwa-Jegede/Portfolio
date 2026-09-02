# Milestone 1: Narrative Shell & Foundation

## Goal

A visitor lands on `/` and experiences a coherent pinned story Hero -> About -> Projects -> Contact that never breaks scroll, routing, or motion on desktop or mobile.

## Scope

- `src/App.tsx` — `BrowserRouter` singleton, single Lenis instance (`duration 1.2`, `easing`, `smoothWheel`), `LenisScrollContext.Provider`, `AnimatePresence mode="wait"`, `React.lazy` + `Suspense` for Home/Projects/About/Contact/NotFound, `Nav` + `ScrollProgressBar` + `Cursor`
- `src/pages/Home/Home.tsx` — `BuildSequence` gate (`buildComplete`), `DesktopHome` (600vh pin, `scrollYProgress` thresholds `0.14-0.84`, opacity/scale transforms, sessionStorage `lastSection` restore) vs `MobileHome` (stacked sections, `mobileScrollY` restore, no Lenis pin)
- `src/components/hero/HeroOverlay.tsx` + `src/components/ide/BuildSequence.tsx` — hero value prop and IDE intro sequence
- `src/components/layout/Nav.tsx` + routing table (`/`, `/projects`, `/about`, `/contact`, `*`) — navigation stays in sync with `App.tsx:24`
- SEO + deploy baseline — `react-helmet-async` canonical `https://vctdev.netlify.app/` on Home/Projects/About, `netlify.toml` and `index.html` entry, `@` alias via `vite.config.ts:8`
- Styling system — `tailwind.config.js`, `postcss.config.js`, `src/index.css` as sole styling layer

## Non-Goals

- Project carousel polish or screenshot depth (Milestone 2)
- About stat/signal refinement beyond shipped story (Milestone 2)
- Contact form backend, email delivery, or analytics integration (out of scope / Milestone 2)
- Image optimization, a11y sweep, and performance budgeting (Milestone 3)
- Any backend, CMS, or database work — portfolio is static SPA only

## Ownership Boundaries

- `src/App.tsx` + `src/context/LenisScrollContext.tsx` + `src/hooks/useScroll.ts` — owns scroll orchestration and route shell
- `src/pages/Home/Home.tsx` + `src/components/ide/*` + `src/components/hero/*` — owns narrative sequencing and pin mechanics
- `src/components/layout/Nav.tsx` — owns navigation and must mirror `App.tsx` route table
- `vite.config.ts` + `tailwind.config.js` + `netlify.toml` — owns build, alias, and deploy wiring

## Execution Order

Sequence by dependency.

1. Vite + TS + Tailwind + alias + Helmet scaffolding verified (`npm run build` green, `@` resolves to `src/`)
2. `App.tsx` Lenis singleton + `LenisScrollContext` + `BrowserRouter` + `AnimatePresence` wired; confirm no second Lenis instance
3. `BuildSequence` gate and `HeroOverlay` mounted on `/`; canonical and title via `Helmet` confirmed
4. `Home.tsx` `useIsMobile` (768px) branching: `DesktopHome` pin/transforms vs `MobileHome` stacked — add sessionStorage restore for both
5. `About`, `Projects`, `Contact` placeholder mounts inside Home pin + standalone routes (`/projects`, `/about`, `/contact`) via `standalone` prop
6. `Nav` route table sync + negative-margin guard (`isMobileViewport` check at `768px`) across Home/Projects/About
7. Manual verification: Desktop 600vh scroll + portal opacities, Mobile stacked no-overlap, route transitions via `AnimatePresence`, `npm run build` passes

## Value Outcome

Delivers `product-management/value-map.md` outcome V1 — Visitor quickly grasps the revenue-systems positioning and experiences a coherent scroll story on any device. Delivery status is not a claim of visible value; the milestone is done only when the stakeholder can feel this outcome.

## Status

Complete

- Current status summary: Delivered — `App.tsx:42` Lenis singleton, `Home.tsx:33` pinned narrative and `MobileHome` stacked path both live; 5 routes + `NotFound` wiring + Helmet canonical verified at `vctdev.netlify.app`
- Remaining work: minor — reduced-motion guard audit, sessionStorage restore edge case on hard refresh, portal opacity timing polish

## Verification / Definition of Done

- `npm run build` (`tsc && vite build`) passes with zero type errors
- `npm run dev` shows `/` with `BuildSequence` then pinned DesktopHome (600vh) and stacked MobileHome (<768px) without overlap or flash
- Route check: `/`, `/projects`, `/about`, `/contact`, `/*` -> NotFound all render; `Nav` navigates via `react-router-dom` without full reload
- Scroll check: `scrollYProgress` drives `aboutOpacity`/`projectsOpacity`/`contactOpacity` thresholds; no duplicate scroll listeners, single Lenis in `App.tsx`
- SEO check: `Helmet` canonical `https://vctdev.netlify.app/` on Home, About, Projects; `index.html` loads Vite entry

## Regression Guardrails

- Do not create a second Lenis instance; consumers use `useLenisScrollContext` only
- Keep `BrowserRouter` singleton at `App.tsx:77`; do not nest routers
- Preserve `useIsMobile` match at 768px across Home/Projects/About; changing one without the others breaks layout sync
- Keep motion guards: no negative viewport margins on mobile (`amount: 0.1` with `margin: "0px"`), preserve `AnimatePresence mode="wait"` and `Suspense` around lazy pages
