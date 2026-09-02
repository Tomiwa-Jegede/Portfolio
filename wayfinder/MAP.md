# Wayfinder Map — Portfolio Story Decision

> Label: `wayfinder:map` | Tracker: `local-markdown` at `wayfinder/` | Created: 2026-09-02

## Destination

Locked decision on portfolio story delivery — **pinned 600vh immersive (`Home.tsx:101` DesktopHome) vs stacked + sticky Nav with skippable `BuildSequence` (`Home.tsx:209`)** — proven by a 5-sec recall test that a first-time visitor can describe Victor as "revenue systems, not just websites" and reach shipped proof (`Projects.tsx:14`) without feeling trapped. Map done when decision, rationale, and resulting spec delta for inline case studies + funnel are review-ready, with no open decision blocking someone from speccing `product-management/value-map.md` V2/V3 funnel.

## Notes

- Domain: portfolio SPA — React 18 + Vite 5 + TS 5 + Tailwind 3 + Framer Motion 11 + GSAP 3 + Lenis 1 + React Router 6 + Helmet; `src/` owns scroll/motion/route per `AGENTS.md:Frontend Direction`
- Skills every session consults: `product-brainstorming` (assumption testing / HMW), `ui-ux-pro-max` (motion, a11y, 768px breakpoint)
- Standing prefs: keep single Lenis `App.tsx:42`, single `BrowserRouter` `App.tsx:77`, `AnimatePresence mode="wait"` `App.tsx:23`, 768px guard consistent `Home.tsx:19` + `Projects.tsx:11` + `About.tsx:14`, `npm run build` must pass, no `window.scrollTo` outside Lenis context
- Plan, don't do: this map produces decisions + prototype, not landed change (override only via Notes amendment)

## Decisions so far

<!-- index: one line per closed ticket, gist + link; decision lives in ticket, map only points -->

- [Grilling — What does visitor need to comprehend in 15 seconds?](tickets/02-grilling-positioning-comprehension.md): Locked A1 "Revenue systems that don't leak leads." + sub "3 shipped → see case + live" — outcome-led beats stack-led; tested via 5-sec recall (4/5 must recall "revenue/leak"), challenger A2 kept as fallback.
- [Research — Pinned storytelling a11y + skim behavior](tickets/03-research-pinned-a11y.md): 6 constraints mapped — `MotionConfig reducedMotion="user"` + `useReducedMotion` gates scale/portals, Lenis `respectReducedMotion`, stacked fallback for reduce/coarse, `inert`+`aria-hidden` on inactive layers, unify `useIsMobile(768)`, gate `cursor-none`; asset `wayfinder/research/pinned-a11y-findings.md`.
- [Research — Contact funnel options before speccing](tickets/04-research-contact-funnel.md): Formspree hashid drift vs `value-map.md:25` patched; recommends Form+Cal popup (B) + Turnstile + typed funnel events; asset `wayfinder/research/contact-funnel-findings.md` feeds Spec A.
- [Prototype — Pinned 600vh vs Stacked Story](tickets/01-prototype-pinned-vs-stacked.md): **Stacked + sticky Nav ships as default**, pinned 600vh only via `?story=pinned`, reduced-motion/coarse forces stacked; Skip visible in 1s + Esc on `BuildSequence`; asset `wayfinder/prototypes/pinned-vs-stacked/` with `?story` switch + `MotionConfig` + `inert` guards; A1 headline tested.
- [Grilling — How should escape / skip affordance work?](tickets/05-grilling-escape-affordance.md): Locked Nav Skip pill 1s + Esc, `?story=pinned|stacked` (stacked default, reduced forces stacked), `lenis.scrollTo({ immediate })`, `inert`+`aria-hidden` on inactive layers, `lastSection` honored — one-tap to contact holds.

## Not yet specified

<!-- fog _toward_ destination: in-scope but not yet sharp enough to ticket; graduates as frontier advances -->

- Inline case study route shape — `/projects/:slug` md spec, external `View Project ↗` as secondary CTA; fog until story delivery decides where deep proof lives
- Funnel telemetry spec — `VIEW_PROJECT_CLICK` + `CONTACT_SUBMIT` + `CAL_BOOK` events; fog until contact affordance decided
- Image performance budget — WebP/`loading=lazy`/`width/height` for `public/images/*` 5.1MB PNG; deliberately deferred to M3, not this decision map, but noted if story choice changes asset budget
- Testimonial / social proof sourcing — whether to add logos/quotes to close SMB trust gap; fog until proof shape settled

## Out of scope

<!-- ruled beyond destination; never graduates; if ticket mis-scoped, close it and list here with link -->

- Backend, DB, auth, CMS, SSR, native apps, payments, fulfillment — `product-management/value-map.md:Deliberately not promised`
- Blog / writing surface `/writing` (`value-chain-opportunities/MAP.md:7`) — separate effort after conversion funnel
- Full contact backend beyond Formspree + Cal link — handled in follow-on Spec map (A)
- Netlify perf/header hardening beyond verifying SPA fallback — belongs to follow-on Polish map
