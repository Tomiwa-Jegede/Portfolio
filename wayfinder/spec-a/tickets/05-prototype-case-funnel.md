# Ticket: Prototype — Case study + funnel stub

> Label: `wayfinder:prototype` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** **Book 20 min → above form in case md, both links (card `View Case →` primary + case `View Live ↗` secondary), Turnstile inline (widget before submit) + `_gotcha` + 429 fallback.**

**Gist:** Cal above form keeps funnel primary before scroll; both links keep visitor for `PROJECT_CASE_VIEW` → `CAL_POPUP_OPEN` vs bail; Turnstile inline signals protection pre-submit, not after click. Prototype `wayfinder/spec-a/prototypes/case-funnel/` (`Stub.tsx` + `case-convertly.md`) validated flow `card → case md → Cal/form → success`.

**Human sign-off:** Lock: Book above form, both links, Turnstile inline — 2026-09-02.

**Unblocks:** Spec A map done (6/6); hands to `delivery-management/milestone-2.md` Proof & Conversion.

**Asset:** `wayfinder/spec-a/prototypes/case-funnel/README.md` + `Stub.tsx` (branch `research/case-funnel`).

## Question

How should the inline case study (`/projects/:slug` md, `View Project ↗` secondary) + Cal pop-up + hardened form look and behave together as one funnel — so a builder sees route, copy, guards, and telemetry wiring in a cheap clickable stub before spec locks?

## Context

- Needs content shape `01-grilling-case-content`, funnel copy+guard `02-grilling-funnel-spam-copy`, Cal embed `03-research-cal-embed`, telemetry schema `04-research-telemetry`; stacked story `wayfinder/MAP.md` holds anchor IDs.
- Prototype lives at `wayfinder/spec-a/prototypes/case-funnel/` — rough, not polished, enough to react to flow `card → case md → Cal/form → success`.

## Method

- HITL prototype: Skill `prototype`; build stub `wayfinder/spec-a/prototypes/case-funnel/` with 1 case (Convertly) md rendering via `src/pages/Projects/`, form with honeypot+Turnstile placeholder, Cal `data-cal-link` popup trigger, `lib/analytics.ts` event dispatches. Human reacts to flow, copy, and guard placement.

## Blocking

- Blocked by: `01-grilling-case-content`, `02-grilling-funnel-spam-copy`, `03-research-cal-embed`, `04-research-telemetry`
- Blocks: none (map closes when this prototype reaction locked; hands to `delivery-management/milestone-2.md`)

## Resolution criteria

- HITL: human reacts to stub, picks copy/guard/event flow winner; decision + prototype link recorded; map's `Not yet specified` WebP/testimonial fog graduates only if prototype proves need.

## References

- `Projects.tsx:14+191`, `Contact.tsx:43-104`, `wayfinder/spec-a/research/*`, `product-management/value-map.md:17-18`, `delivery-management/roadmap.md:47`
