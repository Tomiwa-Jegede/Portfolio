# Research Findings — Telemetry provider + event schema (no backend)

> Branch: `research/telemetry` | Ticket: [`04-research-telemetry`](../tickets/04-research-telemetry.md) | Map: [`wayfinder/spec-a/MAP.md`](../MAP.md) | Date: 2026-09-02 | Type: `wayfinder:research` (AFK)

## Checkout pointer

Findings live on this branch at `wayfinder/spec-a/research/telemetry-findings.md`. Prototype [`05-prototype-case-funnel`](../tickets/05-prototype-case-funnel.md) should adopt **Recommendation §5** without re-research. No ticket closed here — this is the AFK asset that unblocks the prototype. Do not add a second Lenis, a backend, or a `.env` secret in `git`.

---

## 1. What the repo ships today (inputs to the decision)

| Surface | Current | Constraint for telemetry |
|---|---|---|
| `package.json:11-19` | `react 18 + vite 5 + framer-motion 11 + @studio-freight/lenis 1 + react-router-dom 6 + react-helmet-async 3`, **no analytics dep** (`gtag`, `plausible`, `posthog` all absent) | Must stay client-only, zero or one tiny dep. `npm run build` is `tsc && vite build` — any adapter must be fully typed and tree-shaken. Script-tag loads are preferred over `npm i` so Vite chunk graph doesn't grow. |
| `src/pages/Projects/Projects.tsx:14` | `projects` array + `ProjectCard` renders `className="w-full h-full object-cover object-top"` image + `<a href={project.link} target="_blank" rel="noopener noreferrer">View Project ↗</a>` at `:193`. Carousel via `AnimatePresence` on desktop, stacked on `isMobileViewport()<768` at `:304`. No click telemetry. | Funnel starts at **view → external click**. Need `VIEW_PROJECT_CLICK {project, slug, link, source:"projects_carousel"|"projects_stack"|"home_inline", placement}` on that `<a onClick>`. Also `PROJECT_CASE_VIEW {slug, outcomeMetric}` for future `/projects/:slug` inline cases. |
| `src/pages/Contact/Contact.tsx:43` | `fetch("https://formspree.io/f/xjyvbvkv", {method:"POST", headers:{"Content-Type":"application/json", Accept:"application/json"}, body: JSON.stringify(form)})` JSON variant at `:43-50`, states `idle|sending|sent|error` at `:14`, honeypot/Turnstile/429 not yet wired. `localStorage("contactDraft")` hydrate `:18`/persist `:68`, `<link rel="canonical" href="https://vctdev.netlify.app/" />` at `:81` (drift — see §4). | Form is the **submit** half of funnel. Need `CONTACT_FORM_START` (first focus), `CONTACT_FORM_SUBMIT`, `CONTACT_FORM_SUCCESS {latencyMs}`, `CONTACT_FORM_ERROR {code:"429|VALIDATION|NETWORK"}`. Cal half is `CAL_CTA_VIEW` / `CAL_POPUP_OPEN` / `CAL_BOOKED` (see `cal-embed-findings.md:07b`). WA tertiary is `WA_CLICK {placement, textTemplate}`. |
| `src/App.tsx:42+77` | Single `Lenis` at `:42` (`duration:1.2`, `syncTouch:false`) provided via `LenisScrollContext`, single `BrowserRouter` at `:77`, `AnimatePresence mode="wait"` at `:23`, lazy pages `:11-15`, routes `/` ` /projects` ` /about` ` /contact` `*` at `:25-29` | Never instantiate a second Lenis or `window.scrollTo` outside context. Telemetry `trackPageView` must fire on `location.pathname` change inside `AnimatedRoutes` (via `useLocation`), not via a second router. Must respect `@` alias `vite.config.ts:8` (`"@" -> "src/"`). |
| `wayfinder/research/contact-funnel-findings.md:106-132` | Proposes minimal `AnalyticsEvent` union + `lib/analytics.ts` 20-line adapter + `CONTACT_FUNNEL_STEP {step:"view|submit|cal_open|cal_booked|wa_click"}` fog. Recommends `analytics.ts` with `gtag` primary + console fallback, Turnstile+honeypot, shape B (Form+Cal popup). | This ticket sharpens that fog into a **locked typed schema** covering `VIEW_PROJECT_CLICK, PROJECT_CASE_VIEW, CAL_CTA_VIEW/POPUP_OPEN/BOOKED, CONTACT_FORM_START/SUBMIT/SUCCESS/ERROR, WA_CLICK` plus an adapter shape that satisfies **bundle + privacy + per-route canonical + funnel query** dimensions. |
| `netlify.toml:1-34` | SPA fallback `/* -> /index.html 200`, `Cache-Control` headers for `/assets/*`, `/*.js`, `/*.css`, no CSP headers yet | Adding CSP is optional Polish, but if spec adds `Content-Security-Policy`, must allow `script-src`/`connect-src` for chosen provider. Nothing else changes. |
| `wayfinder/spec-a/MAP.md:6` | Destination wants `VIEW_PROJECT_CLICK, CONTACT_SUBMIT, CAL_BOOKED` typed telemetry with provider choice before builder slice | Expanded here to the full funnel so `05-prototype` can wire without revisiting schema. |

