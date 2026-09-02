# Wayfinder

## Purpose

Wayfinding map for portfolio efforts too big for one agent session. Holds the `wayfinder:map` destination and `wayfinder:<type>` decision tickets that chart the way before building. Plan, don't do — tickets resolve decisions, not deliverables, unless Notes override.

## Ownership

Owned by root `AGENTS.md`. `product-management/` argues value; `delivery-management/` sequences build; this folder sequences *decisions* toward a destination.

## Local Contracts

- `MAP.md` is the `wayfinder:map` artifact (Destination, Notes, Decisions so far, Not yet specified, Out of scope).
- `tickets/` holds child issues of the map — one file per ticket, filename `NN-<slug>.md` mirrors tracker id.
- Every ticket has `wayfinder:<type>` (`research` AFK, `prototype`/`grilling` HITL, `task` either) per `SKILL.md:Ticket Types`.
- Claim a ticket by setting Assignee before work; unassigned = unclaimed; frontier = open + unblocked + unclaimed.
- Blocking is native dependency — rendered here as `Blocked by` / `Blocks` frontmatter; second-pass wiring required after ids assigned.
- Never resolve >1 ticket per session (except parallel `research` subagents). Resolution = comment + close + context pointer to map Decisions so far.
- Refer by name, never bare id: `[Ticket Title](link)` wraps id/URL inside name.

## Work Guidance

- Breadth-first at charting: fan out whole frontier before deep diving.
- Fog test: ticket when question sharp, even if blocked; else `Not yet specified` patch (coarser than ticket, may graduate into many).
- Out-of-scope never graduates; mis-scoped tickets closed and listed in Out of scope with why.
- Graduate fog as frontier advances; keep map index thin — detail lives in ticket.

## Verification

- `grep -R "wayfinder:" wayfinder/tickets` shows each ticket labelled.
- Frontier query: open tickets where every `Blocked by` is closed and Assignee empty.
- Every `Decisions so far` entry links to its closed ticket.

## Child DOX Index

| Path | Owner | Purpose |
|---|---|---|
| `MAP.md` | wayfinder/ | `wayfinder:map` — destination, notes, index, fog, out-of-scope |
| `tickets/` | wayfinder/ | Child decision tickets (`wayfinder:<type>`) |
