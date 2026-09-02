# Research Findings — Pinned 600vh Story: a11y, reduced-motion, skim constraints

> Branch: `research/pinned-a11y` | Ticket: [`03-research-pinned-a11y`](../tickets/03-research-pinned-a11y.md) | Map: [`wayfinder/MAP.md`](../MAP.md) | Date: 2026-09-02 | Type: `wayfinder:research` (AFK)

## Checkout pointer

Findings live on this branch at `wayfinder/research/pinned-a11y-findings.md`. Prototype ticket [`01-prototype-pinned-vs-stacked`](../tickets/01-prototype-pinned-vs-stacked.md) and grilling ticket [`05-grilling-escape-affordance`](../tickets/05-grilling-escape-affordance.md) should read this file before choosing thresholds or escape affordances. No ticket closed here — this is the AFK asset that unblocks them.

---

## 1. What bounds the pinned story

### Current implementation under audit

- `src/pages/Home/Home.tsx:33-168` — `DesktopHome` renders a single `600vh` sticky container (`Home.tsx:101`) with four overlapping `absolute inset-0` layers (hero + about + projects + contact) plus three `bg-black` portal overlays. Visibility is driven by eight `useTransform(sy!, [in, out], [0,1,0])` + scale transforms (`Home.tsx:90-98`), toggled via `scrollYProgress` thresholds (`0.14–0.84`). Pointer-events are flipped with `activeSection` derived from `useMotionValueEvent(scrollYProgress)` at `Home.tsx:75`.
- `src/App.tsx:36-85` — Lenis singleton (`duration 1.2`, `easing`, `smoothWheel: true`, `syncTouch: false`) drives a shared `scrollYProgress: MotionValue<number>` via `LenisScrollContext`. `AnimatePresence mode="wait"` (`App.tsx:23`) and `Suspense` (`App.tsx:79`) wrap all lazy routes.
- `src/pages/Projects/Projects.tsx:138` — `cursor-none` on `ProjectCard`; `src/components/ui/Cursor.tsx:26` also sets `document.documentElement.style.cursor = "none"` globally.
- `delivery-management/milestone-1.md:62-67` — Regression guardrails require no second Lenis, single `BrowserRouter`, 768px guard consistency, `AnimatePresence mode="wait"` + `Suspense` preservation.

### Constraint matrix

