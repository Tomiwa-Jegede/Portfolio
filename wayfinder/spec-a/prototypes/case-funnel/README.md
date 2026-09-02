# Prototype — Case Study + Funnel Stub

> Ticket: [Prototype — Case study + funnel stub](../../tickets/05-prototype-case-funnel.md) | Branch: `research/case-funnel` | Type: `wayfinder:prototype` HITL | Date: 2026-09-02

## How to use

Cheap clickable stub — not polished. Shows `card → inline case md (/projects/:slug) → Cal/form → success` flow with copy/guard/telemetry wiring from tickets 01+02+03+04+06.

```
npm run dev
# Card with telemetry: http://localhost:5173/projects
#   click card → /projects/convertly (md) → scroll to outcome metric
# Case md: http://localhost:5173/projects/convertly
#   problem → system → outcome (100+ msgs estimate) → stack pill → View Live ↗ (secondary) + Book 20 min → + form Get a 24h reply
```

**React to:**
- Does inline case keep you vs bail to external `View Live ↗` immediately? Where should secondary live link sit?
- Does `Get a 24h reply` + "I reply within 24h — Cal is faster." + `Book 20 min →` feel like one funnel vs two CTAs?
- Does honeypot `_gotcha` + Turnstile placeholder feel present (prototype shows widget area, not real verification)?
- Telemetry: `VIEW_PROJECT_CLICK` on card, `PROJECT_CASE_VIEW` on case mount, `CAL_POPUP_OPEN` on Cal pill — does flow feel tracked without being noisy?

## What the stub contains

See `Stub.tsx` + `case-convertly.md`:

- `Projects.tsx:193` card adds `onClick={() => analytics.track({type:"VIEW_PROJECT_CLICK", project:"convertly"})}` + `data-cal-link` not yet — case owns Cal
- `src/pages/Projects/Convertly.tsx` (stub md): `problem` 1 leak sentence, `system` 3 bullets, `outcome` metric `Demo 100+ msgs estimate` from `06-task-metrics-gathering`, stack pills `Projects.tsx:21`, secondary `View Live ↗` (`target="_blank"`), Cal `data-cal-link="victor/30min"` + `data-cal-namespace`
- `Contact.tsx:43` form shows honeypot `<input name="_gotcha" tabindex="-1" autocomplete="off" style="display:none">` + Turnstile placeholder `<div data-turnstile-sitekey="VITE_TURNSTILE_KEY">` + 429 branch "Busy — try Cal"
- `lib/analytics.ts` typed union `AnalyticsEvent` + `useCalEmbed()` loader + `MotionConfig reducedMotion="user"` gating per `03-research-pinned-a11y`
- Per-route `Helmet` canonical `https://vctdev.netlify.app/projects/convertly` (not `https://vctdev.netlify.app/` drift per `04-research-telemetry`)

## Decision you lock

React and tell me:

1. **Case CTA order:** Keep `Book 20 min →` above form in case md, or below form?
2. **Live link:** Secondary after outcome as spec'd, or keep primary on card and secondary in case (both)?
3. **Guard UX:** Show Turnstile inline vs after submit click?

Your reaction = resolution for 05; map then done and hands to `delivery-management/milestone-2.md`.

## Wiring

- Adopted: `01` case shape+metrics, `02` copy+Turnstile+Cal, `03` element-click popup, `04` Plausible+`lib/analytics.ts`, `06` honest metrics.
- Next: spec hands to `milestone-2.md` Proof & Conversion + `milestone-3.md` Polish (WebP 5.1MB fog stays until case asset list — deliberately not in this map).

## Files

- `Stub.tsx` — diff excerpt
- `case-convertly.md` — md shape for 1 case (replicate for Trend Tribe, Jegz)
- `README.md` — this file
