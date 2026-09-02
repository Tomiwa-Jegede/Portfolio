import { motion, useScroll, useTransform } from "framer-motion";
import Button from "../ui/Button";
import { useLenisScrollContext } from "@/context/LenisScrollContext";
import type Lenis from "@studio-freight/lenis";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

// Scroll to a section by its progress ratio (matches DesktopHome thresholds).
// On mobile the sections are stacked normally, so we fall back to querySelector.
function scrollToSection(
  ratio: number,
  mobileSelector: string,
  lenis: Lenis | null,
) {
  const story = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
  const isStacked = story !== "pinned";
  const prefersReduced = (lenis as unknown as { prefersReducedMotion?: boolean })?.prefersReducedMotion ?? false;
  const immediate = isStacked || prefersReduced;

  // Stacked (default) uses anchor — exact top, nav offset handled by StackedHome sections
  const el = document.querySelector(mobileSelector);
  if (el && (isStacked || window.innerWidth <= 768)) {
    el.scrollIntoView({ behavior: immediate ? "instant" as ScrollBehavior : "smooth", block: "start" });
    if (immediate) {
      const navOffset = 72;
      const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    }
    return;
  }

  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const target = ratio * totalHeight;
  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: immediate ? 0 : 0.6 });
  } else {
    window.scrollTo({ top: target, behavior: immediate ? "instant" as ScrollBehavior : "smooth" });
  }
}

export default function HeroOverlay() {
  const { scrollYProgress: nativeScrollYProgress } = useScroll();
  const { scrollYProgress: lenisScrollYProgress, lenis } =
    useLenisScrollContext();
  const scrollYProgress = lenisScrollYProgress ?? nativeScrollYProgress;
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.12], [1, 1.15]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6"
    >
      {/* Radial vignette so text lifts off the globe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,5,8,0.75) 0%, rgba(5,5,8,0.2) 60%, transparent 100%)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative text-center max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="font-mono text-xs tracking-[0.3em] text-cyan-glow/90 uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
            Full Stack Developer · Revenue Systems
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-display font-bold text-[clamp(4rem,12vw,10rem)] leading-none tracking-tighter mb-4 drop-shadow-[0_0_40px_rgba(124,58,237,0.4)]"
        >
          <span className="gradient-text">VICTOR</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-display text-[clamp(1rem,3vw,1.5rem)] font-light text-ghost/80 mb-3 tracking-wide"
        >
          Revenue systems that{" "}
          <span className="text-ghost font-medium">don't leak leads.</span>
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="font-body text-sm text-ghost/60 mb-12 max-w-md mx-auto leading-relaxed"
        >
          3 shipped — Convertly, Trend Tribe, Jegz Menswear → see case + live.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
        >
          {/* 0.57 = projects threshold in DesktopHome */}
          <Button
            onClick={() =>
              scrollToSection(0.57, '[data-section="projects"]', lenis)
            }
            variant="primary"
          >
            View Projects
          </Button>

          {/* 0.84 = contact threshold in DesktopHome */}
          <Button
            onClick={() =>
              scrollToSection(0.84, '[data-section="contact"]', lenis)
            }
            variant="secondary"
          >
            Contact Me
          </Button>

          <Button href="/images/victor-resume.pdf" variant="ghost" download>
            Download Resume ↓
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-20 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="font-mono text-xs tracking-widest text-ghost/80">
            SCROLL
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-ghost/60 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