| Constraint | Failure mode in current pin | Severity | Standard / precedent |
|---|---|---|---|
| **`prefers-reduced-motion: reduce`** (MDN, WCAG 2.3.3) | No guard. All 8 `useTransform` + `scale` + portal fades fire regardless. `index.css:159` has a blunt `*{animation-duration:0.01ms}` override but does not neutralize `useTransform`/`Lenis` motion or sticky height. Vestibular trigger: scale 0.9→1.08 on full-screen layers. | High — legal/UX debt; ~10-15% OS-level signal. | MDN `prefers-reduced-motion`; Motion `useReducedMotion` + `MotionConfig reducedMotion="user"`; Lenis `respectReducedMotion` (default `true`). |
| **Keyboard / focus order** | Inactive layers use `opacity:0` + `pointer-events-none` but remain in DOM with focusable children (`<a>` View Project, Contact form). Tab lands on invisible controls (ghost tab stops). No `inert`/`aria-hidden`/`tabIndex` gating. `cursor-none` hides native cursor even for keyboard users. | High — WCAG 2.4.3, 2.4.7 failure; trapped narrative. | `inert` attribute (Chrome 102+, polyfill), `aria-hidden="true"` + roving `tabIndex=-1`, or unmount via `AnimatePresence`. Cursor only for `pointer: fine`. |
| **Screen reader / semantics** | All sections always present; portals are `pointer-events-none` but not `aria-hidden`. SR announces off-screen content regardless of scroll position. No skip link, no live region for section changes, `data-active-section` is not announced. | Medium — sane DOM order partially mitigates, but misleading. | `aria-hidden` on inactive layers, single `<main>` with `<section id>` anchors, `aria-live="polite"` on active label, skip-to-content link. |
| **`cmd+F` / find-in-page** | Sticky `overflow-hidden` container: browser finds text in opacity-0 layers, scrolls native viewport but `scrollYProgress` may not reach threshold, so highlight is invisible. User perceives broken find. | Medium — discoverability. | Either stacked fallback for reduced-motion, or anchor-based nav (`#about`) that forces scroll, or drop pin for findable flow. |
| **Low-end Android / jank** | 600vh sticky + 8 interpolations + Lenis raf + canvas particle cursor (`Cursor.tsx:136`) on main thread. `syncTouch: false` means Lenis does not smooth touch inertia, but raf still runs. Canvas particles every 2 frames stress GPU on low-end devices. | Medium — perf. | Lenis auto-handles reduced-motion; `useReducedMotion` to skip scale/particle; `@media (max-width:767px)` already falls back to `MobileHome`. |
| **768px mismatch** | `Home.tsx:19` uses `matchMedia("(max-width: 768px)")` with `change` listener. `About.tsx:14` / `Projects.tsx:11` use imperative `window.innerWidth < 768` evaluated per-render, no listener, off-by-one (768 exact). On SSR/hydration `isMobile === null` flashes `null`; Projects may render carousel when Home rendered mobile stack. | Medium — layout sync per `delivery-management/milestone-1.md:66`. | Single shared `useIsMobile(768)` hook; reuse everywhere or derive from same `matchMedia`. |
| **Skim / trapped feeling** | No escape: must scroll 600vh sequentially. `BuildSequence` blocks entry until ENTER (`Home.tsx:209`). Nav `handleNavClick` (`Nav.tsx:63`) uses `window.scrollTo` not `lenis.scrollTo`, desyncing `scrollYProgress`. No progress affordance beyond `ScrollProgressBar`. | Medium — conversion risk. | Skip link, sticky Nav always interactive, hash anchors, `05-grilling-escape-affordance` precedent: "skip story → projects" button. |

---

## 2. Precedents & lightweight patterns that preserve motion

### 2a. `prefers-reduced-motion` — do not kill motion, degrade gracefully

**Docs consulted:**
- MDN `prefers-reduced-motion` (Baseline 2020): `reduce` = remove/replace non-essential motion; scaling/parallax are vestibular triggers. CSS `animation: dissolve` (opacity) is safe replacement.
- Motion for React `useReducedMotion` (motion.dev): hook returns `boolean`, responds live to OS toggle, re-renders. Docs explicitly recommend replacing `x`/`scale` with `opacity` when `shouldReduceMotion`.
- Motion `MotionConfig reducedMotion="user"` — blanket mode: automatically disables `transform`/`layout` animations, preserves `opacity`/`backgroundColor`. Framer (site builder) uses this.
- Lenis README `respectReducedMotion: true` (default): when `prefers-reduced-motion: reduce`, Lenis forces `lerp=1` (1:1 scroll), `scrollTo` jumps `immediate: true`, but keeps running for WebGL/sync. Opt-out `respectReducedMotion: false` is discouraged. Getter `lenis.prefersReducedMotion` available.

**Recommended pattern for this repo (no AnimatePresence/Suspense rewrite):**

```tsx
// App.tsx — site-wide blanket + keep singleton
import { MotionConfig } from "framer-motion";
export default function App() {
  // Lenis already respects reduced motion by default — leave it.
  // Optional explicit: new Lenis({ respectReducedMotion: true, ... })
  return (
    <LenisScrollContext.Provider value={...}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter> ... <Suspense><AnimatePresence mode="wait">...</AnimatePresence></Suspense> ... </BrowserRouter>
      </MotionConfig>
    </LenisScrollContext.Provider>
  );
}
```

`MotionConfig reducedMotion="user"` satisfies `delivery-management/milestone-1.md:67` — `AnimatePresence mode="wait"` and `Suspense` stay intact; transforms are auto-suppressed, opacity still animates.

For bespoke pin thresholds, use `useReducedMotion` in `DesktopHome`:

