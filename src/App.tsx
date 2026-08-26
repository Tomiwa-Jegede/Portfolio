import Cursor from "@/components/ui/Cursor";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, useMotionValue } from "framer-motion";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Nav from "./components/layout/Nav";
import PageLoader from "./components/layout/PageLoader";
import ScrollProgressBar from "./components/layout/ScrollProgressBar";
import { LenisScrollContext } from "./context/LenisScrollContext";

const Home = lazy(() => import("./pages/Home/Home"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollProgressBar />
      <Cursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects standalone />} />
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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      scrollYProgress.set(progress);
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
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
  );
}