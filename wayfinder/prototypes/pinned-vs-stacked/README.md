# Prototype — Pinned 600vh vs Stacked Story

> Ticket: [Prototype — Pinned 600vh vs Stacked Story](../../tickets/01-prototype-pinned-vs-stacked.md) | Branch: `research/pinned-vs-stacked` | Type: `wayfinder:prototype` HITL | Date: 2026-09-02

## How to use this prototype

This is a **cheap, rough artifact** to react to — not polished code. Two modes, same content (A1 headline), different delivery. Run locally and toggle via `?story=` param; `prefers-reduced-motion` forces stacked.

```
npm run dev
# Pinned (current): http://localhost:5173/?story=pinned
# Stacked (challenger): http://localhost:5173/?story=stacked
# Reduced-motion (OS setting → stacked fallback): test in DevTools Rendering → Emulate prefers-reduced-motion
```

**What to react to:**
- Can you skim to proof in <15s without scrolling 600vh sequentially? Try `cmd+F` "Convertly" in each mode.
- Does pinned feel premium or trapped on trackpad vs stacked sticky Nav?
- Does A1 headline "Revenue systems that don't leak leads." read before scroll in both?
- Keyboard: Tab through Nav → Projects → Contact in each; note ghost stops.

## What changed for the prototype

See `Prototype.tsx` — minimal diff on `src/pages/Home/Home.tsx:33-168`:

- `Home.tsx:15` → `useIsMobile()` unified via `matchMedia("(max-width: 768px)")` (fixes `Projects.tsx:11` mismatch per `wayfinder/research/pinned-a11y-findings.md`).
- `App.tsx:74` → `MotionConfig reducedMotion="user"` wrapper + `useReducedMotion()` hook gates `scale` and portal `opacity` → `scale = 1` and `opacity: 0→1` only (no scale) when reduced.
- `Home.tsx:101` → `?story` switch: `story=pinned` renders `DesktopHome` 600vh `sticky` with 7 `useTransform`; `story=stacked` renders `MobileHome` lifted to desktop (flex stacked, sticky Nav always `pointer-events-auto`, no portals).
- `Home.tsx:105-144` → inactive `absolute inset-0` layers get `inert` + `aria-hidden="true"` + `tabIndex=-1` when `activeSection !== id` (fixes ghost tab stops per a11y findings).
- `Cursor.tsx` + `ProjectCard.tsx:138` → `motion-safe:cursor-none` (only when `!useReducedMotion() && matchMedia("(pointer: fine)").matches`).
- `Nav.tsx` → `scrollToSection` uses `lenis.scrollTo({ immediate: lenis.prefersReducedMotion })` not `window.scrollTo`.
- `HeroOverlay.tsx` → eyebrow now A1 headline + sub "3 shipped → see case + live" (from ticket 02 decision).

## Decision you are asked to make (grilling)

React to both modes and tell me:

1. **Pick pinned or stacked as default** — which one would you ship as `?story` default (keep other as `?story=` escape)?
2. **Why in one line** — what did pinned trap vs stacked lose in storytelling?
3. **Keep BuildSequence?** — `Home.tsx:209` `buildComplete` gate: keep ENTER, make Skip visible in 1s, or drop for stacked?

Your answer = resolution for ticket 01; I will close it and unblock `05-grilling-escape-affordance`.

## Wiring to map decisions

- Adopted: `02-grilling-positioning-comprehension` A1 headline, `03-research-pinned-a11y` guard recommendations.
- Next: `05-grilling-escape-affordance` shape depends on winner (Skip button placement, Nav pills, `Esc` handling).
- Follow-on: Spec A (inline case + funnel) assumes stacked or pinned anchor IDs `#about` `#projects` `#contact` — prototype preserves both.

## Files

- `Prototype.tsx` — diff excerpt (not wired, copy to repo to test)
- `README.md` — this file
