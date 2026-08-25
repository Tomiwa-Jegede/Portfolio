import {
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";
import HeroOverlay from "@/components/hero/HeroOverlay";
import { useLenisScrollContext } from "@/context/LenisScrollContext";
import About from "@/pages/About/About";
import Projects from "@/pages/Projects/Projects";
import Contact from "@/pages/Contact/Contact";
import BuildSequence from "@/components/ide/BuildSequence";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");

    setIsMobile(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

function DesktopHome() {
  const { scrollYProgress, lenis } = useLenisScrollContext();

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

  // Lenis now lives in App.tsx (single app-wide instance). This effect waits
  // for it to become available via context before restoring scroll position,
  // since on first mount the Provider's effect may not have run yet.
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

    lenis.scrollTo(target, { immediate: true });
  }, [lenis]);

  useMotionValueEvent(scrollYProgress ?? { on: () => () => {} } as any, "change", (v: number) => {
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
  const aboutScale = useTransform(sy!, [0.29, 0.33, 0.36], [0.9, 1, 1.08]);
  const portal2Opacity = useTransform(sy!, [0.38, 0.42, 0.54], [0, 1, 0]);
  const projectsOpacity = useTransform(sy!, [0.53, 0.57, 0.62, 0.65], [0, 1, 1, 0]);
  const projectsScale = useTransform(sy!, [0.53, 0.57, 0.62], [0.9, 1, 1.06]);
  const portal3Opacity = useTransform(sy!, [0.64, 0.68, 0.8], [0, 1, 0]);
  const contactOpacity = useTransform(sy!, [0.79, 0.84, 1], [0, 1, 1]);
  const contactScale = useTransform(sy!, [0.79, 0.86, 1], [0.9, 1, 1]);

  return (
    <main className="relative bg-[#050508]" style={{ height: "600vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroOverlay />
        {/* ABOUT */}
        <motion.div
          style={{ opacity: aboutOpacity, scale: aboutScale }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <div
            className={
              activeSection === "about" ? "pointer-events-auto" : "pointer-events-none"
            }
          >
            <About />
          </div>
        </motion.div>

        {/* PROJECTS */}
        <motion.div
          style={{ opacity: projectsOpacity, scale: projectsScale }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <div
            className={
              activeSection === "projects" ? "pointer-events-auto" : "pointer-events-none"
            }
          >
            <Projects />
          </div>
        </motion.div>

        {/* CONTACT */}
        <motion.div
          style={{ opacity: contactOpacity, scale: contactScale }}
          className="absolute inset-0 z-30 pointer-events-none"
        >
          <div
            className={
              activeSection === "contact" ? "pointer-events-auto" : "pointer-events-none"
            }
          >
            <Contact />
          </div>
        </motion.div>

        {/* PORTAL 1 */}
        <motion.div
          style={{ opacity: portalOpacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
        />

        {/* PORTAL 2 */}
        <motion.div
          style={{ opacity: portal2Opacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
        />

        {/* PORTAL 3 */}
        <motion.div
          style={{ opacity: portal3Opacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
        />
      </div>

      <div data-active-section={activeSection} />
    </main>
  );
}

function MobileHome() {
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
      <section className="relative h-screen overflow-hidden">
        <HeroOverlay />
      </section>

      <About />
      <Projects />
      <Contact />
    </main>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const [buildComplete, setBuildComplete] = useState(false);

  if (isMobile === null) return null;

  if (!buildComplete) {
    return (
      <BuildSequence
        onEnter={() => {
          setBuildComplete(true);
        }}
      />
    );
  }

  return isMobile ? <MobileHome /> : <DesktopHome />;
}