```tsx
import { useReducedMotion } from "framer-motion";
function DesktopHome() {
  const shouldReduceMotion = useReducedMotion();
  // When reduced, collapse to single opacity crossfade or bypass pin entirely:
  const aboutOpacity = useTransform(sy!, [0.29,0.33,0.36,0.39], [0,1,1,0]);
  const aboutScale  = useTransform(sy!, [0.29,0.33,0.36], [0.9,1,1.08]);
  // Then:
  // style={{ opacity: aboutOpacity, scale: shouldReduceMotion ? 1 : aboutScale }}
  // Portals: opacity only when !shouldReduceMotion
}
```

Alternatively — replace scale chain with `style={{ opacity: aboutOpacity, scale: shouldReduceMotion ? 1 : aboutScale }}`. This matches MDN's "tone down to dissolve" example: keep educational opacity transition, drop parallax/scale.

**Lenis touchpoint:**

- Do not set `respectReducedMotion: false`. Current `App.tsx:42` omits it, so default `true` already applies — verify by logging `lenis.prefersReducedMotion` in dev with OS reduce toggled. `HeroOverlay.tsx:40` already branches `lenis.scrollTo(..., {duration:1.2})` vs `window.scrollTo`; when reduced Lenis will jump instantly (correct). `Nav.tsx:63` should also use `lenis.scrollTo(target, { immediate: lenis?.prefersReducedMotion ?? false })` instead of raw `window.scrollTo`.

### 2b. When to fall back to stacked

Fall back to `MobileHome` (stacked) whenever **any** of these is true — small cost, preserves storytelling without pin:

| Fallback trigger | Implementation | Rationale |
|---|---|---|
| `prefers-reduced-motion: reduce` | `useReducedMotion() === true` → render `<MobileHome />` (or a `ReducedMotionHome` that is `MobileHome` without canvas cursor) | Respects vestibular safety; MDN + Motion docs' primary signal. Prototype `01-prototype-pinned-vs-stacked` should treat this as the canonical reduced-motion path. |
| `pointer: coarse` OR `hover: none` (touch) | Media query `(pointer: coarse)` → stacked (already happens via 768px, but decouple from width) | Prevents 600vh pin on phones/tablets that already dislike pin; Lenis `syncTouch: false` means touch scroll is unsmoothed — pin adds no value. |
| `prefers-reduced-data` / `Save-Data` (optional) | `navigator.connection?.saveData` | Low-end Android proxy; defer canvas cursor and 5.1MB `public/images/*` PNG budget per `wayfinder/MAP.md:29` fog. |
| Explicit user toggle "Skip story" | Sticky CTA (see 2e) → set `sessionStorage.setItem("preferStacked","1")`; respect on next visit | Skim affordance; grilling ticket 05 owns copy but research recommends honoring it with stacked. |

Do not use UA sniffing. Prefer capability + preference queries. Keep 768px as narrow-viewport fallback even without reduce signal — `Home.tsx:19` already does this; unify with shared hook (below).

**Shared hook to fix 768px mismatch:**

```tsx
// src/hooks/useIsMobile.ts (extract from Home.tsx:15)
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}
// Then use in Home.tsx, Projects.tsx, About.tsx — single source, same threshold.
```

Projects/About currently use `window.innerWidth < 768` per-render (stale on resize, off-by-one at 768). Switching to the hook removes drift and satisfies `milestone-1.md:66`.

### 2c. Preserving `AnimatePresence` + `Suspense`

- Keep `AnimatePresence mode="wait"` at `App.tsx:23` and `Suspense fallback={<PageLoader />}` at `App.tsx:79` — Motion docs explicitly state `MotionConfig reducedMotion="user"` cooperates with both; it does not require removing keys or routes.
- For `Projects.tsx:313` internal carousel `AnimatePresence mode="wait"` (project switching), keep it; when `shouldReduceMotion` use `initial={{opacity:0}}` / `exit={{opacity:0}}` only (drop `x:40`). No structural change.
- For `DesktopHome` layer crossfades, prefer `MotionConfig` auto-suppression over rewriting to conditional mounts — opacity transitions remain, scale is stripped without branching JSX. If stronger guarantee needed, gate scale with `shouldReduceMotion ? 1 : aboutScale` as above.
- `Home.tsx:75` uses `useMotionValueEvent(scrollYProgress, "change", ...)`. This is safe under reduced motion; keep it for `activeSection` bookkeeping. Add guard `if (!scrollYProgress) return;` already partially there via `??` fallback.
- `BuildSequence` handoff (`Home.tsx:209` `buildComplete` gate) is outside `Suspense`; keep it. Add reduced-motion shortcut: if `shouldReduceMotion`, shorten `CodeTypewriter speed` or add a "Skip intro" button (already have `EnterKey`).

