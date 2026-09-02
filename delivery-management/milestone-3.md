# Milestone 3: Polish, Performance & Deploy Hardening

## Goal

Every interaction feels fast, accessible, and survives build and Netlify deploy without motion or layout regression.

## Scope

- Performance — `image` `loading="lazy"` + explicit `width`/`height` to avoid CLS, audit bundle (Framer Motion + GSAP + Lenis), tree-shake unused scenes/hooks, confirm `dist/` size budget
- Accessibility — keyboard Nav, focus rings on `ProjectCard` links and carousel Prev/Next, contrast on `text-ghost/40` vs `#050508`, respect `prefers-reduced-motion` (disable glare/tilt and pin transforms when reduced)
- Motion consistency — consolidate Framer Motion (`AnimatePresence`, `useTransform`) + GSAP + Lenis boundaries; no duplicate scroll listeners; 768px threshold unified
- Build/deploy — `tsc && vite build` + `vite preview` regression, `netlify.toml` redirects/headers/cache, canonical stability at `https://vctdev.netlify.app/`, `dist/` not committed
- QA — desktop 600vh pinned timing pass, mobile stacked gap pass, route transition pass, Helmet SEO pass

## Non-Goals

- New case studies or major narrative rewrites (future milestone)
- Contact form backend or third-party email/CRM wiring — only add if V4 sequencing justifies it
- Blog, CMS, i18n, or dark/light theme toggle — out of current scope
- Native app or SSR/SSG migration

## Ownership Boundaries

- `src/components/` + `src/hooks/` + `src/pages/Home/Home.tsx` — owns motion/reduced-motion and scroll performance
- `public/images/` + `src/index.css` + `tailwind.config.js` — owns asset sizing and styling budget
- `netlify.toml` + `vite.config.ts` — owns deploy and alias wiring
- `delivery-management/roadmap.md` — auto-updated when M3 scope shifts

## Execution Order

Sequence by dependency.

1. Baseline `npm run build` + `vite preview` and Lighthouse (performance, a11y, SEO) — record snapshot
2. Add `loading=lazy` + dimensions to `Projects.tsx` screenshots; re-measure `dist/` and LCP
3. Add `prefers-reduced-motion` guard (hook or `useReducedMotion`) to gate tilt/glare and pinned opacity transforms
4. Keyboard/a11y pass: Nav focus order, `aria-label` on carousel dots (`Go to project`), contrast sweep on `ghost` tokens
5. Netlify deploy verification: preview deploy, check `/_redirects` fallback for `/*` -> `index.html`, confirm Helmet canonical on each route
6. Regression sweep: desktop pin + portal opacities, mobile stacked no-overlap, route transitions, `npm run build` green with no new warnings

## Value Outcome

Delivers `product-management/value-map.md` outcome V5 — Visitor on any device experiences a fast, readable, deploy-stable portfolio that invites contact without friction. Delivery status is not a claim of visible value; the milestone is done only when the stakeholder feels polish as trust.

## Status

Not started

- Current status summary: Scoped only; performance and a11y passes not yet executed; single Lenis and single Router remain correct
- Remaining work: all scope above; size after `npm run build` is the gating metric

## Verification / Definition of Done

- `npm run build` passes; `vite preview` serves without console warnings and `/_redirects` SPA fallback holds on refresh at `/projects`, `/about`, `/contact`
- Lighthouse a11y >= 90, performance no regression from M1 baseline, `dist/` images not the dominant chunk without lazy sizing
- Manual: keyboard can operate Nav and carousel; `prefers-reduced-motion` disables parallax/tilt; Home pinned + stacked flows both clean; no duplicate Lenis instances in profiling
- Helmet canonical consistent across Home/Projects/About/Contact on preview deploy

## Regression Guardrails

- Do not create a second Lenis instance; keep single-owner invariant in `App.tsx:42`
- Keep `BrowserRouter` singleton and `AnimatePresence mode="wait"`; do not replace with hash router
- Preserve `useIsMobile` at 768px and mobile `Viewport` guards (`margin: "0px"`, `amount: 0.1`); negative margins re-introduce premature motion on mobile
- Never commit `dist/` or `.netlify/`; keep lockfile committed and use `npm ci` in CI
