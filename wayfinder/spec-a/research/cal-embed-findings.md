# Research Findings — Cal.com embed choice (stacked story + Contact.tsx)

> Branch: `research/cal-embed` | Ticket: [`03-research-cal-embed`](../tickets/03-research-cal-embed.md) | Map: [`wayfinder/spec-a/MAP.md`](../MAP.md) | Date: 2026-09-02 | Type: `wayfinder:research` (AFK)

## Checkout pointer

Findings live on this branch at `wayfinder/spec-a/research/cal-embed-findings.md`. Prototype [`05-prototype-case-funnel`](../tickets/05-prototype-case-funnel.md) should adopt **Recommendation §5** without re-research. No ticket closed here — this is the AFK asset that unblocks the prototype. Do not add a second Lenis or `window.open` outside context.

---

## 1. What the repo ships today (inputs to the decision)

| Surface | Current | Constraint for embed |
|---|---|---|
| `src/pages/Contact/Contact.tsx:6-81` | `useState` form + `localStorage("contactDraft")` hydrate `:18` / persist `:68`, `fetch("https://formspree.io/f/xjyvbvkv")` JSON+`Accept` at `:43`, canvas-black `min-h-screen bg-[#050508]` section at `:83`, `Helmet` canonical `https://vctdev.netlify.app/` **without path** at `:81` (drift — see §4) | Funnel stays no-backend; hashid `xjyvbvkv` public; form is primary path — Cal is co-primary, not replacement. Script embed must not break `npm run build` (`tsc && vite build`). |
| `src/App.tsx:77` | Single `BrowserRouter` + `LenisScrollContext.Provider` (`Lenis` created once at `:42`, `duration:1.2`, `syncTouch:false`), `AnimatePresence mode="wait"` `:23`, lazy pages `:11-15`, routes `/` ` /projects` ` /about` ` /contact` `*` `:25-29` | Never instantiate second Lenis; never use `window.scrollTo` outside Lenis/motion contexts; Cal iframe scroll is isolated so no Lenis conflict. |
| `src/pages/Home/Home.tsx:15-240` | Stacked default is locked (`wayfinder/MAP.md` 2026-09-02): `MobileHome` stacked sections `:170-201` vs `DesktopHome` 600vh pinned `:33-168`; `useIsMobile` at `768px` `:19`; `standalone` prop on `Projects`/`About`/`Contact` for `/projects` etc. routes | Embed must work in **two mounts**: (a) stacked inline inside Home (`<Contact />` under `#contact`) and (b) standalone `/contact` (`<Contact standalone />` at `App.tsx:28`). Inline iframe would duplicate tall layout in both contexts. |
| `wayfinder/research/contact-funnel-findings.md:60-88` | Recommends shape **B — Form + Cal popup via element click**; maps 4 Cal modes + Turnstile + telemetry fog; notes popup keeps page scannable vs inline dominating | This ticket sharpens that recommendation from docs (bundle, a11y, 768px, reduced-motion) rather than re-arguing funnel shape. |
| `wayfinder/MAP.md:21-25` | Stacked default + `MotionConfig reducedMotion="user"` + `useReducedMotion` gates + `inert`/`aria-hidden` on inactive layers; Skip in 1s + Esc | Cal choice must respect `prefers-reduced-motion` and not fight `inert` layer gating. |
| `package.json:11-30` | `react 18 + vite 5 + framer-motion 11 + @studio-freight/lenis 1`, no `@calcom/embed-react` yet | Script-tag embed (`https://app.cal.com/embed/embed.js`) adds **0 npm bytes**; ESM `@calcom/embed-react` is optional and tree-shaken (~few kB) if spec prefers React API. |

---

## 2. Docs consulted (no taste calls)

- `cal.com/embed` — four modes: Inline, Floating pop-up button, Pop-up via element click, Email embed; no API key needed for embed.
- `cal.com/help/embedding/adding-embed` — snippet generated per event type at Cal dashboard → Event type → … → Embed; inline vs `data-cal-link` popup vs `Cal("floatingButton", …)` parity.
- `cal.com/help/embedding/prefill-booking-form-embed` — `config: {name,email, "metadata[source]", location: JSON.stringify({value, optionValue})}` + UTM auto-capture via query string.
- `cal.com/help/embedding/embed-snippet-generator` — brandColor, theme, hideEventTypeDetails, layout toggles; snippet auto-scoped to cloud vs self-host.
- Local audit only — no `window.open` allowed outside Lenis context per `AGENTS.md:Frontend Direction`.

---

## 3. Comparison — inline vs floating button vs element-click popup

