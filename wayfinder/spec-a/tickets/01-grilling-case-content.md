# Ticket: Grilling — Inline case study content shape

> Label: `wayfinder:grilling` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** Locked md shape `Problem → System (3 bullets) → Outcome (single metric + source/estimate tag) → Stack pill row + Live ↗ secondary (telemetry VIEW_PROJECT_CLICK)`. Metrics as proposed: Convertly `Demo: 100+ msgs auto-answered + booking→follow-up (estimate/demo)`, Trend Tribe `3-student pilot: 2s filter @100 listings`, Jegz `Live store ✓ (Flutterwave checkout)` until order count shareable. Replaces `About.tsx:147` `∞/100%`.

**Gist:** Outcome metric beats stack list for V2/V3; honest `estimate` tag > `∞`; inline case keeps visitor for CAL/contact funnel vs bail to external; external link secondary after `PROJECT_CASE_VIEW`.

**Human sign-off:** lock shape + metrics as proposed — 2026-09-02.

**Unblocks:** `05-prototype-case-funnel` (needs content) and `06-task-metrics-gathering` (needs metric slot).

## Question

What must each inline case study (`/projects/:slug` md route, `View Project ↗` as secondary) contain to turn `Projects.tsx:14` feature lists into business-outcome proof that closes `value-map.md:17-18` V2/V3 PARTIAL — and what single outcome metric per case (Convertly, Trend Tribe, Jegz) is credible enough to replace `∞`/`100%` `About.tsx:147`?

## Context

- Current `Projects.tsx:14` tagline + description are stack/feature-led, no metric; `About.tsx:147` stats `1/∞/100%` undermine trust per audit.
- Needs JTBD + domain-modeling; stacked story `wayfinder/MAP.md` decision holds anchor IDs `#about` `#projects` `#contact` for case entry.
- Inline case keeps visitor (vs bail to external live site) — needed for `VIEW_PROJECT_CLICK` → `CONTACT_SUBMIT` funnel.

## Method

- HITL grilling: `grilling` + `domain-modeling`; explore 3 JTBD variants per case (hiring manager evidence vs SMB leak fix), draft md shape (problem → system → outcome → stack pill → live link + telemetry hook), name metric source for each project and fallback if no hard number.

## Blocking

- Blocked by: none (frontier)
- Blocks: `05-prototype-case-funnel` (prototype needs content shape), `06-task-metrics-gathering` (metrics to source)

## Resolution criteria

- HITL: locked md outline (headings + metric slot per case) + chosen metric per project with source or honest estimate range + external link as secondary CTA decision; gists to map, outline lives in ticket.

## References

- `Projects.tsx:14-79`, `About.tsx:72-147`, `product-management/value-map.md:17-18`, `wayfinder/research/contact-funnel-findings.md`, `HeroOverlay.tsx` A1 headline
