# Ticket: Research — Pinned storytelling a11y + skim behavior

> Label: `wayfinder:research` | Type: AFK | Status: closed | Assignee: wayfinder-agent | Closed: 2026-09-02

## Resolution

**Findings:** 6-constraint matrix (reduced-motion, keyboard, SR, cmd+F, jank, 768px mismatch) with lightweight guards: `MotionConfig reducedMotion="user"` at `App.tsx:74` + `useReducedMotion()` to gate `scale`/portal `opacity`, Lenis `respectReducedMotion:true` (forces lerp 1), fallback to stacked `MobileHome` when `shouldReduceMotion` or `pointer:coarse`, unify `useIsMobile(768)` via shared `matchMedia` hook, `inert` + `aria-hidden` on inactive `absolute inset-0` layers `Home.tsx:105-144`, gate `Cursor.tsx` `cursor:none` behind reduced-motion check, sticky Skip + Esc on `BuildSequence`.

**Asset:** `wayfinder/research/pinned-a11y-findings.md` (branch `research/pinned-a11y`) — 225 lines, checkout pointer header links prototype `01` and escape `05`. No decision beyond guard choice; prototype must adopt guards or justify exception.

**Method:** AFK research subagent invoked Skill `research`; read MDN + framer-motion + Lenis + local `Home.tsx:33-168` + `App.tsx:36-77`.

## Question

What are the accessibility, reduced-motion, and skim-reading constraints that should bound any pinned 600vh story — `prefers-reduced-motion`, keyboard, screen reader, `cmd+F`, low-end Android — and what lightweight precedents/patterns resolve them without killing motion?

## Context

- Current `Home.tsx:90-98` thresholds + portals have no `prefers-reduced-motion` guard; `cursor-none` on `ProjectCard.tsx:138` breaks keyboard; `useIsMobile` 768px split risks mismatch.
- Needs docs + local codebase read; no external API provisioning.

## Method

- AFK research subagent: invoke Skill `research`; read `framer-motion` `useReducedMotion`, Lenis a11y notes, MDN `prefers-reduced-motion`, local `Home.tsx` + `App.tsx:42` Lenis singleton. Capture findings on branch `research/pinned-a11y`.

## Blocking

- Blocked by: none (frontier, parallelizable)
- Blocks: `01-prototype-pinned-vs-stacked` (prototype must respect guards), `05-grilling-escape-affordance`

## Resolution criteria

- AFK: findings markdown linked from issue, context pointer to map; concrete guard recommendations (when to fall back to stacked, how to preserve `AnimatePresence` + `Suspense`).

## References

- `Home.tsx:90-98`, `App.tsx:42+77`, `ProjectCard.tsx:138`, `delivery-management/milestone-1.md:Regression Guardrails`