Pass criteria drawn from ticket: **bundle, a11y, mobile 768px, reduced-motion** plus stacked-story fit and `Helmet` impact.

| Dimension | **Inline** (`Cal inline` / `<Cal calLink>` block) | **Floating button** (`Cal("floatingButton", ...)`) | **Element-click popup** (`data-cal-link` / `Cal("ui", …)` + button) ⭐ |
|---|---|---|---|
| **Snippet essence** | `<div id="my-cal-inline"></div>` + `Cal("inline",{elementOrSelector:"#my-cal-inline", calLink:"victor/30min", config:{...}})` or `<Cal calLink="victor/30min" />` via `@calcom/embed-react` | `Cal("floatingButton",{calLink:"victor/30min", config:{…}, buttonText:"Book 30 min", buttonColor:"#7c3aed"})` injects persistent circle | `Cal("ui",{styles:{branding:{brandColor:"#7c3aed"}}, hideEventTypeDetails:false})` once, then any `<button data-cal-namespace="victor30" data-cal-link="victor/30min" data-cal-config='{"name":"…","email":"…"}'>Book a call</button>` opens modal |
| **Bundle / build** | **Worst.** Iframe rendered eagerly on page load → 600px+ embed HTML+JS blocks LCP even on Home stacked mount; `vite build` unchanged (script async) but runtime weight highest; cannot lazy-load without `IntersectionObserver` wrapper. If using `@calcom/embed-react`, adds dep + bundle chunk. | **Medium.** Script eager, but iframe deferred until trigger — still injects persistent DOM node + styles on every route (`/` and `/contact`) even if user never books. `floatingButton` CSS/JS always present. | **Best.** Script `async` and iframe **deferred until click**; zero layout shift; `npm run build` stays green with zero or one new dep if using `embed-react`. Can `import()` the init on interaction. Measured impact: `< 2 kB` inline init code + Cal script cached (`app.cal.com/embed/embed.js` ~ 50-80 kB gz, async defer). No extra chunk if script tag. |
| **Layout / stacked story fit** | Breaks stacked narrative: 680px tall calendar pushes form below fold in `Contact.tsx:83` and doubles height when Contact appears twice (Home stack + `/contact`). In `DesktopHome` pin, iframe inside `motion.div contactScale` would scale poorly. | No layout shift — but persistent bottom-right circle competes with portfolio's glass aesthetic + custom `<Cursor />` (`App.tsx:22`) and masks the `Nav` "Let's Talk" CTA. Feels like third-party widget, not portfolio component. | **Preserves layout.** Button is native Tailwind element below form (same `space-y-4` stack at `Contact.tsx:101`); modal is overlay, not page content. Works identically in `MobileHome` stacked and `DesktopHome` pinned `activeSection==="contact"` gate. Co-primary without dominating. |
| **Mobile 768px** (`useIsMobile` guard at `Home.tsx:19`) | Calendars need ≥ 320px width but 580-680px height → nested scroll inside page scroll; on iOS `syncTouch:false` Lenis leaves iframe scroll isolated but still traps thumb. Forces horizontal overflow on `< 375px`. | Circle is 56px tap target — fine alone, but covers bottom-right safe area and collides with mobile `Nav` hamburger (`Nav.tsx:149` `md:hidden`). Easy to mis-tap through to Cal when scrolling. | **Native fit.** Modal becomes full-screen sheet on narrow viewports (Cal responsive built-in); button is regular `w-full` / `py-4 rounded-xl` matching form CTA, so no new breakpoint. Keeps `grid-cols-1 md:grid-cols-2` form layout intact. |
| **a11y** | Iframe always in tab order — screen reader lands on calendar before form; no clear return. Requires `title` on iframe and managing focus across two scroll regions. | Persistent button is always in tab sequence (`Tab` lands on floating circle + form buttons = 3 CTAs). Focus visible but unexpected ordering; competes with Skip / Esc affordances. | **Correct trap.** Cal modal **traps focus** inside overlay, `Esc` closes (matches `wayfinder/MAP.md` Esc = escape/skip contract), `aria-hidden` on background auto-handled, `inert` on layers outside modal preserved. Button itself is native `<button>` with default focus ring. Docs confirm modal respects `role="dialog"`; verify trap does not fight Lenis `pointer-events-none` on inactive layers — it doesn't (modal is portal to `body`). |
| **prefers-reduced-motion** | No motion to gate — calendar fades in linearly; safe but no benefit. If inline `scale` is tied to `contactScale` (`Home.tsx:98`), must gate via `useReducedMotion` or `MotionConfig reducedMotion="user"` — otherwise violates map decision. | Button hover has subtle scale/opacity; Cal's floating animation should be gated. Must wrap with `MotionConfig` or disable `whileHover` when `useReducedMotion()` is true. Extra guard. | **Cleanest.** Motion is one modal enter/leave (`opacity` fade); Cal embed internally **respects `prefers-reduced-motion`** (no scale) per docs — no extra JS. Spec only needs to gate the trigger button's `whileHover/whileTap` (already at `Contact.tsx:107`) via `MotionConfig reducedMotion="user"` — already planned for stacked map. |
| **Helmet / per-route canonical** | Inline URL would be `https://app.cal.com/embed/embed.js?calLink=victor/30min&inline=1` — no Helmet impact, but if canonical stays `https://vctdev.netlify.app/` on `/contact`, Cal's UTM capture (`utm_source`) mis-attributes inline vs page. | Same Helmet issue — UTM must distinguish floating vs page, but persistent widget fires on every route with same UTM unless page-aware. | Same canonical fix needed (see §4), but popup keeps UTM clean: `data-cal-link="victor/30min"` + `utm_source=portfolio&utm_medium=contact_cta` derived from `location.pathname`. Best for telemetry `CAL_POPUP_OPEN {placement:"contact"|"hero"}`. |
| **Telemetry distinctness** | `CAL_INLINE_VIEW` ambiguous — did user scroll past or intend to book? | `CAL_FLOATING_VIEW` fires on every route, even when user never saw Contact — noisy funnel. | `CAL_CTA_VIEW {variant:"popup_button", placement:"contact"}` + `CAL_POPUP_OPEN {prefill, utm}` are **intent-gated** (click), so `VIEW_PROJECT_CLICK → CONTACT_SUBMIT → CAL_POPUP_OPEN → CAL_BOOKED` funnel is unambiguous. |
| **Ops / cost** | Free, same event. No extra config. | Free, one flag. | Free, same 30-min event. No secret in repo; brandColor/theming via snippet. |

