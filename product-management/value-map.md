# Value Map — Value to Deliver

> Canonical value artifact for Victor Portfolio. Tracks what value is delivered, to whom, and how it is proven — separately from how engineering delivers it (`delivery-management/`).

## How to read this map

- A value outcome is delivered only when a stakeholder can feel it
- Status is value status, not engineering status
- Each row carries a stable Outcome ID (e.g. `V1`) that delivery milestone trackers reference as their proof-of-value target
- Each row names the owning delivery milestone(s) and the must-not-fail promise

## Value by stakeholder

| Outcome ID | Stakeholder | Value to deliver | Visible moment | Proof measure | Status | Owning delivery | Must-not-fail promise |
|---|---|---|---|---|---|---|---|
| V1 | Visitor (first-time) | Grasp in 15 seconds that Victor builds revenue systems, not just websites, via a coherent scroll story | Lands at `/` -> sees `BuildSequence` -> scrolls through pinned Hero -> About -> Projects -> Contact without break (desktop 600vh or mobile stacked) | Desktop pinned thresholds `0.14-0.84` fire; mobile stacked shows Hero+About+Projects+Contact with no overlap; `npm run build` passes; scroll consults single `Lenis` at `App.tsx:42` | DELIVERED | Milestone 1 | Single Lenis instance, single `BrowserRouter`, `AnimatePresence mode="wait"` remain; 768px breakpoint consistent across Home/Projects/About |
| V2 | Hiring manager / Recruiter | Verify shipped outcomes via live projects and quickly judge fit | Opens `Projects` at `Projects.tsx:14` -> sees 3 shipped cards (Convertly/Trend Tribe/Jegz) with tagline + description + stack + live link -> clicks `View Project` and lands on live site | Each `project.link` opens `target="_blank"` with 200; desktop carousel Prev/Next + dots operate, mobile stack shows 3 cards; screenshots from `public/images/` render `object-cover` without CLS | PARTIAL | Milestone 2 | `public/images/` paths stay root-relative (`/images/...`); carousel/stack split at `Projects.tsx:304` preserves 768px guard; motion viewport on mobile uses `margin:"0px"` so cards don't fire prematurely |
| V3 | Potential SMB client | See that the portfolio translates to business outcomes and know how to engage | Reads `About` narrative (`I don't just build websites...`) -> sees 6 skills + 3 stats -> reaches `Contact` CTA with clear channel | `About.tsx` story + `skills` + stat strip render in under 1.5s; `Contact` CTA visible in pinned Contact step (desktop) and stacked section (mobile); `Helmet` canonical consistent | PARTIAL | Milestone 2 | About copy stays outcome-focused (revenue/automation), not tech-only; Contact CTA never hidden behind pinned layers (`activeSection` guard at `Home.tsx:110`) |
| V4 | Peer / Collaborator | Assess technical breadth and motion quality via stack tags and interaction detail | Inspects `ProjectCard` glare/tilt and stack pills (Next.js, Prisma, Flutterwave, Cloudinary, etc.) -> checks responsiveness at 768px | ` ProjectCard` `rotateX`/`rotateY` + glare via `useMotionValue` smooth at 60fps; stack pills legible; `vite.config.ts:8` alias `@` resolves; repo runs `npm run build` (`tsc && vite build`) clean | PARTIAL | Milestone 2 | No emoji in code; Tailwind is sole styling system; Framer Motion for declarative transforms, GSAP for imperative only, Lenis for scroll — no duplicate scroll listeners |
| V5 | Visitor (returning, any device) | Experience a fast, accessible, deploy-stable site that sustains trust on repeat visits | Revisits any route (`/`, `/projects`, `/about`, `/contact`) -> refresh preserves SPA fallback -> keyboard and reduced-motion paths work | `npm run build` + `vite preview` green; `netlify.toml` SPA fallback holds on hard refresh at `/projects`; Lighthouse a11y >=90; `prefers-reduced-motion` disables tilt/parallax; `dist/` not committed | GAP | Milestone 3 | `dist/` + `.netlify/` never committed; lockfile committed, `npm ci` in CI; no second Lenis ever, `BrowserRouter` stays singleton |

## Cross-cutting value gaps

1. **Proof is partial not proven** — `public/images/` screenshots are provisional/cropped variably; no outbound click telemetry — closes with Milestone 2 screenshot replacement and link hardening in `Projects.tsx`.
2. **Contact is path, not yet conversion** — CTA exists but no form/email backend and no inquiry event; peer metric (tilt at 60fps) not baselined — closes with Milestone 2 CTA spec or Milestone 3 form decision.
3. **Polish is still a gap** — `prefers-reduced-motion`, lazy sizing, and Netlify header/cache not verified on preview deploy — closes with Milestone 3 `vite preview` + Lighthouse pass.

## Sequencing principle

- Every delivery milestone must make a named stakeholder feel a value outcome before the next big delivery begins
- Value decisions are argued here by stakeholder value and sequenced by dependency in delivery-management
- External integration (analytics, form backend) is delivered only after internal narrative and proof are trustworthy (M1 before M2 before any third-party wire-up)
- Desktop and mobile value ship together — a stakeholder on either viewport must feel the same outcome

## Deliberately not promised

- Backend, database, authentication, or CMS — portfolio is a static SPA (`public/images/` is the only store)
- Server-side rendering, native iOS/Android apps, or offline sync
- Payment processing, e-commerce checkout, or fulfillment — outbound links only
- Third-party analytics beyond `Helmet` canonical/OG until sequencing justifies it — keeps build lean
- Client delivery work itself — the portfolio only showcases and converts interest