### 2d. Keyboard, screen reader, `cmd+F` handling

**Keyboard / focus:**

- Gate inactive layers with `inert` + `aria-hidden`:

```tsx
<div inert={activeSection !== "about" ? true : undefined}
     aria-hidden={activeSection !== "about"}>
  <About />
</div>
```

`inert` is polyfilled-free in Chromium/Firefox/Safari 15.4+; it removes subtree from tab order + AT + find-in-page when active. This fixes ghost tab stops without unmounting (preserves `AnimatePresence` ability to animate opacity). Where `inert` unavailable, fallback: `aria-hidden="true"` + `tabIndex={-1}` on interactive children or conditionally render `pointer-events-none inert`.

- Ensure `data-active-section` is not the only focus signal — move focus to newly active `section` heading on threshold cross for keyboard users (optional, but `sessionStorage` restore already scrolls).

**Cursor:**

- Restrict custom cursor to fine pointers and no-reduce. In `Cursor.tsx:26`:

```tsx
useEffect(() => {
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = window.matchMedia("(pointer: coarse)");
  if (rm.matches || coarse.matches) return; // do not hide native cursor
  document.documentElement.style.cursor = "none";
  return () => { document.documentElement.style.cursor = ""; };
}, []);
```

- In `Projects.tsx:138` replace `cursor-none` with `supports-[cursor:none]:cursor-none motion-safe:cursor-none` or conditionally via hook — or simply gate `cursor-none` class with `!shouldReduceMotion && pointerFine`. Tailwind has `motion-safe:` variant driven by `prefers-reduced-motion`.

**Screen reader:**

- Keep single semantic order: `HeroOverlay` already is `absolute inset-0 pointer-events-none`; add `aria-hidden` to portal overlays (`portalOpacity` etc. are `pointer-events-none` but not hidden from AT — add `aria-hidden="true"`).
- Add `<section id="about" aria-labelledby="about-heading">` etc. inside `About`/`Projects`/`Contact` for anchor navigation and AT landmarks.

**`cmd+F`:**

- When `shouldReduceMotion` → stacked path is naturally findable (no `overflow-hidden` pin). That alone solves 80% of cmd+F issues with zero extra work.
- For pinned path, add hash anchors as escape: `<section id="about-aboutline">` + Nav links that update `location.hash` so `lenis.scrollTo` moves `scrollYProgress` into the highlight's window. Document in prototype that `cmd+F` inside pin is known-broken and reduced-motion fallback is the mitigator; don't over-engineer virtualized find bindings.
- Do not implement custom find handlers; rely on native stacked fallback.

**Nav bridging:**

- `Nav.tsx:63` `handleNavClick` currently does raw `window.scrollTo` with `behavior: smooth`. In pinned mode this bypasses Lenis and desyncs `scrollYProgress` (which `Nav` itself reads for `activeSection`). Replace with:

```tsx
if (lenis) lenis.scrollTo(totalHeight * link.scrollTarget,
  { duration: 1.2, immediate: lenis.prefersReducedMotion ?? false });
else window.scrollTo({ top: ..., behavior: shouldReduceMotion ? "auto" : "smooth" });
```

Import `useLenisScrollContext` in `Nav` (already has `scrollYProgress`, add `lenis`). This preserves Lenis sync and honors instant jump under reduce.

### 2e. Skim / escape affordance (input to ticket 05)

Prototype must include at least one always-visible skim path:

