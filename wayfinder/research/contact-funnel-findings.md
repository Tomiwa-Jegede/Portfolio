# Research Findings — Contact funnel shape without backend

> Branch: `research/contact-funnel` | Ticket: [`04-research-contact-funnel`](../tickets/04-research-contact-funnel.md) | Map: [`wayfinder/MAP.md`](../MAP.md) | Date: 2026-09-02 | Type: `wayfinder:research` (AFK)

## Checkout pointer

Findings live on this branch at `wayfinder/research/contact-funnel-findings.md`. Follow-on Spec map A (contact + funnel telemetry) should adopt the **Recommendation §5** without re-research. No ticket closed here — this is the AFK asset that feeds the spec. Blocked by `02-grilling-positioning-comprehension` only for copy, not for shape.

---

## 1. What the repo ships today (drift to correct)

### Current implementation under audit

- `src/pages/Contact/Contact.tsx:6-71` — Functional form with `useState({name,email,message})`, `localStorage("contactDraft")` hydrate at `:18-28` and persist at `:68-71`, `fetch("https://formspree.io/f/xjyvbvkv", {method:"POST", headers: {"Content-Type":"application/json", Accept:"application/json"}, body: JSON.stringify(form)})` at `:43-50`. States `idle|sending|sent|error`, clears draft on success at `:62`, disables button while `sending` at `:107`. No honeypot, no captcha widget, no field-level error rendering, no rate-limit (429) branch, no telemetry.
- `netlify.toml:1-34` — SPA fallback (`/* -> /index.html 200`) and asset cache headers only. **No `[[forms]]` / `data-netlify` handling** — Netlify Forms not enabled. Builds stay static SPA.
- `product-management/value-map.md:18` — V3 (Potential SMB client) is `PARTIAL`. Gap note `:25` still says *"CTA exists but no form/email backend and no inquiry event"* — **drift**: code *does* post to Formspree, so value-map must be patched to `PARTIAL → DELIVERED` once spam/telemetry decisions land. Cross-gap `:25` and `value-chain-opportunities/MAP.md:16` Opportunity #1 ("form + email delivery + spam guard — #1 pipeline lift") still treat contact as link-only.
- `delivery-management/milestone-2.md:12-17` explicitly deferred *"Full contact form with backend/email delivery"* as non-goal — also drift; `roadmap.md:54` M2 tracker still says "no contact form yet".
- `package.json:11-19` — No `@formspree/react`, no Cal embed script, no analytics dep. Stack is React 18 + Vite 5 + Tailwind 3 + Framer 11; any addition must stay client-only.

**Net takeaway:** cheapest path keeps the existing Formspree AJAX post (no backend, no `.env`), but must decide spam guard + UX polish + telemetry before Spec map A can write acceptance criteria.

---

## 2. Options considered (no backend, no secrets committed)

### 2a. Formspree (current) — what docs actually say

**Posting:** `POST https://formspree.io/f/{hashid}` with either `FormData` or `JSON + Accept: application/json` — current code uses the JSON variant, which is supported. `hashid` (`xjyvbvkv`) is public by design, not a secret; never put API keys in client.

Sources: `help.formspree.io/.../submit-forms-with-javascript-ajax`, `@formspree/react` (`useForm` hook) as optional wrapper — not required; raw `fetch` is idiomatic for this SPA.

**Spam guards available (all plans):**

| Guard | How it works | Effort in `Contact.tsx` | Docs |
|---|---|---|---|
| **Honeypot `_gotcha`** | Hidden `<input name="_gotcha" style="display:none">`; if filled, Formspree silently drops. | 1 line + CSS | `help.formspree.io/.../honeypot-spam-filtering` |
| **reCAPTCHA v2** (default on, toggle per-form) | Checkbox challenge at dashboard `Settings → Spam protection`. Optional custom site key via `g-recaptcha-response`. | 0 code if default; 2 lines if custom key | `help.formspree.io/.../recaptcha-settings` |
| **Cloudflare Turnstile** (privacy-friendly) | Add `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js">` + `<div class="cf-turnstile" data-sitekey="...">`; Formspree verifies `cf-turnstile-response` with secret stored in dashboard (not in repo). | 3 lines + dashboard secret | `help.formspree.io/.../protecting-your-forms-with-cloudflare-turnstile` |
| **Domain restriction** | Dashboard `Restrict to Domain` rejects posts from other origins. | 0 code | `help.formspree.io/.../restrict-to-domain` |
| **Formshield / Advanced spam** | ML smart filter (Neutral/Aggressive/Relaxed) + classifiers (crypto, fraud, spammy URLs). Business plan for custom thresholds. | Dashboard toggle | `help.formspree.io/.../advanced-spam-filtering` |
| **Blocklist / Form Rules** | Business plan: flag if body contains phrases/URLs. | Dashboard | `help.formspree.io/.../setting-a-blocklist` |

