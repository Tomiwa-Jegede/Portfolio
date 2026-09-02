# Ticket: Research — Cal.com embed choice

> Label: `wayfinder:research` | Type: AFK | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** **Element-click popup `data-cal-link="victor/30min"` wins** — inline eager breaks stacked, floating collides `Cursor`/`Nav`.

**Gist:** Popup defers iframe to click (~50-80kB cached, 0 npm bytes), `MotionConfig reducedMotion="user"` gates trigger, modal `Esc` closes, full-sheet on mobile `768px`, brandColor `#7c3aed`, event `victor/30min` 30m/15m buffer/30m interval/4h notice, GCal sync. Per-route canonical fix `Contact.tsx:81` → `/contact` (and `/projects`, `/about`) required before prod telemetry; `npm run build` green 415 modules.

**Asset:** `wayfinder/spec-a/research/cal-embed-findings.md` (async loader + `data-cal-namespace` snippet).

**Method:** AFK research subagent, `cal.com/embed` docs, bundle/a11y/768px/reduced-motion matrix.

## Question

Which Cal.com embed (`cal.com/embed` inline vs floating button vs element-click popup) best fits stacked story + `Contact.tsx` without adding a backend, and what event config (`victor/30min`) + `prefers-reduced-motion` + `Helmet` per-route canonical implications must be decided before spec?

## Context

- `wayfinder/research/contact-funnel-findings.md` recommends element-click popup but left embed variant open; needs docs read, not human taste.
- Must keep `npm run build` green, no `window.open` outside Lenis context, `Contact.tsx:81` canonical fix per route.

## Method

- AFK research subagent: invoke Skill `research`; read `cal.com/embed` docs (inline, `cal` floating, `data-cal-link` popup), check bundle impact (`vite build` size), `Helmet` canonical per route pattern, local `Contact.tsx` + `App.tsx:77` router.

## Blocking

- Blocked by: none (frontier, parallelizable)
- Blocks: `05-prototype-case-funnel` (prototype needs embed choice)

## Resolution criteria

- AFK: comparison (bundle, a11y, mobile 768px, reduced-motion) + recommendation + event config snippet; asset at `wayfinder/spec-a/research/cal-embed-findings.md`; link from ticket, no close beyond findings.

## References

- `Contact.tsx`, `App.tsx:77`, `wayfinder/research/contact-funnel-findings.md`, `wayfinder/MAP.md` stacked decision