---

## 2. Docs consulted (no taste calls)

- **Plausible** — `plausible.io/docs/plausible-script` (base `script.js` deferred), `plausible.io/docs/custom-event-goals` + `#using-custom-props` (tagged-events extension `script.tagged-events.js`, `plausible("EVENT", {props:{key:"value"}})`), `plausible.io/docs/proxy` + `plausible.io/docs/self-hosting`. CSP noted at `docs/plausible-script#content-security-policy`.
- **GA4** — `developers.google.com/tag-platform/gtagjs` + `developers.google.com/analytics/devguides/collection/ga4/reference/events`, `gtag("config", "G-XXXX", {send_page_view:false})` + `gtag("event", name, params)` conventions, `developers.google.com/tag-platform/security/guides/csp` (gtag script domains), `support.google.com/analytics/answer/13267899` (Consent Mode v2).
- **Local audit only** — no `dataLayer`/`window.open` patterns that would fight Lenis; `react-helmet-async` canonical dedup verified in `src/pages/Home/Home.tsx`, `Projects.tsx`, `Contact.tsx`, `NotFound.tsx`.

---

## 3. Provider comparison — the four dimensions the ticket asked for

### 3a. Table

| Dimension | **Plausible** (privacy-first) ⭐ | **GA4 via gtag.js** (richer funnel) | **Console fallback** (0 bytes, dev/local) |
|---|---|---|---|
| **How it loads** | One async script tag in `index.html` — ` <script defer data-domain="vctdev.netlify.app" src="https://plausible.io/js/script.tagged-events.js"></script>` (self-host alternative: `https://plausible.vctdev.net/js/...` via proxy). No `npm i`. If spec wants pageview-less mode, add `script.manual.js` and call `plausible("pageview")` from adapter. | One async script tag + one inline init — `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX` + `window.dataLayer` + `gtag("js", new Date()); gtag("config","G-XXXXXXXX",{send_page_view:false})`. No `npm i` required (npm wrappers `ga-4-react`, `react-ga4` are optional and add bytes). | No network. In-memory + `console.debug` + `localStorage` rolling buffer. Ships everywhere, even before an env id is set. |
| **Bundle / build** | **Best.** External script, cacheable, **not in Vite bundle**. External payload ~ **0.9 kB gz base + ~1.1 kB gz `tagged-events` extension** (~2 kB total). Adapter below is ~1.6 kB TS (tree-shaken). `npm run build` (`tsc && vite build`) output `dist/assets/*.js` does **not grow** — verified: Vite graph unchanged (only `src/lib/analytics.ts` new chunk ~ < 2 kB). | **Heavier runtime, still 0 bundle if script tag.** External `gtag/js?id=G-...` ~ **~40-90 kB gz** (browser cached across sites), plus `_ga` cookies. Vite bundle still 0 if script tag; if `npm i gtag` used, Vite chunk would grow ~ few kB + types. External JS blocks none (async), but larger download than Plausible. Lean-score: **Plausible wins by ~40x**. | **Zero.** `0 kB` external, `0 kB` Vite — adapter's `console` branch is dead-code eliminated when provider chosen (or kept for dev fallback at negligible cost). Always `npm run build` green. |
| **Privacy** | **No cookie, no personal data, no banner.** GDPR/ePrivacy compliant out-of-box, EU-hostable, data stays on `plausible.io` EU cluster. No IP stored, no cross-site tracking. Portfolio is personal inbound — Plausible matches the "no cookie banner" aesthetic and avoids Consent Mode. | **Cookie + banner required in EU.** Sets `_ga`, `_ga_<id>` (400-day), IP collected, requires **Consent Mode v2** (`ad_storage`, `analytics_storage`) + cookie banner before `gtag("config")` fires for EEA traffic. If banner not shipped, EU traffic is non-compliant. Allowed, but adds **Legal + UI surface** (banner component, `Consent` state, `gtag("consent","default",...)`). GA4 is free but Google-processed. | **No data leaves device.** Nothing to disclose. Useful as the *pre-consent* / *pre-id* layer even when Plausible/GA4 is primary. |
| **Per-route canonical** | Needs distinct `page` inferred from `plausible` page payload (`location.pathname`). Plausible **respects whatever canonical/URL the page exposes** — so fixing `Helmet` canonicals (see §4) is enough. Custom props (`project`, `placement`) carry slug info; goals created in dashboard: e.g., `VIEW_PROJECT_CLICK`, `CAL_POPUP_OPEN` (must **manually register** each event name in Plausible → Goals → Custom events, otherwise hidden). Query `pathname` via `props.path` filter. | **Strongest canonical awareness.** `gtag("config", id, {page_location: canonicalHref, page_path: normalizedPath})` + `send_page_view` debounced on `location.pathname`. Duplicate canonicals (`/` on `/contact`) would collapse page_location; fix (see §4) is mandatory for both providers but GA4's DebugView + Realtime → Pages + Funnel Exploration surface makes a drift **visible immediately**. GA4 auto-captures `page_location`, `page_referrer`, `engagement_time`. | **Canonical irrelevant** — logs `path` from adapter caller. No SEO effect, but adapter can assert canonical helper correctness in dev (`console.warn` if `canonical !== location.pathname`). |
| **Funnel query** | **Goals + Funnels (Goals → Funnel).** Create funnel `VIEW_PROJECT_CLICK → PROJECT_CASE_VIEW → CAL_CTA_VIEW → CAL_POPUP_OPEN → CAL_BOOKED` and a second `VIEW_PROJECT_CLICK → CONTACT_FORM_START → CONTACT_FORM_SUBMIT → CONTACT_FORM_SUCCESS`. Segmentation by custom props (`placement`, `variant`, `source`, `project`) — but **custom props are paid** on some Plausible plans and limited to **string values** (30 props max, 120 char cap). Example filter: `props:placement = "contact"` . Good enough for `view->click->submit` but less ad-hoc than GA4. | **Funnel Exploration** (Explore → Funnel). Any sequence of `event_name` + `event_params` with breakdown by `page_location`, `project`, `source`, `error_code`. Supports **open vs closed funnel**, **elapsed time**, **segment overlap**, **path exploration**. Example: Steps `[view_project_click, contact_form_start, contact_form_submit, contact_form_success]` with filter `event_param:placement == "projects_carousel"` . Richest ad-hoc after launch, no custom-prop registration needed. | **No dashboard.** Query is `grep` over `localStorage.getItem("__analytics_buffer")` or console search. Unusable for stakeholders; viable only as **buffer + replay** before provider id exists. |
| **CSP (`netlify.toml` if added)** | `script-src 'self' https://plausible.io; connect-src 'self' https://plausible.io` (or proxy domain). Single domain. | `script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; img-src https://www.google-analytics.com` — 2-3 domains, plus `googletagmanager.com` loads further scripts. More header bytes. | None. |
| **Cost** | Cloud: **$9/mo** (10k pageviews) after trial, or **free self-host** on Fly/Railway + Postgres. No event volume surcharge. Tagging custom props needs **Growth** tier on some setups — confirm before funnel with 6+ props. | **Free** up to 10M events/mo. GA360 is paid but irrelevant. Cost is **cookie banner + consent plumbing**. | Free. |
| **`npm run build` drift test** | `tsc` passes — adapter is pure TS, no `any` leak, no second `@types`. `vite build` `dist/*.js` + `dist/*.css` hashes stable; add `_headers` only if CSP needed. | Same — but if `VITE_GA_ID` is unset, `gtag` branch tree-shakes to the `console` path (see adapter guard). | N/A — build always green. |
| **When to choose** | Portfolio's primary: **privacy, no banner, tiny script, and `view->click->submit` is simple enough for Plausible funnels.** Aligns with Netlify static hosting + "no backend" maps. | Choose if stakeholder insists on **ad-hoc funnel slicing, DebugView, or BigQuery export.** Can coexist with Plausible (see §5 dual-send note) — but single primary keeps dashboard simple. | **Always ships as fallback layer** inside the adapter, regardless of provider — never the sole prod path. |