**Rate limits (system-wide, all plans):** `20 posts/minute` per form; AJAX receives `429` with JSON error. Free Tier: 50 submissions/month Soft (form pauses). Must render 429 as "try again" not generic error.

Source: `help.formspree.io/.../system-limits`.

**Netlify Forms alternative (read `netlify.toml`):** Zero external dep — add `<form name="contact" data-netlify="true" netlify-honeypot="bot-field">` with hidden `form-name` input + `/_redirects` SPA fallback already present. Spam via `data-netlify-recaptcha="true"` or honeypot. Tradeoff: submissions live in Netlify dashboard (not email-forwarded unless configured), AJAX requires `Content-Type: application/x-www-form-urlencoded` and build-time form detection (must ship a static HTML stub). Migration cost ~1h, but gains nothing over Formspree unless team wants to consolidate on Netlify. **Not recommended** for this cycle — keep Formspree, avoid churning `netlify.toml`.

### 2b. Cal.com booking — docs consulted

- **Product:** `cal.com/embed` + `cal.com/help/embedding/*`. Four embed modes: **Inline**, **Pop-up via element click**, **Floating pop-up button**, **Email embed**. Snippet is generated per event type in app (`cal.com` dashboard → Event type → Share → Embed). No API key needed for embed; API keys only for programmatic booking (`api.cal.com/v2`).
- **Integration shapes:**

| Mode | Snippet essence | UX | When to choose |
|---|---|---|---|
| Inline | `<Cal calLink="victor/30min" config={{...}} />` or `Cal("inline", {elementOrSelector:"#my-cal-inline", calLink:"..."})` | Calendar lives inside Contact section | High commitment, but pushes form below fold; heavy on mobile |
| **Pop-up via element click** (recommended) | `Cal("ui", {styles:{branding:{brandColor:"#7c3aed"}}, hideEventTypeDetails:false});` + `<button data-cal-link="victor/30min" data-cal-config='{"name":"..."}'>Book a call</button>` | Button → modal overlay; page stays | Best for dual funnel — form stays primary |
| Floating button | `Cal("floatingButton", {...})` | Persistent bottom-right circle | Always visible, but collides with portfolio's custom cursor + glass aesthetic |
| Email embed | Link `cal.com/victor/30min` with UTM | Leaves site | Fallback, not embed |

Source: `cal.com/embed`, `cal.com/help/embedding/adding-embed`, `cal.com/help/embedding/prefill-booking-form-embed`.

- **Prefill:** `config: {name, email, "metadata[source]": "portfolio-contact", location: JSON.stringify({value:"phone", optionValue:"+..."}), notes: "..."}`. UTM params (`utm_source`, `utm_medium`, `utm_campaign`) are auto-captured via query string. Demo: `cal.com/victor/30min?utm_source=portfolio&utm_medium=contact_cta`.
- **Effort:** Create Cal account + 30-min event type with Buffer + Workflows (confirm email) + copy one `<script>` + one button. Theming via `brandColor` to match `violet-600→cyan-500` gradient. No `npm install` needed (script tag) or `@calcom/embed-react` if preferring ESM.
- **A11y / perf:** Cal embed injects iframe; modal traps focus correctly, respects `prefers-reduced-motion` internally. Lazy-load the script (`async defer`) and init on interaction to avoid blocking LCP. Does not conflict with single Lenis (`App.tsx:42`) — iframe scroll is isolated.

### 2c. WhatsApp `wa.me` click-to-chat — conventions

Official Help Center: `faq.whatsapp.com/5913398998672934` — format is **`https://wa.me/<number>`** where `<number>` is full number in international format, digits only, no `+`, no `0`, no dashes/brackets.

