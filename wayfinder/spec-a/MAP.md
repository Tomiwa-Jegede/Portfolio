# Wayfinder Map — Inquiry Funnel Spec (Spec A)

> Label: `wayfinder:map` | Tracker: `local-markdown` at `wayfinder/spec-a/` | Created: 2026-09-02 | Follows: [`Portfolio Story Decision`](../MAP.md) (closed 2026-09-02, 5 decisions)

## Destination

**Review-ready spec** for inquiry funnel that closes `product-management/value-map.md:17-18` V2/V3 PARTIAL while stacked `?story` default holds — **form (hardened, Turnstile + honeypot + 429) + Cal.com pop-up via element click + 3 inline case studies (`/projects/:slug` with 1 outcome metric each) + typed telemetry (`VIEW_PROJECT_CLICK`, `CONTACT_SUBMIT`, `CAL_BOOKED`) with provider choice** — that a builder can implement in one slice without reopening a positioning or story-delivery decision. Map done when spec, copy, event schema, and route + guard choices are locked and linkable for `delivery-management/milestone-2.md` handoff.

## Notes

- Domain: portfolio SPA — React 18 + Vite 5 + Tailwind 3 + Framer Motion 11 + Lenis 1 + Router 6 + Helmet; `src/` owns route/motion, `public/images/*` owns assets per `AGENTS.md:Frontend Direction`; stacked default via `wayfinder/MAP.md` decision (stacked + `MotionConfig reducedMotion="user"` + `inert`)
- Skills every session consults: `product-brainstorming` (HMW, JTBD, assumption testing), `ui-ux-pro-max` (form UX, card, telemetry UX, 768px)
- Standing prefs: keep single Lenis `App.tsx:42`, single `BrowserRouter` `App.tsx:77`, `npm run build` must pass, `@` alias `vite.config.ts:8`, `Helmet` per-route canonical (fix duplicate `https://vctdev.netlify.app/`), no secrets committed
- Plan, don't do: spec + prototype stub, not landed change; `Contact.tsx:43` Formspree hashid stays public, no backend
- Adopt prior decisions: A1 headline "Revenue systems that don't leak leads." (`02-grilling`), stacked + Skip 1s+Esc (`01`+`05`), a11y guards (`03`), Cal popup recommendation (`04` → `wayfinder/research/contact-funnel-findings.md`)

## Decisions so far

<!-- index: one line per closed ticket, gist + link -->

- [Grilling — Inline case study content shape](tickets/01-grilling-case-content.md): Locked md shape `Problem→System→Outcome (metric+source)` + stack pill + Live ↗ secondary; metrics Convertly demo 100+ msgs, Trend Tribe pilot 2s filter @100, Jegz Live ✓ — honest `estimate` tag over `∞`.
- [Grilling — Funnel copy + spam guard choice](tickets/02-grilling-funnel-spam-copy.md): Locked `Get a 24h reply` + "I reply within 24h — Cal is faster." + `Book 20 min →` Cal popup + `_gotcha` + Turnstile + `vctdev.netlify.app` restrict + 429 fallback.
- [Research — Cal.com embed choice](tickets/03-research-cal-embed.md): Element-click popup `victor/30min` — defers iframe, `Esc` modal, stacked-safe, brand `#7c3aed`, + per-route canonical fix `/contact`; asset `wayfinder/spec-a/research/cal-embed-findings.md`.
- [Research — Telemetry provider + event schema](tickets/04-research-telemetry.md): Plausible primary ~2kB `tagged-events.js` + GA4 fallback via `lib/analytics.ts` union `VIEW_PROJECT_CLICK`/`CONTACT_FORM_*`/`CAL_*` + `canonicalFor(path)` fix + `bufferEvent`; asset `wayfinder/spec-a/research/telemetry-findings.md`.
- [Task — Gather outcome metrics for 3 cases](tickets/06-task-metrics-gathering.md): Returned 3 honest metrics — Convertly demo 100+ msgs (`estimate`), Trend Tribe pilot 2s @100 (`pilot`), Jegz Live ✓ — sources loom/pilot/live, tag over `∞`; unblocks prototype.
- [Prototype — Case study + funnel stub](tickets/05-prototype-case-funnel.md): Locked Book above form + both links (View Case primary / View Live secondary) + Turnstile inline + _gotcha + 429; prototype `wayfinder/spec-a/prototypes/case-funnel/` validates `card→case→Cal/form→success` flow; hands to `delivery-management/milestone-2.md`.

## Not yet specified

<!-- fog toward destination: in-scope but not yet sharp to ticket; graduates as frontier advances -->

- Testimonial / logo sourcing — whether 1 quote per case lifts V3 trust enough to add sourcing ticket; fog until case content locked
- WebP + `loading=lazy` + `width/height` budget for `public/images/*` 5.1MB PNG — `value-chain-opportunities/MAP.md:3` #3; noted but deliberately not ticketed until case asset list locks (otherwise budget floats)
- Netlify perf/header hardening beyond SPA fallback — `netlify.toml` headers already correct; deferred to Polish map, not this spec

## Out of scope

<!-- ruled beyond destination; never graduates -->

- Pinned 600vh story re-litigation — locked stacked via `wayfinder/MAP.md`; only `?story=pinned` param remains, no new pinned tickets
- Positioning re-litigation — A1 headline locked `02-grilling`; only case sub-copy may iterate
- Backend, DB, CMS, SSR, native apps, payments, fulfillment — `product-management/value-map.md:Deliberately not promised`
- Blog `/writing` surface (`value-chain-opportunities/MAP.md:7`) — separate effort after funnel
- WA `wa.me` as primary funnel — deferred per `04-research-contact-funnel` (tertiary only), not this spec
