# Milestone 2: Proof & Conversion Hardening

## Goal

A visitor who scrolls to Projects can verify shipped outcomes via live links and screenshots, and the About + Contact sections make reaching out the obvious next step.

## Scope

- `src/pages/Projects/Projects.tsx` — `projects` array content (Convertly, Trend Tribe, Jegz Menswear), `ProjectCard` tilt/glare (`rotateX`/`rotateY` via `useMotionValue`), canvas: `p-8 md:p-10`, `glass-strong`, accent line, desktop carousel via `activeIndex` + `AnimatePresence` vs mobile stack at `Projects.tsx:304`
- `public/images/` — commit `convertly.png`, `trendtribe.png`, `jegzmenswear.PNG`; `object-cover object-top` rendering; placeholder state when `image` is null
- `src/pages/About/About.tsx` — story copy (`I don't just build websites`), `skills` list with `itemVariants`, stat strip (`1 SaaS Built`, `∞ Problems Solved`, `100% Outcome-Driven`)
- `src/pages/Contact/Contact.tsx` — conversion CTA, channel links, standalone prop parity with Home pin
- Cross-cutting: `isMobileViewport` guard (<768) consistent across Projects/Home/About; `Helmet` canonical on Projects/About/Contact

## Non-Goals

- Full contact form with backend/email delivery (static portfolio scope; may defer to M3)
- Additional case studies beyond the three shipped projects (future scope)
- Image CDN migration or heavy optimization pass — handled in Milestone 3
- Blog, CMS, or dynamic content layering

## Ownership Boundaries

- `src/pages/Projects/Projects.tsx` — owns project proof UI and carousel/stack branching
- `src/pages/About/About.tsx` — owns credibility narrative
- `src/pages/Contact/Contact.tsx` — owns conversion surface
- `public/images/` — owns screenshot assets

## Execution Order

Sequence by dependency.

1. Lock `projects` data shape (`name`, `tagline`, `description`, `stack`, `link`, `status`, `image`, `accent`) and verify live URLs resolve
2. Implement `ProjectCard` tilt/glare and `AnimatePresence` carousel (desktop) vs `space-y-6` stack (mobile); validate at `Projects.tsx:304`
3. Add/commit screenshots to `public/images/`; test `object-cover` cropping and `lg:w-[340px] h-[240px]` sizing on both breakpoints
4. Harden About story + skills list and Contact CTA; confirm `standalone` renders identically to Home-pinned renders
5. Sweep `useIsMobile` consistency (768px) and `Viewport` guards (no negative margins on mobile)
6. Manual verification: carousel Prev/Next + dots, live outbound links (`target="_blank"`), image fallback placeholder, `npm run build` green

## Value Outcome

Delivers `product-management/value-map.md` outcomes V2 + V3 — Visitor can quickly assess shipped proof and finds a single clear path to contact; peer can assess technical breadth from stack tags. Delivery status is not a claim of visible value; the milestone is done only when the stakeholder feels the proof.

## Status

Partially complete

- Current status summary: Cards, carousel/stack, copy, and live links shipped; provisional screenshots committed but quality varies; Contact has CTA but no form/backend
- Remaining work: replace Provisional screenshots with cropped production captures, unify accent coverage, tighten About stat evidence, add outbound telemetry if needed, verify no image `CLS`

## Verification / Definition of Done

- `Projects.tsx:304` branching verified: mobile shows 3-card stack, desktop shows single-card carousel with Prev/Next + dot controls
- Each `project.link` opens `target="_blank"` and resolves (no 404); placeholder state renders when `image` is null
- About story + 6 skills + 3 stats render without overlap; motion (`itemVariants`, `whileInView`) fires once per viewport entry
- `npm run build` passes; `vite preview` shows no layout shift when images load
- Helmet title/meta/canonical on Projects and About honored

## Regression Guardrails

- Do not regress `isMobileViewport` threshold (768px); keep carousel/stack split synced with Home's `useIsMobile`
- Keep `public/images/` asset paths root-relative (`/images/...`); moving assets breaks production deploy
- Preserve motion viewport guards on mobile (`margin: "0px"`, `amount: 0.1`); negative margins cause premature fires on short viewports