- Example US `+1 (555) 867-5309` → `https://wa.me/15558675309`. India example: `https://wa.me/919876543210`.
- Old `api.whatsapp.com/send?phone=...` still works but `wa.me` is canonical (shorter, recommended).
- **Pre-filled text:** `https://wa.me/<number>?text=urlencodedtext` — message appears in chat box, user taps Send. Spaces → `%20`, commas → `%2C`, encode via `encodeURIComponent("Hi Victor — interested in a revenue system for …")`. Per-channel tracking by varying `text` param (e.g., `?text=Hi%20from%20portfolio%2Fcontact%20—%20` plus page path).
- Behavior: if WhatsApp installed (mobile), opens app; on desktop, redirects to `web.whatsapp.com`. No spam guard — number is scrapable. Must use a **dedicated business number** (WhatsApp Business app or Cloud API) if volume expected; personal numbers risk restriction with automation.
- Effort: one `<a href="https://wa.me/...">` + optional `rel="noopener"` — trivial. Telemetry via `onClick` analytics event only.

Sources: `faq.whatsapp.com/…/click-to-chat`, `api.whatsapp.com` conventions, community prefill guides (all consistent on encoding rules).

---

## 3. Comparison table (Spec-map-A ready)

| Funnel shape | Effort (dev + ops) | Conversion lift vs current `Contact.tsx` | Spam / abuse guard | Telemetry event shape (decide pre-spec) | Cost / vendor lock |
|---|---|---|---|---|---|
| **A — Form-only (harden current Formspree)** | **S** — 0.5 day. Add honeypot `_gotcha` + Turnstile or reCAPTCHA toggle + 429 branch + field errors (`ValidationError` or manual), `Restrict to Domain` in dashboard. No new dep. | Baseline. Async intent capture; +30-60% vs link-only per `value-chain-opportunities/MAP.md:1` ranking, but single path — high-intent buyers still must wait for email reply. | Honeypot + Formshield Neutral + domain restrict. Turnstile preferred (frictionless, a11y, no checkbox). No secret in repo. | `CONTACT_FORM_VIEW {path, viewport:"desktop|mobile", referrer}` · `CONTACT_FORM_SUBMIT {fields:"name,email,message", hasPrefill:boolean}` · `CONTACT_FORM_SUCCESS {latencyMs, status:200}` · `CONTACT_FORM_ERROR {code:"429|VALIDATION|NETWORK", message}` | Free 50/mo, then $10/mo. Hashid public. No backend. |
| **B — Form + Cal.com (element-click popup) ⭐ recommended** | **M** — 1-1.5 days. A + Cal 30-min event + one script tag (`https://app.cal.com/embed/embed.js`) + button `data-cal-link="victor/30min"` + prefill wiring + theme `brandColor`. No npm if script tag. | **Highest.** Dual path = async (form) + sync (calendar). Captures both "send message" and "book now" cohorts; Cal's own data + case studies claim inline/pop-up lifts meeting conversion vs link-only by not leaving site. Closes V3 gap completely: visitor knows *how* to engage *now*. | Same as A for form; Cal uses its own bot checks + calendar availability as natural spam gate (spammers can't hold slots without email). No extra spam work for Cal. | All of A plus `CAL_CTA_VIEW {variant:"popup_button", placement:"contact"}` · `CAL_POPUP_OPEN {prefill:{name,email}, utm:{source,medium,campaign}}` · `CAL_BOOKED {eventType:"30min", durationMin:30}` (via Cal Workflows webhook or `onBooked` callback if using Atoms). Optional funnel: `CONTACT_FUNNEL {step:"form_view|form_submit|cal_open|cal_booked|wa_click"}` | Cal free for solo host; inline/popup included. If volume → $15/mo Teams. No secret in repo. |
| **C — Form + Cal + WhatsApp (`wa.me`) secondary** | **M+** — 2 days. B + `https://wa.me/<E164noPlus>?text=Hi%20Victor%20—%20from%20portfolio%20…` with `encodeURIComponent`, conditional display (mobile prominent, desktop tertiary). Needs business number decision + privacy copy. | Marginal over B for global/SMB WhatsApp-heavy markets (e.g., EMEA, LATAM, India); near-zero lift in US recruiter funnel and may *fragment* pipeline (leads scattered across email, calendar, WhatsApp). Can cannibalize calendar if WA is too prominent. | WA has **no server guard** — number exposed to scrapers, `wa.me` links are crawlable. Mitigate with business number + rate-limit via WhatsApp Business settings, but no Formspree-equivalent. | Add `WA_CLICK {placement:"contact_secondary", textTemplate:"portfolio_default", viewport}` · `WA_PREFILL_USED {hasCustomText:boolean}`. Funnel becomes 3-way — must define primary vs secondary attribution before Plausible/GA. | Free. Risk: personal number exposure; Business app free, Cloud API metered ($0.02-0.08/msg after free tier). |
| **D — Netlify Forms (swap Formspree)** | **M** — 1 day migrate + test build-time detection. Hidden static form stub, `data-netlify="true"`, honeypot, recaptcha via `data-netlify-recaptcha`. | Same as A (async only). No lift over A; only value is consolidating on Netlify if team prefers. | Netlify honeypot + Akismet + optional reCAPTCHA 2. Dashboard spam filter weaker than Formspree's Formshield. | Same as A but events fire via `fetch("/", {body: new URLSearchParams(...)})` 200 check. | Free 100/mo (Netlify Starter). Vendor lock to Netlify. |