- Sticky "Skip story → Projects" link in `DesktopHome` header (or reuse Nav's "Projects" entry) that `lenis.scrollTo(totalHeight*0.57, {...})`. Visible even when portals are black.
- `BuildSequence` dismiss: already has `EnterKey`; add `button` with `aria-label="Skip intro"` and `Esc` key handler for keyboard users.
- `ScrollProgressBar` is passive; complement with explicit affordance — don't rely on scrollbar alone on 600vh.

### 2f. Low-end Android / reduced-data

- Detect `navigator.connection?.saveData` or `effectiveType === '2g'|'slow-2g'` — force stacked, disable `Cursor` canvas, and lazy-load `public/images/*` with `loading="lazy"` + `width/height`. This is M3 budget (`wayfinder/MAP.md:29`) but prototype should note it.
- Keep `MobileHome` free of Lenis pin and canvas — already is. Don't run `Cursor.tsx` raf on mobile/reduced; guard as in 2d.

---

## 3. Concrete guard recommendations for `01-prototype-pinned-vs-stacked`

1. **Add `MotionConfig reducedMotion="user"` in `App.tsx:74` wrapping `BrowserRouter`** — one-line, preserves `AnimatePresence`+`Suspense`, auto-strips scale/transform for reduce users.
2. **In `DesktopHome`, import `useReducedMotion` + gate `scale` transforms** to `1` when reduced, keep `opacity` transforms. Make portals `opacity` only (or hide entirely when reduced).
3. **When `shouldReduceMotion === true`, render stacked path** (`MobileHome` or a dedicated reduced-motion branch). This single condition solves vestibular, cmd+F, and much of keyboard cost.
4. **Unify `useIsMobile(768)`** — extract `Home.tsx:15` hook to `src/hooks/useIsMobile.ts` and reuse in `About.tsx:14`/`Projects.tsx:11`; use `<=768` or `<768` consistently (recommend `max-width: 768px` as canonical, matching Home).
5. **Fix cursor a11y**: gate `Cursor.tsx:26` `cursor:none` behind `!prefers-reduced-motion && pointer:fine`; replace `ProjectCard.tsx:138` `cursor-none` with conditional or `motion-safe:cursor-none`.
6. **Fix keyboard ghost stops**: add `inert` + `aria-hidden` to inactive `motion.div` layers in `Home.tsx:105-144`.
7. **Make `Nav.handleNavClick` use `lenis.scrollTo`** with `immediate: lenis.prefersReducedMotion` so reduced users jump instantly and `scrollYProgress` stays in sync.
8. **Keep existing `index.css:159` block** as CSS belt-and-suspenders; consider tightening to `* { scroll-behavior: auto !important }` already there and adding `html.lenis { scroll-behavior: auto }` only if Lenis handles it.
9. **Prototype acceptance should include**: tab-through with keyboard (no invisible stops), VoiceOver/NVDA reading order, `cmd+F` on stacked fallback, OS reduce toggle live-switch without reload (Lenis + `useReducedMotion` both respond live).

---

## 4. Sources

- MDN — `prefers-reduced-motion` (Baseline 2020, updated 2026-06-10): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Motion for React — `useReducedMotion`: https://motion.dev/docs/react-use-reduced-motion (returns `true` when Reduced Motion enabled; use to replace `x`/`scale` with `opacity`, disable parallax/video).
- Motion for React — Accessibility Guide (`MotionConfig reducedMotion="user"` blanket, `"always"`/`"never"` overrides): https://motion.dev/docs/react-accessibility
- Lenis README (darkroomengineering/lenis 1.x): https://github.com/darkroomengineering/lenis — `respectReducedMotion: true` (default) forces `lerp=1`, instant `scrollTo`, keeps raf sync; `prefersReducedMotion` getter.
- Local audit: `src/pages/Home/Home.tsx:33-241`, `src/App.tsx:36-77`, `src/context/LenisScrollContext.tsx:1-17`, `src/pages/Projects/Projects.tsx:138`, `src/components/ui/Cursor.tsx:26`, `src/index.css:159-168`, `delivery-management/milestone-1.md:62-67`.

---

## 5. Open deferrals (not blocking prototype)

- Full `inert` polyfill decision if Safari <15.4 support required (not needed for this SPA — baseline already covers).
- Image budget (WebP, 5.1MB PNG) deferred to M3 — noted in `wayfinder/MAP.md:29`.
- Funnel telemetry / inline case study routes — fog per map, untouched here.
