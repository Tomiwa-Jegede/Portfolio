# Ticket: Grilling — How should escape / skip affordance work?

> Label: `wayfinder:grilling` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** **Nav Skip 1s + Esc on BuildSequence, `?story=pinned|stacked` (stacked default, reduced/coarse forces stacked), `lenis.scrollTo({ immediate: prefersReducedMotion })`, `inert`+`aria-hidden` on inactive layers, `sessionStorage lastSection` honored.**

**Gist:** Escape lives in sticky Nav top-right pill (not Hero `pointer-events-none`), appears 1s, focus-visible + Esc close. Param `?story` read before `useIsMobile`; `prefers-reduced-motion`/`pointer:coarse` overrides to stacked per `03` guards. Scroll respects single Lenis `App.tsx:42`, no `window.scrollTo`; `inert` fixes ghost tab stops `Home.tsx:105-144`. Satisfies `roadmap.md:8` one-tap to contact on any device.

**Human sign-off:** lock — 2026-09-02 via grilling.

**Unblocks:** Follow-on Spec A (inline case + funnel) now clear to chart; this map's destination reached.

## Question

If the story stays pinned, how does the impatient visitor escape — `BuildSequence` skip (`Home.tsx:209`), sticky Nav `scrollToSection` `HeroOverlay.tsx:34`, `?story` param, reduced-motion fallback — so V3 contact stays reachable in one tap on any device per `roadmap.md:8` North Star?

## Context

- `Home.tsx:209` `buildComplete` gates story; `HeroOverlay:scrollToSection` already branches on `window.innerWidth <=768` for mobile vs Lenis `scrollTo`.
- Must respect single Lenis `App.tsx:42`, single Router, no `window.scrollTo` outside Lenis/motion contexts per `AGENTS.md:Cross-Module Contracts`.
- Decision depends on which story wins, hence blocked.

## Method

- HITL grilling: `grilling` + `domain-modeling`; walk 2 affordances (visible Skip in 1s + Nav section pills), decide default (pinned vs stacked) and fallback trigger (`prefers-reduced-motion` + `?story` + sessionStorage `lastSection` `Home.tsx:42` + `mobileScrollY`).

## Blocking

- Blocked by: `01-prototype-pinned-vs-stacked` and `03-research-pinned-a11y`
- Blocks: none (map closes after this decision, unblocks follow-on Spec map A)

## Resolution criteria

- HITL: chosen affordance shape + where it renders (`Nav.tsx` vs Hero) + param name + a11y test checklist; appended to map Decisions so far.

## References

- `Home.tsx:52-86`, `HeroOverlay.tsx:34-60`, `Nav.tsx`, `delivery-management/roadmap.md:8`, `AGENTS.md:Cross-Module Contracts`
