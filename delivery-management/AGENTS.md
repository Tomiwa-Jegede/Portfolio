# Delivery Management

## Purpose

Planning, roadmap, and milestone tracking for Victor Portfolio delivery. The engineering half of product planning: how portfolio value is built, sequenced by dependency, and shipped. The value thesis lives in `product-management/`.

## Ownership

Owned by the repository root `AGENTS.md`. Value-to-deliver lives in `product-management/`; this folder owns how engineering delivers value, not what the value is.

## Local Contracts

- Use this folder for durable delivery artifacts, not scratch notes.
- `roadmap.md` is the top-level sequencing document.
- Milestone trackers use numbered filenames `milestone-1.md` onward.
- Milestone docs state scope, non-goals, ownership boundaries, execution order, and regression guardrails.
- When a milestone is split/deferred/reprioritized, reflect changes in both `roadmap.md` and the affected milestone files in the same change.
- Milestone docs name the value outcome they deliver by referencing `product-management/value-map.md`.
- Delivery status is not a claim of visible value.

## Work Guidance

- Keep planning docs concrete enough to drive execution — name owning files at `src/...:line` where applicable.
- Prefer milestone-oriented breakdowns over brainstorming lists.
- Update roadmap and milestone docs when scope, sequencing, or ownership changes.
- Do not duplicate implementation detail owned by code-local AGENTS docs.
- Do not resolve "what value to build next" here — raise it to `product-management/`.

## Verification

- Check links, filenames, and milestone numbering.
- Ensure the root `AGENTS.md` child index references this folder and stays current.
- Verify every `Tracker: see [milestone-N.md]` link resolves and `grep` for unresolved placeholders returns zero.

## Child DOX Index

| Path | Owner | Purpose |
| --- | --- | --- |
| `roadmap.md` | delivery-management/ | Top-level sequencing of portfolio milestones by dependency |
| `milestone-1.md` | delivery-management/ | Narrative shell + routing + motion foundation |
| `milestone-2.md` | delivery-management/ | Proof and conversion — Projects, live links, About credibility |
| `milestone-3.md` | delivery-management/ | Polish, performance, accessibility, and deploy hardening |

<!-- Add one row per milestone tracker file as milestones are created. -->
