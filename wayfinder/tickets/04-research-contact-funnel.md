# Ticket: Research — Contact funnel options before speccing

> Label: `wayfinder:research` | Type: AFK | Status: closed | Assignee: wayfinder-agent | Closed: 2026-09-02

## Resolution

**Findings:** Formspree JSON post `Contact.tsx:43` is hashid-public (not secret), drift vs `value-map.md:25` GAP note to patch. Compared form-only vs form+Cal popup vs form+Cal+WA (S/M/M+ effort): recommends **B — Form (hardened) + Cal.com pop-up via element click** for follow-on Spec A. Cal `cal.com/embed` options evaluated, `wa.me/<E164>?text=` deferred. Spam: honeypot `_gotcha` + Turnstile over reCAPTCHA + domain restrict + 429 branch; telemetry typed schema `CONTACT_FORM_*`, `CAL_CTA_VIEW/POPUP_OPEN/BOOKED`, `WA_CLICK`, `CONTACT_FUNNEL_STEP` via `lib/analytics.ts` adapter.

**Asset:** `wayfinder/research/contact-funnel-findings.md` (branch `research/contact-funnel`, 194 lines) — comparison table §2 + recommendation §5 ready for Spec A without re-research. Decisions to lock pre-spec: Turnstile sitekey vs reCAPTCHA, provider `plausible` vs `GA4` vs console fallback, Cal `victor/30min` event.

**Method:** AFK research subagent invoked Skill `research`; read Formspree/Cal/WA docs + `Contact.tsx:6-71` + `netlify.toml`.

## Question

Given `Contact.tsx:43` already posts to `formspree.io/f/xjyvbvkv` with `localStorage` draft `Contact.tsx:19`, what contact funnel shape (form-only vs form + Cal.com book vs WA) best closes `value-map.md:25` gap without adding a backend, and what spam/guard + telemetry choices must be decided before speccing?

## Context

- Value-map claims GAP but code ships form — drift to correct; `value-chain-opportunities/MAP.md:1` ranks form+book as #1 for pipeline lift.
- Needs third-party docs read (Formspree, Cal.com, WA `wa.me`), local `Contact.tsx` + `netlify.toml` form handling options, no secrets committed.

## Method

- AFK research subagent: invoke Skill `research`; read Formspree docs, Cal embed options, WA link conventions, Netlify Forms alternative, local `Contact.tsx:43-71`. Capture on branch `research/contact-funnel`.

## Blocking

- Blocked by: `02-grilling-positioning-comprehension` (funnel copy/outcome promise depends on positioning)
- Blocks: none directly (feeds follow-on Spec map A, not this decision map)

## Resolution criteria

- AFK: comparison table (effort, conversion lift, spam guard, telemetry event shape) linked; recommendation that follow-on Spec map can adopt without re-research.

## References

- `Contact.tsx:6-71`, `netlify.toml`, `product-management/value-map.md:18-25`, `value-chain-opportunities/MAP.md:1`
