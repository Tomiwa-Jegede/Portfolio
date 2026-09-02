# Ticket: Research — Telemetry provider + event schema

> Label: `wayfinder:research` | Type: AFK | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Decision:** **Plausible primary via `script.tagged-events.js` (~2kB) + GA4 `gtag.js` fallback via adapter, console fallback in dev** — `src/lib/analytics.ts` typed `AnalyticsEvent` union.

**Gist:** Plausible privacy/no-banner/2kB vs GA4 ~70kB+Consent banner; per-route canonical `src/lib/canonical.ts` `canonicalFor(path)` must fix `Helmet` drift before prod; schema discriminated union `VIEW_PROJECT_CLICK` `PROJECT_CASE_VIEW` `CAL_CTA_VIEW/POPUP_OPEN/BOOKED` `CONTACT_FORM_START/SUBMIT/SUCCESS/ERROR` `WA_CLICK` + materialized `CONTACT_FUNNEL_STEP` + `bufferEvent` localStorage bounded; `resolveProvider()` via `VITE_PLAUSIBLE_DOMAIN`/`VITE_GA_ID`/`VITE_ANALYTICS_PROVIDER`, zero `npm i`, `@` alias compatible; fires at `Projects.tsx:193` click + `Contact.tsx:43` submit/success/error + Cal popup.

**Asset:** `wayfinder/spec-a/research/telemetry-findings.md` (427 lines, adapter stub ~1.6kB, `npx tsc --noEmit` green).

**Method:** AFK research subagent, Plausible/GA4 docs, bundle/canonical/CSP matrix.

## Question

Which client-only telemetry provider (`Plausible` vs `GA4` vs console fallback) and typed event schema (`VIEW_PROJECT_CLICK`, `PROJECT_CASE_VIEW`, `CAL_CTA_VIEW`, `CAL_POPUP_OPEN`, `CAL_BOOKED`, `CONTACT_FORM_START/SUBMIT/SUCCESS/ERROR`, `WA_CLICK`) best measures `view->click->submit` funnel without a backend, and what `lib/analytics.ts` adapter shape keeps `npm run build` lean?

## Context

- `package.json:11-19` has no analytics dep; `product-management/value-chain-opportunities/MAP.md:4` ranks analytics #4 but feed says lift requires it to sequence V2 vs V3.
- Needs docs read + adapter stub, not human grilling; provider choice gates prototype wiring.

## Method

- AFK research subagent: invoke Skill `research`; read Plausible vs GA4 client docs, custom event patterns, `Helmet` + `netlify.toml` CSP implications, local `vite.config.ts:8` alias, draft `lib/analytics.ts` typed adapter + funnel `CONTACT_FUNNEL_STEP` enum.

## Blocking

- Blocked by: none (frontier, parallelizable)
- Blocks: `05-prototype-case-funnel` (prototype needs schema to wire)

## Resolution criteria

- AFK: provider comparison (privacy, bundle, per-route canonical, funnel query) + typed schema + `lib/analytics.ts` stub snippet; asset at `wayfinder/spec-a/research/telemetry-findings.md`.

## References

- `package.json`, `Projects.tsx:14` click, `Contact.tsx:43` submit, `value-chain-opportunities/MAP.md:4`, `wayfinder/research/contact-funnel-findings.md` § telemetry
