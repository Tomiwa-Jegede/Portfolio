# Ticket: Grilling — Funnel copy + spam guard choice

> Label: `wayfinder:grilling` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** Locked copy **button `Get a 24h reply` + microcopy "I reply within 24h — Cal is faster." + Cal pill `Book 20 min →` (`data-cal-link="victor/30min"` popup)** and guard **honeypot `_gotcha` + Turnstile (not reCAPTCHA) + domain restrict `vctdev.netlify.app` + 429 → "Busy — try Cal or email directly."**

**Gist:** Turnstile ~15kB vs reCAPTCHA ~100kB + no banner; honeypot catches bots pre-Turnstile; Cal secondary keeps form primary for `CONTACT_FORM_SUCCESS` vs `CAL_BOOKED` funnel; button makes 24h promise explicit vs generic "Send Message"; Cal inline rejected (breaks stacked), floating rejected (collides Cursor).

**Human sign-off:** lock as proposed — 2026-09-02.

**Unblocks:** `05-prototype-case-funnel` (needs copy+guard for acceptance criteria).

## Question

What funnel copy (form promise + Cal CTA) and spam guard (honeypot `_gotcha` + Turnstile vs reCAPTCHA + domain restrict + 429 handling) should `Contact.tsx:43` ship to harden Formspree without a backend and keep `product-management/value-map.md:18` V3 "within 24h" promise credible — while adopting `wayfinder/research/contact-funnel-findings.md` recommendation B (Form + Cal pop-up)?

## Context

- `Contact.tsx:6-71` has `localStorage("contactDraft")` + JSON post to `xjyvbvkv` but no honeypot, captcha, field errors, or 429 branch; `Contact.tsx:92` promise "within 24 hours" unverified.
- Needs copy JTBD (hiring manager vs SMB leak) and guard decision before spec can write acceptance criteria.
- Adopted: A1 headline, stacked default, Form+Cal popup via element click per `04-research-contact-funnel`.

## Method

- HITL grilling: `grilling`; walk copy pair (form button "Send Message" vs "Get 24h reply" + Cal "Book 20 min"), decide Turnstile sitekey vs reCAPTCHA, honeypot field name, domain allow-list, 429 UX, and Cal `victor/30min` event config with human.

## Blocking

- Blocked by: none (frontier, parallel to case content)
- Blocks: `05-prototype-case-funnel` (prototype needs copy + guard shape for acceptance criteria)

## Resolution criteria

- HITL: locked copy pair + guard choice (Turnstile vs reCAPTCHA, honeypot name, domain restrict) + 429 branch UX + Cal event name; spec delta for `Contact.tsx` lives in ticket.

## References

- `Contact.tsx:6-71`, `netlify.toml`, `wayfinder/research/contact-funnel-findings.md`, `product-management/value-map.md:18` V3