> Effort scale: **S** <1d, **M** 1-2d, **L** 3d+. All assume no analytics infra built yet — telemetry is `gtag`/`plausible` or a 20-line `useAnalytics()` wrapper (see §4).

---

## 4. Decisions Spec map A must lock **before** writing acceptance criteria

These are blocking because copy, layout, and a11y depend on them — but shape does not (hence this research is not blocked beyond `02` positioning copy).

### 4a. Spam / guard choices (pick exactly one CAPTCHA path)

1. **Honeypot:** Ship `name="_gotcha"` hidden with `position:absolute; left:-9999px` (not `display:none` — bots ignore `display:none` less). Always on. (Formspree docs: `honeypot-spam-filtering`).
2. **CAPTCHA widget:** **Recommendation: Cloudflare Turnstile** over reCAPTCHA v2. Rationale: no checkbox friction, better a11y, no Google cookie, `Turnstile` auto-verified by Formspree with secret stored in dashboard. If team wants zero JS, keep reCAPTCHA v2 default-on (no code) — but Turnstile is 3 extra lines and wins on conversion + privacy. Decide in spec: `Turnstile=managed` vs `reCAPTCHA=default` vs `none+honeypot-only` (aggressive Formshield will compensate but not guaranteed).
3. **Dashboard settings to set now (not code):** `Restrict to Domain = vctdev.netlify.app + localhost` + `Formshield = Neutral` (tighten to Aggressive only if spam observed) + notification email + optional Slack/Notion webhook. Must not commit secret — Turnstile secret stays in Formspree dashboard, sitekey is public.
4. **Rate-limit UX:** On `429` show "You're sending too fast — try again in a minute" (not generic "error"). Disable button during `sending` (already at `:107`) and keep it disabled until response — prevents double-click per `system-limits` guidance.

### 4b. Telemetry / event shape (fog: `wayfinder/MAP.md:28`)

Map currently lists fog `VIEW_PROJECT_CLICK + CONTACT_SUBMIT + CAL_BOOK` — must be sharpened to typed events so M3 can measure funnel without re-instrumenting.

**Proposed minimal schema (no backend, forward-compatible with Plausible/GA4/Mixpanel):**

```ts
// lib/analytics.ts — 20 lines, no dep
export type AnalyticsEvent =
  | { name: "CONTACT_FORM_VIEW"; props: { path: string; viewport: "desktop"|"mobile"; referrer: string } }
  | { name: "CONTACT_FORM_SUBMIT"; props: { hasName: boolean; hasEmail: boolean; msgLen: number } }
  | { name: "CONTACT_FORM_SUCCESS"; props: { latencyMs: number } }
  | { name: "CONTACT_FORM_ERROR"; props: { code: "429"|"VALIDATION"|"NETWORK"|"UNKNOWN"; status?: number } }
  | { name: "CAL_CTA_VIEW"; props: { placement: "contact"|"hero"|"about"; variant: "popup"|"inline"|"floating" } }
  | { name: "CAL_POPUP_OPEN"; props: { prefill: boolean; utm_source?: string } }
  | { name: "CAL_BOOKED"; props: { eventType: string; source: "embed"|"link" } }  // via Cal webhook or `Cal("on", {action:"bookingSuccessful"})`
  | { name: "WA_CLICK"; props: { placement: string; textTemplate: string } }
  | { name: "CONTACT_FUNNEL_STEP"; props: { step: "view"|"submit"|"cal_open"|"cal_booked"|"wa_click"; path: string } };

// dispatch: window.gtag?.("event", name, props) || plausible?.(name, {props}) || console.debug in dev
```

