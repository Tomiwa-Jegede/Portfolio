// Cheap prototype diff — copy relevant hunks into repo to toggle ?story=pinned|stacked
// Ticket: 01-prototype-pinned-vs-stacked — HITL, react to this, not ship it as-is.

import { MotionConfig, useReducedMotion } from "framer-motion";

// App.tsx:74 wrapper — keep AnimatePresence mode="wait" + Suspense per milestone-1 guardrail
export function AppShell({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Home.tsx:15 — unify useIsMobile (fixes About:14 + Projects:11 mismatch)
export function useIsMobile(bp = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

// Home.tsx: useReducedMotion guard for scale/portals
export function DesktopHomeGated({ scrollYProgress, lenis }: any) {
  const shouldReduce = useReducedMotion();
  const sy = scrollYProgress;
  // Gate scale: when reduced, keep 1; portals fade opacity only, no scale jolt
  const aboutOpacity = useTransform(sy!, [0.29, 0.33, 0.36, 0.39], [0, 1, 1, 0]);
  const aboutScale = shouldReduce ? 1 : useTransform(sy!, [0.29, 0.33, 0.36], [0.9, 1, 1.08]);
  // ... replicate for projects/contact but gated
  return { shouldReduce, aboutOpacity, aboutScale };
}

// Home.tsx:105-144 — inert + aria-hidden on inactive layers (fixes ghost tab stops)
export function SectionLayer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      // inert is React 19 / Chrome 102+; fallback aria-hidden + tab containment
      // @ts-ignore
      inert={active ? undefined : ""}
      aria-hidden={!active}
      className={active ? "pointer-events-auto" : "pointer-events-none"}
    >
      {children}
    </div>
  );
}

// Home.tsx routing switch — ?story param + prefers-reduced-motion fallback lifts MobileHome to desktop
export function HomePrototype() {
  const shouldReduce = useReducedMotion();
  const isMobile = useIsMobile();
  const story = new URLSearchParams(window.location.search).get("story"); // pinned | stacked
  const forceStacked = shouldReduce || window.matchMedia("(pointer: coarse)").matches || story === "stacked";
  const useStacked = forceStacked || (story !== "pinned" && isMobile);
  if (isMobile === null) return null;
  if (forceStacked || useStacked) {
    // Stacked: flex columns, sticky Nav always interactive, no 600vh, no portals
    return <MobileHome />;
  }
  return <DesktopHome />;
}

// HeroOverlay.tsx — A1 headline from ticket 02 decision
export const heroCopy = {
  headline: "Revenue systems that don't leak leads.",
  sub: "3 shipped — Convertly, Trend Tribe, Jegz Menswear → see case + live",
  eyebrow: "Full Stack Developer", // pill, not headline
};

// Nav.tsx — lenis.scrollTo with immediate when reduced (not window.scrollTo)
export function scrollToSection(ratio: number, mobileSelector: string, lenis: any) {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    document.querySelector(mobileSelector)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  const t = (document.documentElement.scrollHeight - window.innerHeight) * ratio;
  if (lenis) lenis.scrollTo(t, { immediate: lenis.prefersReducedMotion, duration: 1.2 });
  else window.scrollTo({ top: t, behavior: "smooth" });
}

// Cursor.tsx gate — only hide cursor when fine pointer and not reduced
export function shouldHideCursor() {
  return !useReducedMotion() && window.matchMedia("(pointer: fine)").matches;
}