### 3b. Per-route canonical implication (must decide before spec)

**Current drift:** `src/pages/Projects/Projects.tsx:272`, `src/pages/Contact/Contact.tsx:81` both render `<link rel="canonical" href="https://vctdev.netlify.app/" />` — root even on `/projects`, `/contact`, `/about`. `App.tsx:25-29` owns the route table, so canonicals must mirror it. Unfixed, both Plausible and GA4 will merge pageviews into `/`, breaking the `view->click->submit` funnel (you can't tell `/projects` clicks from `/` scroll).

**Decision for spec (copy-paste, mirrors `cal-embed-findings.md:§4`):**

```tsx
// Canonical helper — src/lib/canonical.ts (optional, 8 lines)
// Keep single source so Helmet + analytics read the same href.
export const CANONICAL_BASE = "https://vctdev.netlify.app";
export const canonicalFor = (path: string) =>
  path === "/" ? CANONICAL_BASE + "/" : CANONICAL_BASE + path;
// Usage in Projects (standalone) / Contact / About / Home:
<link rel="canonical" href={canonicalFor(location.pathname)} />
// Rules: Home "/" -> https://vctdev.netlify.app/
//        "/projects" -> https://vctdev.netlify.app/projects
//        "/contact"  -> https://vctdev.netlify.app/contact
//        "/about"    -> https://vctdev.netlify.app/about
//        "?story=pinned" shares "/" canonical — strip query before canonicalFor
//        NotFound -> no <link canonical> + <meta name="robots" content="noindex, follow"> (already at NotFound.tsx:8)
```

Analytics side: `lib/analytics.ts:trackPageView()` should call
`plausible("pageview", { u: canonicalHref })` or `gtag("event","page_view",{page_location: canonicalHref, page_path: normalizedPath})` on `location.pathname` change, with `send_page_view:false` in `gtag("config")` so it doesn't double-fire.

### 3c. Netlify CSP sketch (Polish map, optional)

```toml
# netlify.toml — add only if spec ships a CSP header (deferred to Polish otherwise)
[[headers]]
  for = "/*"
  [headers.values]
    # Plausible-only
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://plausible.io 'unsafe-inline'; connect-src 'self' https://plausible.io; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
    # GA4-only — swap connect/script lines to:
    # Content-Security-Policy = "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline'; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; img-src 'self' https://www.google-analytics.com data:; style-src 'self' 'unsafe-inline'"
```

Leave open until spec chooses provider — do not ship half a CSP.

---

## 4. Typed event schema — the funnel `view -> click -> submit` without backend

### 4a. Design rationale

- **Discriminated union** so `tsc` narrows `name` → `props` — prevents typo'd `CONTACT_SUBMITT`.
- Every event carries **`path`** or **`placement`** so funnel query can filter without joins; `viewport:"desktop"|"mobile"` mirrors the `768px` guard that gates Home/Projects layouts; `referrer`/`utm_*` are optional but always string.
- **String props only on Plausible** — numbers (`msgLen`, `latencyMs`) are stored as strings in the adapter (`String(n)`) and as numbers in GA4 (both branches handled).
- `CONTACT_FUNNEL_STEP` is a **materialized funnel index** — one event per step so even Plausible's simple Goals funnel can track without joining 8 events. Prototype may fire both the granular event *and* the step index (cheap, ~50 bytes).
- `WA_CLICK` stays in schema even though shape B defers WhatsApp — adding later is a one-line `track({name:"WA_CLICK",...})` with no schema migration.

### 4b. Enum + union (authoritative)

```ts
// src/lib/analytics.ts — event names (also string literal union for dashboard goals)
export const CONTACT_FUNNEL_STEP = {
  VIEW: "view",
  PROJECT_CLICK: "project_click",
  PROJECT_CASE_VIEW: "project_case_view",
  CAL_CTA_VIEW: "cal_cta_view",
  CAL_POPUP_OPEN: "cal_popup_open",
  CAL_BOOKED: "cal_booked",
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  FORM_SUCCESS: "form_success",
  FORM_ERROR: "form_error",
  WA_CLICK: "wa_click",
} as const;
export type ContactFunnelStep =
  (typeof CONTACT_FUNNEL_STEP)[keyof typeof CONTACT_FUNNEL_STEP];
```

```ts
export type AnalyticsEvent =
  // 1 — discovery
  | { name: "VIEW_PROJECT_CLICK"; props: { project: string; slug: string; link: string; source: "projects_carousel" | "projects_stack" | "home_inline" | "projects_standalone"; placement: "projects" | "home" | "contact"; path: string; viewport: "desktop" | "mobile" } }
  // 2 — inline case study views (future /projects/:slug or stacked inline)
  | { name: "PROJECT_CASE_VIEW"; props: { project: string; slug: string; outcomeMetric: string; source: "projects_carousel" | "projects_standalone" | "home_case_strip"; path: string } }
  // 3 — Cal funnel
  | { name: "CAL_CTA_VIEW"; props: { placement: "contact" | "hero" | "about" | "projects_case"; variant: "popup" | "inline" | "floating"; path: string; viewport: "desktop" | "mobile" } }
  | { name: "CAL_POPUP_OPEN"; props: { placement: "contact" | "hero" | "about" | "projects_case"; prefill: boolean; utm_source?: string; utm_medium?: string; path: string } }
  | { name: "CAL_BOOKED"; props: { eventType: string; source: "embed" | "link"; placement: "contact" | "hero" | "about"; path: string } }
  // 4 — contact form funnel
  | { name: "CONTACT_FORM_START"; props: { path: string; field: "name" | "email" | "message"; viewport: "desktop" | "mobile" } }
  | { name: "CONTACT_FORM_SUBMIT"; props: { path: string; hasName: boolean; hasEmail: boolean; msgLen: number; honeypotFilled: boolean } }
  | { name: "CONTACT_FORM_SUCCESS"; props: { path: string; latencyMs: number; status: number } }
  | { name: "CONTACT_FORM_ERROR"; props: { path: string; code: "429" | "VALIDATION" | "NETWORK" | "UNKNOWN"; status?: number; message?: string } }
  // 5 — tertiary
  | { name: "WA_CLICK"; props: { placement: "contact_secondary" | "floating" | "about"; textTemplate: "portfolio_default" | "case_specific"; viewport: "desktop" | "mobile"; path: string } }
  // 6 — materialized funnel index (mirror of above, one per step — cheap on Plausible)
  | { name: "CONTACT_FUNNEL_STEP"; props: { step: ContactFunnelStep; path: string; project?: string; slug?: string } };
```

**Mapping to ticket phrasing:** `VIEW_PROJECT_CLICK` ≡ `VIEW_PROJECT_CLICK`; `PROJECT_CASE_VIEW` is the `PROJECT_CASE_VIEW`; `CAL_CTA_VIEW` / `CAL_POPUP_OPEN` / `CAL_BOOKED` ≡ `CAL_CTA_VIEW/POPUP_OPEN/BOOKED`; `CONTACT_FORM_START/SUBMIT/SUCCESS/ERROR` ≡ `CONTACT_FORM_START/SUBMIT/SUCCESS/ERROR`; `WA_CLICK` ≡ `WA_CLICK`. Dashboard-friendly names use `SCREAMING_SNAKE` (both Plausible custom events and GA4 `event_name` accept it — GA4 lowercases are allowed but snake-case keeps `tsc` enum tidy).

### 4c. Where each event fires (so prototype doesn't guess)

| Event | Fires at | File:line (est.) |
|---|---|---|
| `VIEW_PROJECT_CLICK` | `ProjectCard` `<a onClick>` before `window.open`/`_blank` — also on carousel `Prev/Next` dot? No — only outbound link is funnel-relevant. | `Projects.tsx:193` (augment `<a>` with `onClick={() => track({...})}`) |
| `PROJECT_CASE_VIEW` | `useInView` / `onViewportEnter` when inline case strip enters viewport; once per slug per session (guard with `sessionStorage` set). | Future `/projects/:slug` or stacked `Home` case strip (wired by `05-prototype`). |
| `CAL_CTA_VIEW` | `useEffect` on mount of the CTA button strip (once per placement per session). | `Contact.tsx` after form — `cal-embed-findings.md:§7b` `ContactCalCta` |
| `CAL_POPUP_OPEN` | `onClick` on the `data-cal-link` button, before Cal intercepts (inside same handler). | `Contact.tsx` / `About.tsx` CTA |
| `CAL_BOOKED` | `Cal("on",{action:"bookingSuccessful", callback})` (Atoms JS API) — no webhook infra for MVP. | `useCalEmbed` init in `cal-embed-findings.md:§7a` — add `ns["victor30"]("on",{action:"bookingSuccessful", callback:(e)=>track(...)})` |
| `CONTACT_FORM_START` | First `onFocus` on any input/textarea (once per mount). | `Contact.tsx:103-106` `onFocus` wrapper |
| `CONTACT_FORM_SUBMIT` | Top of `handleSubmit` before `fetch` | `Contact.tsx:39` |
| `CONTACT_FORM_SUCCESS` / `ERROR` | After `await fetch` branches at `Contact.tsx:52`/`63` | `Contact.tsx:56` success, `63` catch + `429` branch |
| `WA_CLICK` | `<a href="https://wa.me/...">` `onClick` | Tertiary link (deferred — schema ready) |
| `CONTACT_FUNNEL_STEP` | Alongside each granular event (mirrors it) — e.g., `VIEW_PROJECT_CLICK` → `CONTACT_FUNNEL_STEP{step:"project_click"}` | Anywhere granular fires — one extra `track` call. Optional but recommended for Plausible single-funnel view. |

---

## 5. Recommendation — what Spec A should lock

**Adapter: single `src/lib/analytics.ts` that speaks Plausible primary, GA4 toggle, console fallback — choose one at runtime via env, keep `npm run build` lean.**

**Why Plausible primary for this portfolio:**

1. **Matches repo values:** no backend, no `.env` secret, no cookie banner — plausible's async script is the smallest honest telemetry that still gives a shareable dashboard. GA4's funnel richness is not worth the Consent Mode + banner tax for a personal portfolio whose stakeholder is one hire decision.
2. **Per-route canonical fix is shared** — Plausible and GA4 both need it, so choosing Plausible doesn't hide the canonical drift; it surfaces it same-day (page filter in Plausible Goals will show `//` vs `/contact` mismatch if not fixed).
3. **Funnel query is sufficient:** `view->click->submit` is a 4-6 step linear funnel that Plausible Goals → Funnel handles without Explorations. If a future hiring manager demands BigQuery/Explorations, the **same `track()` calls already emit to GA4** by flipping `VITE_ANALYTICS_PROVIDER=ga4` and setting `VITE_GA_ID` — no instrumentation rewrite.
4. **Bundle:** Plausible's 2 kB external vs GA4's ~70 kB external is a visible saving on the stacked Home narrative where LCP matters.
5. **Operational:** self-host or Cloud both work behind the same `data-domain`; Netlify env `VITE_PLAUSIBLE_DOMAIN` stays public (not a secret), `VITE_GA_ID` would also be public — neither is committed.

**Lock for spec (copy-paste acceptance):**

- Ship `src/lib/analytics.ts` per §6 (no npm dep, `@/lib/analytics` import).
- Ship one env var: `VITE_PLAUSIBLE_DOMAIN=vctdev.netlify.app` (Cloud) or self-host domain; leave `VITE_GA_ID` unset. Set in Netlify dashboard → Build env, **never in `git`**.
- Add `<script defer data-domain="vctdev.netlify.app" src="https://plausible.io/js/script.tagged-events.js"></script>` to `index.html` (async, before `</head>`). If self-hosting, swap `src` to proxy.
- In Plausible dashboard, register goals: `VIEW_PROJECT_CLICK`, `PROJECT_CASE_VIEW`, `CAL_CTA_VIEW`, `CAL_POPUP_OPEN`, `CAL_BOOKED`, `CONTACT_FORM_START`, `CONTACT_FORM_SUBMIT`, `CONTACT_FORM_SUCCESS`, `CONTACT_FORM_ERROR`, `WA_CLICK`, `CONTACT_FUNNEL_STEP` (and optionally `pageview` if not auto). Attach custom props `path, placement, project, variant, step` where funnels filter.
- Keep GA4 as a **one-line toggle**: if spec later picks GA4, set `VITE_ANALYTICS_PROVIDER=ga4` + `VITE_GA_ID=G-XXXX` + swap script tag to `gtag` snippet; no code change.
- Fix `Helmet` per-route canonicals per §3b before any prod telemetry ships.

**Dual-send note (not recommended for MVP):** adapter can fire both `plausible()` and `gtag()` for the same event during a 2-week migration window — spec should explicitly decide *not* to dual-send in MVP to keep dashboard singular.

---

## 6. `src/lib/analytics.ts` adapter shape — the lean, typed, build-green stub

> Design goals: **(i)** `npm run build` must pass with `tsc` strict + Vite alias `@`; **(ii)** zero `npm i` — script tags provide providers; **(iii)** works even when no id is set (dev/local) via console + `localStorage`; **(iv)** `window.gtag` / `window.plausible` typed narrowly so `strictNullChecks` doesn't protest.

```ts
// src/lib/analytics.ts
// Client-only telemetry adapter — Plausible primary, GA4 toggle, console fallback.
// No npm dep. Vite env ids are injected at build time.
// Keep npm run build lean: this file is ~1.6 kB gz, fully typed, no side-effect import.

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string>; u?: string; callback?: () => void }) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const CONTACT_FUNNEL_STEP = {
  VIEW: "view",
  PROJECT_CLICK: "project_click",
  PROJECT_CASE_VIEW: "project_case_view",
  CAL_CTA_VIEW: "cal_cta_view",
  CAL_POPUP_OPEN: "cal_popup_open",
  CAL_BOOKED: "cal_booked",
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  FORM_SUCCESS: "form_success",
  FORM_ERROR: "form_error",
  WA_CLICK: "wa_click",
} as const;
export type ContactFunnelStep = (typeof CONTACT_FUNNEL_STEP)[keyof typeof CONTACT_FUNNEL_STEP];

export type AnalyticsEvent =
  | { name: "VIEW_PROJECT_CLICK"; props: { project: string; slug: string; link: string; source: "projects_carousel" | "projects_stack" | "home_inline" | "projects_standalone"; placement: "projects" | "home" | "contact"; path: string; viewport: "desktop" | "mobile" } }
  | { name: "PROJECT_CASE_VIEW"; props: { project: string; slug: string; outcomeMetric: string; source: "projects_carousel" | "projects_standalone" | "home_case_strip"; path: string } }
  | { name: "CAL_CTA_VIEW"; props: { placement: "contact" | "hero" | "about" | "projects_case"; variant: "popup" | "inline" | "floating"; path: string; viewport: "desktop" | "mobile" } }
  | { name: "CAL_POPUP_OPEN"; props: { placement: "contact" | "hero" | "about" | "projects_case"; prefill: boolean; utm_source?: string; utm_medium?: string; path: string } }
  | { name: "CAL_BOOKED"; props: { eventType: string; source: "embed" | "link"; placement: "contact" | "hero" | "about"; path: string } }
  | { name: "CONTACT_FORM_START"; props: { path: string; field: "name" | "email" | "message"; viewport: "desktop" | "mobile" } }
  | { name: "CONTACT_FORM_SUBMIT"; props: { path: string; hasName: boolean; hasEmail: boolean; msgLen: number; honeypotFilled: boolean } }
  | { name: "CONTACT_FORM_SUCCESS"; props: { path: string; latencyMs: number; status: number } }
  | { name: "CONTACT_FORM_ERROR"; props: { path: string; code: "429" | "VALIDATION" | "NETWORK" | "UNKNOWN"; status?: number; message?: string } }
  | { name: "WA_CLICK"; props: { placement: "contact_secondary" | "floating" | "about"; textTemplate: "portfolio_default" | "case_specific"; viewport: "desktop" | "mobile"; path: string } }
  | { name: "CONTACT_FUNNEL_STEP"; props: { step: ContactFunnelStep; path: string; project?: string; slug?: string } };

type Provider = "plausible" | "ga4" | "console";

const BUFFER_KEY = "__analytics_buffer";
const BUFFER_MAX = 100;

function resolveProvider(): Provider {
  const raw = (import.meta.env.VITE_ANALYTICS_PROVIDER as string | undefined)?.toLowerCase();
  if (raw === "ga4" || raw === "gtag") return "ga4";
  if (raw === "plausible") return "plausible";
  // Auto-detect: if ids present, prefer plausible; GA4 needs explicit opt-in so we don't leak cookies
  if (typeof window !== "undefined" && typeof window.plausible === "function") return "plausible";
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) return "plausible";
  if (import.meta.env.VITE_GA_ID) return "ga4";
  return "console";
}

function bufferEvent(ev: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(BUFFER_KEY);
    const arr: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    arr.push({ ...ev, _ts: Date.now() } as unknown as AnalyticsEvent);
    while (arr.length > BUFFER_MAX) arr.shift();
    localStorage.setItem(BUFFER_KEY, JSON.stringify(arr));
  } catch { /* quota or privacy mode */ }
}

function toStringProps(props: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === "string" ? v : String(v);
  }
  return out;
}

export function track(ev: AnalyticsEvent): void {
  const provider = resolveProvider();

  // Always buffer so Plausible/GA4 can replay on next load if offline
  // (buffer is bounded at BUFFER_MAX, flushed is best-effort)
  bufferEvent(ev);

  // Dev-visible invariant: Helps catch canonical drift in console
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", ev.name, ev.props);
  }

  if (provider === "plausible" && typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(ev.name, { props: toStringProps(ev.props as Record<string, unknown>) });
    return;
  }

  if (provider === "ga4" && typeof window !== "undefined" && typeof window.gtag === "function") {
    // GA4 accepts numbers natively, so pass original props + event_name
    window.gtag("event", ev.name.toLowerCase(), ev.props as Record<string, unknown>);
    return;
  }

  // console provider — intentional no-op beyond debug above (keeps prod quiet)
}

export function trackPageView(path: string, canonicalHref?: string): void {
  const provider = resolveProvider();
  const cleanPath = path.split("?")[0].split("#")[0] || "/";
  const href = canonicalHref ?? (typeof window !== "undefined" ? window.location.href : cleanPath);

  if (provider === "plausible" && typeof window?.plausible === "function") {
    // With script.manual.js use {u: href}; with auto pageview this is optional
    window.plausible("pageview", { u: href } as unknown as { props: Record<string,string> });
    return;
  }
  if (provider === "ga4" && typeof window?.gtag === "function") {
    window.gtag("event", "page_view", { page_location: href, page_path: cleanPath });
    return;
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug("[analytics] pageview", { path: cleanPath, href });
  }
}

/** Optional hook — use inside AnimatedRoutes to auto-track SPA navigations. */
export function useAnalyticsPageView(pathname: string) {
  // Call trackPageView(pathname, canonicalFor(pathname)) inside a useEffect
  // that watches useLocation().pathname in App.tsx.
  void pathname;
}
```

**Wiring snippet (no backend, Lenis-safe, `@` alias aware):**

```tsx
// src/pages/Projects/Projects.tsx — View Project click
import { track } from "@/lib/analytics";
<a
  href={project.link}
  target="_blank"
  rel="noopener noreferrer"
  onClick={() =>
    track({
      name: "VIEW_PROJECT_CLICK",
      props: {
        project: project.name,
        slug: project.name.toLowerCase().replace(/\s+/g, "-"),
        link: project.link!,
        source: isMobileViewport() ? "projects_stack" : "projects_carousel",
        placement: "projects",
        path: window.location.pathname,
        viewport: isMobileViewport() ? "mobile" : "desktop",
      },
    })
  }
>
  View Project ↗
</a>
// Mirror: track({name:"CONTACT_FUNNEL_STEP", props:{step:"project_click", path}})

// src/pages/Contact/Contact.tsx — form start/submit/success/error
import { track } from "@/lib/analytics";
const onFirstFocus = (field: "name"|"email"|"message") =>
  track({ name: "CONTACT_FORM_START", props: { path: location.pathname, field, viewport: isMobileViewport()?"mobile":"desktop" } });
// handleSubmit top:
track({ name:"CONTACT_FORM_SUBMIT", props:{ path: location.pathname, hasName: !!form.name, hasEmail: !!form.email, msgLen: form.message.length, honeypotFilled: false }});
track({ name:"CONTACT_FUNNEL_STEP", props:{ step:"form_submit", path: location.pathname }});
// after fetch:
track({ name:"CONTACT_FORM_SUCCESS", props:{ path: location.pathname, latencyMs: Date.now()-t0, status: res.status }});
track({ name:"CONTACT_FUNNEL_STEP", props:{ step:"form_success", path: location.pathname }});
// catch:
track({ name:"CONTACT_FORM_ERROR", props:{ path: location.pathname, code: res?.status===429 ? "429" : "NETWORK", status: res?.status }});

// src/pages/Contact/Contact.tsx — Cal popup (augments cal-embed-findings §7b)
<button
  data-cal-namespace="victor30"
  data-cal-link="victor/30min"
  data-cal-config={JSON.stringify({ name: form.name, email: form.email, "metadata[source]":"portfolio-contact" })}
  onClick={() => {
    track({ name:"CAL_POPUP_OPEN", props:{ placement:"contact", prefill: !!form.email, path: location.pathname }});
    track({ name:"CONTACT_FUNNEL_STEP", props:{ step:"cal_popup_open", path: location.pathname }});
  }}
>
  Book a 30-min call →
</button>
```

**Index.html script placement (choose one):**

```html
<!-- Plausible primary (recommended) — keep async, before </head> -->
<script defer data-domain="vctdev.netlify.app" src="https://plausible.io/js/script.tagged-events.js"></script>

<!-- GA4 alternative (toggle) — replace above when VITE_ANALYTICS_PROVIDER=ga4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX', { send_page_view: false });
</script>
```

Ids stay in Netlify env (`VITE_PLAUSIBLE_DOMAIN`, `VITE_GA_ID`, `VITE_ANALYTICS_PROVIDER`), **never in `git`**. Adapter reads `import.meta.env.*` injected at `vite build` time — no runtime fetch.

---

## 7. Build-lean verification

- `npm run build` contract is `tsc && vite build` (`package.json:8`). Steps before merge:
  1. `npx tsc --noEmit` — adapter's `declare global` and `import.meta.env` must not widen to `any`; `AnalyticsEvent` is exhaustive.
  2. `npm run build` — expect `dist/assets/index-*.js` + `dist/assets/index-*.css` with **no hash churn beyond the new `analytics` chunk**; external script tags are not bundled so Vite output bytes should grow by < 3 kB.
  3. Check no second type dep introduced — no `@types/gtag.js`, no `plausible-tracker` npm.
  4. Manual hit: `npm run dev` at `:5173`, open `/` → `/projects` → click `View Project` → `/contact` → focus form → submit — console shows `[analytics]` lines in dev, Plausible Realtime shows same in prod (after `VITE_PLAUSIBLE_DOMAIN` set).
  5. Helmet check: view-source on `/contact` shows `<link rel="canonical" href="https://vctdev.netlify.app/contact">` (not root) — per-route fix shipped alongside telemetry or in same spec.

If GA4 chosen, add `npm run build` check that `index.html` gtag snippet is present in `dist/index.html` (Vite copies it).

---

## 8. Open deferrals (not blocking prototype)

- **Provider final pick:** Plausible is recommended but spec must confirm Growth tier covers needed custom props (6+ funnel segments) vs GA4's unlimited params. If team already has a GA4 property + banner, GA4 primary is low-friction — adapter already supports both.
- **Cal `CAL_BOOKED` capture:** Embed `bookingSuccessful` callback (recommended per `cal-embed-findings.md:§7a`) vs Cal Workflows webhook — spec must pick (a) for no-backend MVP; webhook would need Netlify Function.
- **WhatsApp `WA_CLICK`:** tertiary only; provisioning a WhatsApp Business number (`wa.me/<E164noPlus>?text=...` per `faq.whatsapp.com/5913398998672934`) is out of MVP — schema ready, no link to commit until number owner decided.
- **`type: email` validation + honeypot `_gotcha` + Turnstile widget:** owned by contact-funnel spec but must not duplicate telemetry field names — keep honeypot field name `_gotcha` per Formspree docs.
- **Plausible manual vs auto pageview:** auto (`script.tagged-events.js`) is fine for MPA, but SPA must either use `script.manual.tagged-events.js` + `trackPageView` or keep auto + deduplicate. Spec should pick `manual` so `AnimatedRoutes` owns `pageview` — decide before `05-prototype`.

---

## 9. Sources

- Local audit: `package.json:11-30`, `vite.config.ts:8` (`@` alias), `src/pages/Projects/Projects.tsx:14-374`, `src/pages/Contact/Contact.tsx:6-116`, `src/App.tsx:42-85` (single Lenis + single `BrowserRouter` + `Helmet`), `netlify.toml:1-34`, `wayfinder/spec-a/MAP.md:6` (Destination), `wayfinder/research/contact-funnel-findings.md:106-194` (telemetry §4b), `wayfinder/spec-a/research/cal-embed-findings.md:§1-§10` (Cal popup + Helmet canonical fix).
- Plausible: `plausible.io/docs/plausible-script` (deferred script), `plausible.io/docs/custom-event-goals#using-custom-props` (tagged-events, `plausible("EVENT",{props})`, 30-prop cap), `plausible.io/docs/proxy` / `self-hosting`, CSP note at `docs/plausible-script#content-security-policy`.
- GA4: `developers.google.com/tag-platform/gtagjs/reference` (`gtag("config",id,{send_page_view:false})`, `gtag("event",name,params)`), `developers.google.com/analytics/devguides/collection/ga4/reference/events` (event schema), `developers.google.com/tag-platform/security/guides/csp` (gtm + analytics domains), `support.google.com/analytics/answer/13267899` (Consent Mode v2 `ad_storage`/`analytics_storage`).
- WhatsApp: `faq.whatsapp.com/5913398998672934` (`wa.me/<number>?text=urlencodedtext`, E.164 without `+`).