Decisions to lock:

- **Provider:** `plausible` (privacy, no cookie banner) vs `GA4 via gtag` (richer funnel) vs **no provider yet** (console-only + `localStorage` buffer that spec can swap). Recommendation: spec calls for `analytics.ts` adapter with `gtag` primary and `console` fallback so events ship even before GA id is set (id stays in Netlify env, never committed).
- **Cal booked capture:** Embed `bookingSuccessful` callback (Atoms) vs relying on Cal Workflows email/webhook — spec must pick one; callback gives instant `CAL_BOOKED` without webhook infra.
- **WA attribution:** If WA added, encode `text=Hi%20from%20portfolio%2F${pathname}` so replies are attributable without UTM.

### 4c. UX / placement decisions

- **Primary vs secondary CTA hierarchy:** Form is primary (async, qualifies), Cal popup is **co-primary but visually secondary** — one line: "Prefer to talk live? Book 30 min →" below form, not competing above. If WA added, it is **tertiary text link** ("or message on WhatsApp") — avoids cannibalization.
- **Inline vs popup Cal:** **Popup via element click** wins — keeps Contact section scannable, avoids 600px iframe on mobile, preserves glass aesthetic, no LCP hit. Inline only if spec wants "schedule-first" positioning (depends on grilling ticket `02` outcome promise).
- **Form UX gaps to close in spec:** field-level `aria-invalid` + `ValidationError`, honeypot, Turnstile widget placement, `localStorage` draft clear on success (already), max `message` length (e.g., 2000 chars), email `type="email"` validation message, `prefers-reduced-motion` on button `whileHover` (gate with `MotionConfig`).

### 4d. Number / account decisions (if WA or Cal chosen)

- **Cal account:** Who owns `cal.com/victor` namespace? Use `victor/30min` event type, 30-min, buffer 15 min, timezone auto, GCal sync. Create before spec dev.
- **WhatsApp number:** Personal vs business — spec must declare. If WA is in scope, provision a WhatsApp Business number and confirm `wa.me` link uses E.164 without `+` nor separators. Document in spec; do not hardcode personal number in public repo without consent.

---

## 5. Recommendation for follow-on Spec map A

**Adopt shape B — `Form (hardened) + Cal.com (popup via element click)` — as the Spec map A baseline; keep WA as an optional follow-on, not in MVP.**

Rationale:

1. **Closes V3 gap fully without backend.** `value-map.md:25` gap is "CTA exists but no form/email backend and no inquiry event" — B closes both: Formspree already delivers email + can forward to Slack/Notion via plugins, Cal delivers instant booking. Both are no-backend, no secret in repo, no `netlify.toml` change. Drift between code (has Formspree) and value-map (says no backend) is resolved by hardening + telemetry rather than swapping vendor.
2. **Highest pipeline lift for lowest lift.** Per `value-chain-opportunities/MAP.md:1` this is ranked #1 opportunity ("Highest conversion lift: turns proof into pipeline"). Form alone leaves high-intent buyers waiting on email; Wa alone fragments; B serves both cohorts with ~1 day cost. Cal's 4 embed modes were evaluated — popup keeps portfolio's motion language intact, unlike inline which would dominate the contact section on mobile.
3. **Spam / a11y trade is best.** Turnstile + honeypot + Formshield on Formspree is frictionless (no checkbox) vs reCAPTCHA; Cal adds no new spam surface (availability-gated). WA would add an unscraped phone number and split attribution — defer until spec proves B insufficient for WhatsApp-heavy outbound.
4. **Telemetry is additive.** B yields three measurable funnel steps (`FORM_SUBMIT → CAL_OPEN → CAL_BOOKED`) that directly realise the fog events (`wayfinder/MAP.md:28` `VIEW_PROJECT_CLICK + CONTACT_SUBMIT + CAL_BOOK`). Spec can instrument with a single 20-line `analytics.ts` adapter and ship even before a GA id exists.
5. **Preserves prefs + DoD.** No second Lenis, single `BrowserRouter`, `AnimatePresence mode="wait"` remain; `npm run build` still passes (script tag is async, or `@calcom/embed-react` is tree-shaken). `768px` guard unchanged. Works standalone (`Contact.tsx:6 standalone prop`) and inside Home pin.
6. **WA deferral is cheap to reverse.** If grilling ticket `02` decides positioning is WhatsApp-native (e.g., SMBs in WA-first markets), spec can add `wa.me` as a tertiary link in one commit without touching form/Cal logic — prefill convention (`?text=`) and telemetry shape are already defined here (§2c, §4b).

