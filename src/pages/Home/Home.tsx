import {
  useTransform,
  useMotionValueEvent,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroOverlay from "@/components/hero/HeroOverlay";
import { useLenisScrollContext } from "@/context/LenisScrollContext";
import About from "@/pages/About/About";
import Projects from "@/pages/Projects/Projects";
import Contact from "@/pages/Contact/Contact";
import BuildSequence from "@/components/ide/BuildSequence";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/useIsMobile";
import { canonicalFor } from "@/lib/canonical";

function DesktopHome() {
  const { scrollYProgress, lenis } = useLenisScrollContext();
  const shouldReduce = useReducedMotion();
  const didRestore = useRef(false);

  const [activeSection, setActiveSection] = useState<
    "hero" | "about" | "projects" | "contact"
  >(
    () =>
      (sessionStorage.getItem("lastSection") as
        | "hero"
        | "about"
        | "projects"
        | "contact") ?? "hero",
  );

  useEffect(() => {
    if (!lenis || didRestore.current) return;

    didRestore.current = true;

    const saved = sessionStorage.getItem("lastSection");

    if (!saved || saved === "hero") return;

    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const targets: Record<string, number> = {
      about: totalHeight * 0.33,
      projects: totalHeight * 0.57,
      contact: totalHeight * 0.84,
    };

    const target = targets[saved] || 0;

    const immediate = (lenis as unknown as { prefersReducedMotion?: boolean })?.prefersReducedMotion ?? !!shouldReduce;
    lenis.scrollTo(target, { immediate });
  }, [lenis, shouldReduce]);

  useMotionValueEvent(scrollYProgress ?? { on: () => () => {} } as unknown as never, "change", (v: number) => {
    let section: "hero" | "about" | "projects" | "contact";

    if (v < 0.18) section = "hero";
    else if (v < 0.54) section = "about";
    else if (v < 0.8) section = "projects";
    else section = "contact";

    setActiveSection(section);

    sessionStorage.setItem("lastSection", section);
  });

  const sy = scrollYProgress ?? undefined;

  const portalOpacity = useTransform(sy!, [0.14, 0.18, 0.3], [0, 1, 0]);
  const aboutOpacity = useTransform(sy!, [0.29, 0.33, 0.36, 0.39], [0, 1, 1, 0]);
  const aboutScale = shouldReduce ? (1 as unknown as typeof aboutOpacity) : useTransform(sy!, [0.29, 0.33, 0.36], [0.9, 1, 1.08]);
  const portal2Opacity = useTransform(sy!, [0.38, 0.42, 0.54], [0, 1, 0]);
  const projectsOpacity = useTransform(sy!, [0.53, 0.57, 0.62, 0.65], [0, 1, 1, 0]);
  const projectsScale = shouldReduce ? (1 as unknown as typeof projectsOpacity) : useTransform(sy!, [0.53, 0.57, 0.62], [0.9, 1, 1.06]);
  const portal3Opacity = useTransform(sy!, [0.64, 0.68, 0.8], [0, 1, 0]);
  const contactOpacity = useTransform(sy!, [0.79, 0.84, 1], [0, 1, 1]);
  const contactScale = shouldReduce ? (1 as unknown as typeof contactOpacity) : useTransform(sy!, [0.79, 0.86, 1], [0.9, 1, 1]);

  return (
    <main className="relative bg-[#050508]" style={{ height: shouldReduce ? "auto" : "600vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroOverlay />
        {/* ABOUT */}
        <motion.div
          style={{ opacity: aboutOpacity, scale: aboutScale as unknown as number }}
          className="absolute inset-0 z-30 pointer-events-none"
          aria-hidden={activeSection !== "about"}
          // @ts-ignore inert
          inert={activeSection !== "about" ? "" : undefined}
        >
          <div
            className={
              activeSection === "about" ? "pointer-events-auto" : "pointer-events-none"
            }
            aria-hidden={activeSection !== "about"}
          >
            <About />
          </div>
        </motion.div>

        {/* PROJECTS */}
        <motion.div
          style={{ opacity: projectsOpacity, scale: projectsScale as unknown as number }}
          className="absolute inset-0 z-30 pointer-events-none"
          aria-hidden={activeSection !== "projects"}
          // @ts-ignore inert
          inert={activeSection !== "projects" ? "" : undefined}
        >
          <div
            className={
              activeSection === "projects" ? "pointer-events-auto" : "pointer-events-none"
            }
            aria-hidden={activeSection !== "projects"}
          >
            <Projects />
          </div>
        </motion.div>

        {/* CONTACT */}
        <motion.div
          style={{ opacity: contactOpacity, scale: contactScale as unknown as number }}
          className="absolute inset-0 z-30 pointer-events-none"
          aria-hidden={activeSection !== "contact"}
          // @ts-ignore inert
          inert={activeSection !== "contact" ? "" : undefined}
        >
          <div
            className={
              activeSection === "contact" ? "pointer-events-auto" : "pointer-events-none"
            }
            aria-hidden={activeSection !== "contact"}
          >
            <Contact />
          </div>
        </motion.div>

        {/* PORTAL 1 */}
        <motion.div
          style={{ opacity: shouldReduce ? 0 : portalOpacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
          aria-hidden
        />

        {/* PORTAL 2 */}
        <motion.div
          style={{ opacity: shouldReduce ? 0 : portal2Opacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
          aria-hidden
        />

        {/* PORTAL 3 */}
        <motion.div
          style={{ opacity: shouldReduce ? 0 : portal3Opacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
          aria-hidden
        />
      </div>

      <div data-active-section={activeSection} aria-live="polite" className="sr-only">{activeSection}</div>
    </main>
  );
}

function StackedHome() {
  useEffect(() => {
    const saved = sessionStorage.getItem("mobileScrollY");
    if (saved) {
      window.scrollTo({
        top: Number(saved),
        behavior: "instant" as ScrollBehavior,
      });
    }
    const handleScroll = () => {
      sessionStorage.setItem("mobileScrollY", String(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-[#050508]">
      <section className="relative h-screen overflow-hidden" data-section="hero">
        <HeroOverlay />
      </section>
      <div data-section="about"><About /></div>
      <div data-section="projects"><Projects /></div>
      <div data-section="contact"><Contact /></div>
    </main>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const shouldReduce = useReducedMotion();
  const [buildComplete, setBuildComplete] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (buildComplete) return;
    const t = setTimeout(() => setShowSkip(true), 1000);
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuildComplete(true);
    };
    window.addEventListener("keydown", esc);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", esc);
    };
  }, [buildComplete]);

  if (isMobile === null) return null;

  const storyParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
  const isCoarse = typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false;
  const forceStacked = !!shouldReduce || isCoarse;
  const usePinned = storyParam === "pinned" && !forceStacked && !isMobile;

  if (!buildComplete) {
    return (
      <>
        <Helmet>
          <title>Victor — Revenue Systems Developer</title>
          <meta
            name="description"
            content="Victor — Full Stack Developer. I build revenue systems, not just websites."
          />
          <link rel="canonical" href={canonicalFor("/")} />
        </Helmet>
        <div aria-hidden className="sr-only">Loading Victor portfolio</div>
        <BuildSequence
          onEnter={() => {
            setBuildComplete(true);
          }}
        />
        {showSkip && (
          <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <button
              onClick={() => setBuildComplete(true)}
              className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-xs tracking-widest text-ghost/80 backdrop-blur hover:border-violet-500/50 hover:text-ghost"
              aria-label="Skip intro"
            >
              Skip — View Projects →
            </button>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Victor — Revenue Systems Developer</title>
        <meta
          name="description"
          content="Victor — Full Stack Developer. I build revenue systems, not just websites."
        />
        <link rel="canonical" href={canonicalFor("/")} />
      </Helmet>
      {usePinned ? <DesktopHome /> : <StackedHome />}
    </>
  );
}
