# Ticket: Grilling — What does visitor need to comprehend in 15 seconds?

> Label: `wayfinder:grilling` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Closed: 2026-09-02

## Resolution

**Decision:** Locked **A1 "Revenue systems that don't leak leads."** as hero headline; sub "3 shipped — Convertly, Trend Tribe, Jegz Menswear → see case + live"; eyebrow retains "Full Stack Developer" as pill, not headline.

**Gist:** Outcome-led beats stack-led (B generic) and process-led (C verbose) in 5-sec recall JTBD for hiring manager + SMB founder. Assumes "revenue systems" resonates — disproved if <4/5 in recall test say "developer/website" instead. Cheapest test: 5-sec test with 5 peers (2 hiring managers, 2 SMB founders, 1 peer dev); pass if ≥4 recall "revenue/leak" verbatim. Challenger A2 "I turn leaking leads into booked revenue" kept as fallback.

**Asset:** No code asset; resolution lives here. Unblocks `01-prototype-pinned-vs-stacked` (now tests A1 headline) and `04-research-contact-funnel` (funnel copy adopts A1 promise).

**Human sign-off:** yes — 2026-09-02 via grilling session.

## Question

What must a first-time visitor (hiring manager vs SMB founder) actually comprehend in 15 seconds to advance to proof — is "revenue systems, not just websites" (`HeroOverlay.tsx` eyebrow, `About.tsx:72`) the right positioning, and what headline + outcome language would pass a 5-sec recall test?

## Context

- Current eyebrow is generic "Full Stack Developer · Revenue Systems" `HeroOverlay.tsx`; About story leads with `Convertly` feature list, not outcome metric.
- JTBD: hiring manager scanning 12 portfolios needs shipping evidence + judgment, not animation; SMB needs leak-fix narrative.
- Must choose language to test against pinned vs stacked prototype — unblocks prototype fidelity.

## Method

- HITL grilling: call Skill `grilling` + `domain-modeling`; explore 3 headline variants (outcome-led, stack-led, metric-led), name riskiest assumption ("revenue systems resonates"), cheapest test (5-sec test with 5 peers).
- Keep 768px and Helmet constraints from Map Notes.

## Blocking

- Blocked by: none (frontier)
- Blocks: `01-prototype-pinned-vs-stacked`, `04-research-contact-funnel` (funnel copy depends on positioning)

## Resolution criteria

- HITL session: 3 headline candidates + chosen 5-sec test protocol + participant pool; decision gists to map Decisions so far, full variants live in ticket resolution.

## References

- `HeroOverlay.tsx`, `About.tsx:72-80`, `product-management/value-map.md:16-18` V1-V3, `delivery-management/roadmap.md:8` North Star
