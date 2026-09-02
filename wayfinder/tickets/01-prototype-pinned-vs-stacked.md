# Ticket: Prototype — Pinned 600vh vs Stacked Story

> Label: `wayfinder:prototype` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Prototype asset

- `wayfinder/prototypes/pinned-vs-stacked/README.md` — how to run `?story=pinned|stacked` + reduced-motion fallback
- `wayfinder/prototypes/pinned-vs-stacked/Prototype.tsx` — diff hunks for `App.tsx:74` MotionConfig, `useIsMobile` unify, `inert`+`aria-hidden` layers, `useReducedMotion` gate, `?story` switch, A1 headline copy

Prototype claimed and asset created; human reaction received 2026-09-02 — locked stacked.

## Resolution

**Decision:** Ship **stacked + sticky Nav as default**; keep pinned 600vh (`Home.tsx:101` DesktopHome) only via `?story=pinned` param; `prefers-reduced-motion` or `pointer:coarse` forces stacked fallback.

**Gist:** Stacked wins skim + a11y + keyboard + cmd+F + low-end jank vs pinned trap. A1 headline reads before scroll stacked vs animated out at `0.12` in pinned. Pinned retained as easter egg for flex, not default conversion path. `BuildSequence` `Home.tsx:209` kept but Skip visible in 1s + Esc (not ENTER-only) to satisfy escape.

**Asset:** `wayfinder/prototypes/pinned-vs-stacked/README.md` + `Prototype.tsx` (branch `research/pinned-vs-stacked`) — diff hunks for `MotionConfig`, unified `useIsMobile`, `inert`+`aria-hidden`, `?story` switch, A1 copy.

**Human sign-off:** yes — "go with recommendation" (stacked default, pinned opt-in, Skip 1s+Esc).

**Unblocks:** `05-grilling-escape-affordance` now frontier; follow-on Spec A can assume stacked anchor IDs `#about` `#projects` `#contact`.

## Question

What should the story delivery feel like — pinned 600vh immersive (`Home.tsx:101` `DesktopHome` with 7 `useTransform` thresholds + 3 portals) vs stacked `MobileHome` pattern lifted to desktop with sticky Nav + skippable `BuildSequence` — judged by a human reacting to a cheap prototype?

## Context

- Current DesktopHome traps skim-reader, blocks `cmd+F`, couples `activeSection` to `scrollYProgress` `Home.tsx:75-85`. MobileHome `Home.tsx:170` is honest stacked.
- Must keep `HeroOverlay.tsx:34` `scrollToSection` + `lenis.scrollTo` parity across both.
- Prototype assets: branch `research/pinned-vs-stacked` with two modes toggled by `?story=pinned|stacked` + `prefers-reduced-motion` fallback to stacked.

## Deliverable (prototype asset)

- Rough `wayfinder/prototypes/pinned-vs-stacked/` with both modes mountable, not polished styling — enough to react to scroll feel, skip affordance, and Nav `scrollToSection` behavior.

## Blocking

- Blocked by: `02-grilling-positioning-comprehension` (needs headline to test feel against) and `03-research-pinned-a11y` (a11y constraints inform prototype guards)
- Blocks: `05-grilling-escape-affordance` (escape shape depends on which story wins)

## Resolution criteria

- HITL session: human reacts to both modes, picks winner, notes why; decision + link to prototype branch recorded as resolution comment.

## References

- `Home.tsx:33-168`, `HeroOverlay.tsx:34-60`, `product-management/value-map.md:16` V1, `value-chain-opportunities/MAP.md:3` prefers-reduced-motion gap