**Spec map A acceptance (copy-paste for ticket):**

- Form keeps Formspree `xjyvbvkv` (or rotated id if team wants), adds `name="_gotcha"` honeypot + Turnstile widget (`cf-turnstile` + `cf-turnstile-response` via `FormData` variant or JSON + `headers: {Accept:"application/json"}` + token field) + domain restrict + `429` branch.
- Contact shows form as primary + "Book a 30-min call →" button (`data-cal-link`, `Cal("ui",...)`) opening modal; modal traps focus, `Esc` closes, `prefill: {name,email}` from form if available, `utm_source=portfolio&utm_medium=contact` auto-tagged.
- `lib/analytics.ts` ships typed events above; `CONTACT_FORM_*` + `CAL_*` fire in dev console even without GA id; GA/Plausible id stays in Netlify env var, never in `git`.
- WA not in MVP; spec notes `wa.me/<E164>?text=Hi%20from%20portfolio…` as follow-on with business-number owner TBD.

---

## 6. Sources

- Local audit: `src/pages/Contact/Contact.tsx:6-71`, `netlify.toml:1-34`, `product-management/value-map.md:18-25`, `product-management/value-chain-opportunities/MAP.md:1`, `delivery-management/roadmap.md:54`, `delivery-management/milestone-2.md:12-17`, `package.json:11-30`, `wayfinder/MAP.md:7-30`.
- Formspree: `help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax` — AJAX JSON + `Accept` header, `@formspree/ajax` `initForm` lifecycle.
- Formspree: `help.formspree.io/articles/building-your-form/honeypot-spam-filtering` — `_gotcha` field, silent drop.
- Formspree: `help.formspree.io/articles/form-and-project-settings/recaptcha-settings` — reCAPTCHA toggle, machine-learning, per-form disable.
- Formspree: `help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile` — sitekey + secret, `cf-turnstile-response`, AJAX `FormData` pattern.
- Formspree: `help.formspree.io/articles/advanced-features/advanced-spam-filtering` — Formshield smart filter + classifiers.
- Formspree: `help.formspree.io/articles/troubleshooting/how-to-prevent-spam` — restrict-to-domain, email-url vs hashid, blocklist.
- Formspree: `help.formspree.io/articles/form-and-project-settings/system-limits` — 20 posts/min, 429, plan monthly limits.
- Formspree: `help.formspree.io/articles/working-with-react/the-formspree-react-library` — `useForm` hook, `ValidationError`, `useSubmit`.
- Cal.com: `cal.com/embed` — four embed types (inline, floating button, element-click popup, email), prefill, UTM capture, snippet generator.
- Cal.com: `cal.com/help/embedding/adding-embed` — inline vs popup vs floating button usage.
- Cal.com: `cal.com/help/embedding/prefill-booking-form-embed` — `config: {name,email,metadata, location:{value, optionValue}}` prefill pattern.
- WhatsApp official: `faq.whatsapp.com/5913398998672934` — `https://wa.me/<number>` and `?text=urlencodedtext`, international format, omit `+`/brackets.
- WhatsApp conventions: `help.businesschat.io/.../how-to-build-a-whatsapp-click-to-chat-url-wa-me`, vendor guides — `wa.me` vs `api.whatsapp.com/send` parity, encoding rules.

---

## 7. Open deferrals for Spec map A (not blocking research)

- Copy lock from `02-grilling-positioning-comprehension` — whether CTA reads "Book a call" vs "Get a revenue audit" determines Cal event name and form placeholder.
- GA/Plausible provider pick — spec may start with console-only adapter and set Netlify env `VITE_PLAUSIBLE_DOMAIN` or `VITE_GA_ID` later.
- Cal event config details (duration, buffers, availability, conferencing link) — spec to confirm before creating `victor/30min`.
- WhatsApp business number owner — if WA ever graduates, provision number + update footer/contact copy before committing `wa.me` href.