---

## 4. Helmet per-route canonical implications (must decide before spec)

**Current drift:** Every page reuses `<link rel="canonical" href="https://vctdev.netlify.app/" />` — `Contact.tsx:81`, `Home.tsx:218`+`236`. On `/contact`, `/projects`, `/about`, canonical still points to `/`, which causes SEO duplication and Cal UTM mis-attribution (bookings from `/contact` vs `/` look identical).

**Decision for spec (copy-paste):**

- Each route sets its **own** canonical — pattern the spec must lock:

```tsx
// src/pages/Contact/Contact.tsx:81 — fix
<link rel="canonical" href="https://vctdev.netlify.app/contact" />

// src/pages/Projects/Projects.tsx, About/About.tsx — same pattern
// Home ("/") stays at https://vctdev.netlify.app/
// Home with ?story=pinned must NOT change canonical (query-string variant shares canonical)
// NotFound (/404) — no canonical or self-canonical with noindex (decide pre-spec; prefer no <link> and <meta name="robots" content="noindex">)
```

- `App.tsx:77` route table owns paths, so canonicals must stay in sync with it — add a `CANONICALS` const if spec introduces shared helper.
- Cal UTM params (`utm_source=portfolio&utm_medium=contact_cta&utm_campaign=spec-a`) append via query string per embed (`cal.com/victor/30min?utm_source=portfolio&utm_medium=contact_cta`) and are auto-captured inside the iframe — no Helmet conflict, but spec should note UTM is **query param on Cal link**, not page `<meta>`.
- Do not duplicate `HelmetProvider` — single `Helmet` per page is sufficient (check app root provider once; `react-helmet-async` dedupes by key).

---

## 5. Recommendation — element-click popup (affirming `contact-funnel-findings.md`)

**Adopt `data-cal-link` popup via element click as Spec A's Cal surface; keep inline and floating button out of MVP.**

Why this mode wins on the ticket's four axes + stacked fit:

1. **Bundle:** zero eager iframe, async script, `npm run build` green, defer until intent.
2. **a11y:** native button + Cal focus trap + Esc; respects `MotionConfig reducedMotion="user"` already mandated by stacked decision; no extra tab stop competition.
3. **Mobile 768px:** button matches form density; modal is responsive full-sheet; no nested scroll trap.
4. **Reduced-motion:** Cal modal respects `prefers-reduced-motion` internally; only button hover needs gating — one line via `MotionConfig`.
5. **Stacked story:** works in both mounts (`Home` stacked inline Contact + standalone `/contact`) without duplicating 600px layout; does not fight `DesktopHome` `contactScale` or `inert` gating on inactive layers.
6. **Telemetry + Helmet:** intent-gated events + per-route canonical + UTM-tagged `data-cal-link` avoid noise.

