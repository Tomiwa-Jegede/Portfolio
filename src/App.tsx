import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, useMotionValue } from "framer-motion";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Nav from "./components/layout/Nav";
import PageLoader from "./components/layout/PageLoader";
import ScrollProgressBar from "./components/layout/ScrollProgressBar";
import { LenisScrollContext } from "./context/LenisScrollContext";

const Home = lazy(() => import("./pages/Home/Home"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectCase = lazy(() => import("./pages/Projects/ProjectCase"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollProgressBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects standalone />} />
          <Route path="/projects/:slug" element={<ProjectCase />} />
          <Route path="/about" element={<About standalone />} />
          <Route path="/contact" element={<Contact standalone />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const scrollYProgress = useMotionValue(0);
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const isStackedDefault = new URLSearchParams(window.location.search).get("story") !== "pinned";
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const shouldSmooth = !isStackedDefault ? true : !(prefersReduced || isCoarse);
    // Stacked = real-time native feel; pinned = smooth. Duration 0.6 feels instant vs 1.0 lag.
    const lenis = new Lenis({
      duration: shouldSmooth ? 0.7 : 0.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: shouldSmooth,
      syncTouch: false,
      gestureOrientation: "vertical",
    });
    // stacked uses immediate scroll via Nav (immediate:true) so no lerp hack needed

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      scrollYProgress.set(progress);
    });

    let rafId: number;

    function raf(time: number) {
      if (!document.hidden) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, [scrollYProgress]);

  return (
    <MotionConfig reducedMotion="user">
      <LenisScrollContext.Provider
        value={{ scrollYProgress, lenis: lenisInstance }}
      >
        <BrowserRouter>
          <Nav />
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      </LenisScrollContext.Provider>
    </MotionConfig>
  );
}