# Wayfinder — Spec A

## Purpose

Spec A wayfinding — inquiry funnel spec. Destination: review-ready spec for form+Cal+3 inline cases+telemetry that closes V2/V3 PARTIAL while stacked default holds.

## Ownership

Child of root `AGENTS.md` and `wayfinder/AGENTS.md`; `wayfinder/MAP.md` (Story Decision) is predecessor (closed 2026-09-02).

## Local Contracts

- `MAP.md` is `wayfinder:map` for Spec A (Destination, Notes, Decisions so far, Not yet specified, Out of scope).
- `tickets/` holds 6 child issues `01-grilling-case-content` → `06-task-metrics-gathering`; `05-prototype-case-funnel` blocked by 01+02+03+04 (+06 for metric).
- `research/` + `prototypes/` hold AFK assets; prototype HITL requires human reaction before close.
- Frontier = open + unblocked + unclaimed; one ticket per session except parallel `research` subagents.
- Refer by name: `[Ticket Title](link)` wraps id inside name.

## Work Guidance

- Breedth-first at charting done; now work frontier 01+02+03+04 in parallel where possible.
- Adopt prior decisions: A1 headline, stacked default, a11y guards, Form+Cal pop-up (B) from `wayfinder/research/contact-funnel-findings.md`.
- Graduate fog only when prototype proves need (WebP budget, testimonials).

## Verification

- `grep -R "wayfinder:" spec-a/tickets` shows 6 labelled tickets.
- Frontier query resolves after `01` → `06` → `05` chain.

## Child DOX Index

| Path | Owner | Purpose |
|---|---|---|
| `MAP.md` | spec-a/ | Spec A map |
| `tickets/` | spec-a/ | 6 decision tickets |
| `research/` | spec-a/ | AFK findings |
| `prototypes/` | spec-a/ | HITL stub |