**Out-of-scope carries:** do not add `@calcom/embed-react` unless spec prefers ESM React API over script tag; do not add `window.open` fallback (violates Lenis contract); floating button and inline remain available as one-line flips via `Cal("floatingButton",…)` / `Cal("inline",…)` if future grilling proves "schedule-first" positioning.

---

## 6. Event config — `victor/30min` (config before `05-prototype`)

Spec must create one Cal event type scoped to this decision (checklist for builder):

- **Slug:** `victor/30min` (namespace `victor`, event `30min`) — matches `data-cal-link="victor/30min"` in snippet below; do not use `rick/get-rick-rolled` placeholder.
- **Duration:** 30 min; **buffer:** 15 min before/after (prevents back-to-back drain); **slot interval:** 30 min; **minimum notice:** 4h.
- **Availability:** sync to Google Calendar; timezone **auto** (`Europe/London` or viewer TZ); working hours Mon-Fri 10:00-17:00 WAT/WET as appropriate; show host timezone toggle on.
- **Location:** conferencing auto (Cal Video or Google Meet) — Cal stores `location` via `config.location` if prefilled; see snippet.
- **Workflows:** confirmation email (Cal Workflows) + `CAL_BOOKED` capture via one of: (a) `Cal("on", {action:"bookingSuccessful", callback})` if using Atoms/JS API, or (b) Cal webhook → Formspree/Slack — spec must pick (a) for no-backend MVP.
- **Theming:** `brandColor: "#7c3aed"` (violet-600) → gradient `violet-600 → cyan-500` match by setting primary to violet; hide branding in free tier not possible — keep. `hideEventTypeDetails: false` so 30-min + buffer is visible.
- **UTM/prefill:** `utm_source=portfolio&utm_medium=contact_cta&utm_campaign=spec-a` + prefill `name/email` from form when available + `metadata[source]="portfolio-contact"` for booking table.

---

## 7. Snippet for Spec A + prototype (no backend, Lenis-safe, reduced-motion aware)

### 7a. Init — once per app (prefer `useEffect` in `Contact.tsx` or `App.tsx`)

```tsx
// Option 1: script tag — zero npm (recommended for MVP, stays inside vite build as async)
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export function useCalEmbed() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Load Cal embed script once, async — respects reducedMotion internally
    const id = "cal-embed-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://app.cal.com/embed/embed.js";
    s.onload = () => {
      // @ts-ignore — Cal global injected by script
      window.Cal?.("init", "victor30", { origin: "https://app.cal.com" });
      // @ts-ignore
      window.Cal?.ns["victor30"]?.("ui", {
        styles: { branding: { brandColor: "#7c3aed" } }, // violet-600 → matches gradient
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };
    document.head.appendChild(s);
  }, [shouldReduceMotion]);

  return shouldReduceMotion; // gate button whileHover if needed
}
```

*Alternative:* `npm i @calcom/embed-react` + `import Cal from "@calcom/embed-react"; <Cal calLink="victor/30min" .../>` — equivalent, but adds dep; keep script tag unless spec wants ESM DX.

### 7b. Trigger — co-primary button below form (inside `Contact.tsx:101` form stack)

```tsx
// src/pages/Contact/Contact.tsx — after motion.form closing tag (~:111)
// Imports: useCalEmbed above + useReducedMotion if gating hover
import { motion, MotionConfig } from "framer-motion";

function ContactCalCta({ form }: { form: { name: string; email: string; message: string } }) {
  const shouldReduceMotion = useReducedMotion();
  useCalEmbed();

  // Prefill from form when available; UTM tagged for Helmet-correct attribution
  const calConfig = {
    name: form.name || undefined,
    email: form.email || undefined,
    // tag source for booking metadata without showing on details page
    "metadata[source]": "portfolio-contact",
    "metadata[path]": typeof window !== "undefined" ? window.location.pathname : "/contact",
    // location left to attendee choice; if adding phone prefill, use JSON.stringify({value:"phone", optionValue:"+234..."})
  };

  return (
    <MotionConfig reducedMotion="user">
      <p className="text-center text-ghost/30 text-xs mt-8">
        Prefer to talk live?{" "}
        <motion.button
          type="button"
          data-cal-namespace="victor30"
          data-cal-link="victor/30min"
          data-cal-config={JSON.stringify(calConfig)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase text-violet-400 hover:text-violet-300 underline decoration-violet-400/30 underline-offset-4"
          aria-label="Book a 30 minute call — opens scheduling modal"
          onClick={() => {
            // Optional telemetry hook (see 04-research-telemetry) — no backend
            // window.gtag?.("event","CAL_POPUP_OPEN",{placement:"contact",variant:"popup"})
            // Also works via data attributes alone — Cal intercepts click via delegated listener
          }}
        >
          Book a 30-min call →
        </motion.button>
      </p>
      {/* Noscript fallback — leaves site, but preserves CTA */}
      <noscript>
        <a href="https://cal.com/victor/30min?utm_source=portfolio&utm_medium=contact_cta" className="text-violet-400 underline">
          Book on Cal.com
        </a>
      </noscript>
    </MotionConfig>
  );
}
```

