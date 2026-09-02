# Ticket: Task — Gather outcome metrics for 3 cases

> Label: `wayfinder:task` | Type: HITL | Status: closed | Assignee: wayfinder-agent | Claimed: 2026-09-02 | Closed: 2026-09-02

## Resolution

**Returned checklist (recommendation locked, honest estimate tags):**

| Case | Metric + source | File/URL | Tag |
|---|---|---|---|
| Convertly `Projects.tsx:15` | `Demo: 100+ msgs auto-answered + booking→follow-up` | loom/demo + `public/images/convertly.png:901k` | `estimate/demo` — not `∞` |
| Trend Tribe `Projects.tsx:34` | `Pilot: 2s filter @100 listings (current 16 listings <14d)` | `value-map.md:26` + Prisma count | `pilot/estimate` |
| Jegz Menswear `Projects.tsx:53` | `Live store ✓ — Flutterwave checkout at jegzmenswear.store` | `public/images/jegzmenswear.PNG` + live URL | `live` |

**Gist:** No hard prod numbers yet, so ship honest estimate/demo + pilot tags vs `∞/100%` `About.tsx:147`. Sources: demo loom + pilot count + live store URL; screenshots to `public/images/*` WebP deferred to Polish map (fog remains). Unblocks prototype `05`; metrics to be replaced when prod analytics via `04` telemetry lands.

**Human sign-off:** choose recommendation — 2026-09-02.

**Unblocks:** `05-prototype-case-funnel` now sole frontier.

## Question

What honest outcome metric per case can we source before spec locks — Convertly, Trend Tribe, Jegz Menswear — to replace `∞`/`100%` `About.tsx:147` and fill `/projects/:slug` md metric slots defined in `01-grilling-case-content`?

## Context

- No backend to query; metrics must come from human (analytics screenshots, Flutterwave/Cloudinary logs, or honest estimate ranges with source note).
- Blocked until case shape decides which metric slot matters (e.g. "leads/week" vs "orders" vs "listings").
- HITL task: hand human a checklist, not decide.

## Method

- HITL task: give precise checklist — for each project: preferred metric, fallback range, source file/URL, screenshot location, honest fallback if no hard number (e.g. "100+ msgs automated in demo" with `estimate` tag). Resolves when checklist returned with sources.

## Blocking

- Blocked by: `01-grilling-case-content` (shape decides metric type)
- Blocks: `05-prototype-case-funnel` (prototype needs at least one real metric to render)

## Resolution criteria

- HITL: returned checklist with 3 metrics + sources + screenshot links; prototype `05` can then render Convertly metric without re-asking.

## References

- `Projects.tsx:14` 3 projects, `About.tsx:147` stat strip, `public/images/*` assets