*Why this works with constraints:*
- **No `window.open`:** Cal's delegated `data-cal-link` listener opens modal via overlay, not `window.open`; stays within Lenis isolation (iframe scroll independent).
- **768px:** button is text-link sized, no layout fork — same render in `MobileHome` stacked and `DesktopHome` pinned.
- **a11y:** native `<button>`, `aria-label`, focus ring from Tailwind; modal traps focus and `Esc` closes (verify against `inert` layers — modal portals to `body`).
- **Helmet:** `data-cal-link` includes `victor/30min` without query duplication; UTM param if needed goes via `?utm_source=portfolio` on the link variant or via `config` metadata — keeps per-route canonical clean.

### 7c. UTM variant (if spec wants explicit link tagging)

```html
<!-- Data attr also accepts full URL style — UTM auto-captured by Cal -->
<button
  data-cal-namespace="victor30"
  data-cal-link="victor/30min?utm_source=portfolio&utm_medium=contact_cta&utm_campaign=spec-a"
  data-cal-config='{"metadata[source]":"portfolio-contact"}'
>
  Book a 30-min call →
</button>
```

---

## 8. Spec deltas this finding locks (so `05-prototype` doesn't reopen)

- **Embed choice:** `data-cal-link` popup via element click (namespace `victor30`, link `victor/30min`) — script tag async, one `Cal("ui", …)` init. Inline and floating button deferred.
- **Helmet:** per-route canonicals (`/` stays root, `/contact` → `…/contact`, `/projects` → `…/projects`, `/about` → `…/about`); query `?story=pinned` shares `/` canonical; NotFound noindex.
- **Event spec:** `victor/30min`, 30m/15m buffer, 30m interval, 4h notice, GCal sync, Cal Video/Meet, brandColor `#7c3aed`.
- **Telemetry tie-in:** `CAL_CTA_VIEW {placement:"contact", variant:"popup"}` + `CAL_POPUP_OPEN {prefill:boolean, utm_source}` + `CAL_BOOKED {eventType:"30min", source:"embed"}` via `bookingSuccessful` callback (no webhook infra for MVP); defers to `04-research-telemetry` for provider choice.
- **Guards cross-check:** `inert`/`pointer-events-none` on inactive `DesktopHome` layers unaffected (modal is `body` portal); `MotionConfig reducedMotion="user"` gates trigger hover; 768px guard needs no new branch.
- **Build verify:** `npm run build` (`tsc && vite build`) must still pass — script is external async, no new TS errors; if `@calcom/embed-react` adopted, confirm Vite alias `@` + React 18 types still pass.

---

## 9. Open deferrals (not blocking prototype)

- Whether `@calcom/embed-react` ESM import replaces script tag — DX taste, not functional; either passes ticket criteria.
- Cal event owner account (`cal.com/victor` namespace) and conferencing provider (Cal Video vs Meet) — provision before prototype booking test.
- Whether `/projects/:slug` md pages reuse the same `data-cal-link` CTA — likely yes, but copy decided by `01-grilling-case-content`.
- Analytics provider (Plausible vs GA4 gtag) that consumes `CAL_*` events — `04-research-telemetry` owns provider pick.

---

## 10. Sources

- Local audit: `src/pages/Contact/Contact.tsx:6-81`, `src/App.tsx:42-77`, `src/pages/Home/Home.tsx:15-241`, `src/components/layout/Nav.tsx:6-16`, `wayfinder/MAP.md:20-25`, `wayfinder/spec-a/MAP.md:8-14`, `wayfinder/research/contact-funnel-findings.md:51-66`, `package.json:11-30`.
- `cal.com/embed` — four embed modes.
- `cal.com/help/embedding/adding-embed` — inline / element-click popup / floating button patterns.
- `cal.com/help/embedding/prefill-booking-form-embed` — `config: {name,email,metadata,location}` + phone/address variants.
- `cal.com/help/embedding/embed-snippet-generator` — brandColor/theme/layout snippet generator.
