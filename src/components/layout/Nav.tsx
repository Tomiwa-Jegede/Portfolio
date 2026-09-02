import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useLenisScrollContext } from "@/context/LenisScrollContext";
import { useTheme } from "@/context/ThemeContext";

const links = [
  { to: "/", label: "Home", section: "hero", scrollTarget: 0 },
  { to: "/about", label: "About", section: "about", scrollTarget: 0.33 },
  {
    to: "/projects",
    label: "Projects",
    section: "projects",
    scrollTarget: 0.57,
  },
  { to: "/contact", label: "Contact", section: "contact", scrollTarget: 0.84 },
];

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollYProgress, lenis } = useLenisScrollContext();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Read activeSection from the shared Lenis scroll progress (same source as
  // ScrollProgressBar and DesktopHome), so nav highlighting stays in sync.
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("hero");
    }
  }, [location.pathname]);

  // Stacked (default) uses scroll + anchor offsets — exact sync (600vh thresholds don't apply)
  // Pinned (?story=pinned) uses Lenis scrollYProgress thresholds (600vh)
  useEffect(() => {
    if (location.pathname !== "/") return;
    const story = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
    const isStacked = story !== "pinned";
    if (!isStacked) return;
    const handler = () => {
      const sections = links
        .map((l) => document.querySelector(`[data-section="${l.section}"]`) as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];
      if (!sections.length) return;
      const navOffset = 96;
      const scrollPos = window.scrollY + navOffset + 40;
      // find last section whose top is above scrollPos
      let current = sections[0].dataset.section ?? "hero";
      for (const el of sections) {
        if (el.offsetTop <= scrollPos) current = el.dataset.section ?? current;
      }
      setActiveSection(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    // also re-check after Home lazy mounts (StackedHome renders async)
    const t = setTimeout(handler, 400);
    return () => {
      window.removeEventListener("scroll", handler);
      clearTimeout(t);
    };
  }, [location.pathname]);

  useMotionValueEvent(
    scrollYProgress ?? ({ on: () => () => {} } as any),
    "change",
    (v: number) => {
      if (location.pathname !== "/") return;
      const story = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
      const isStacked = story !== "pinned";
      if (isStacked) return; // stacked uses IntersectionObserver above
      if (v < 0.18) setActiveSection("hero");
      else if (v < 0.54) setActiveSection("about");
      else if (v < 0.8) setActiveSection("projects");
      else setActiveSection("contact");
    },
  );

  const isActive = (link: (typeof links)[0]) => {
    if (location.pathname !== "/") {
      return location.pathname === link.to;
    }
    return activeSection === link.section;
  };

  const handleNavClick = (e: React.MouseEvent, link: (typeof links)[0]) => {
    const story = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("story") : null;
    const isStacked = story !== "pinned";
    const prefersReduced = (lenis as unknown as { prefersReducedMotion?: boolean })?.prefersReducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const immediate = isStacked || prefersReduced;

    const scrollToTarget = () => {
      const selector = `[data-section="${link.section}"]`;
      const el = document.querySelector(selector);
      if (isStacked && el) {
        el.scrollIntoView({ behavior: immediate ? "instant" as ScrollBehavior : "smooth", block: "start" });
        // offset for fixed nav (56px)
        if (!immediate) return;
        const navOffset = 72;
        const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
        return;
      }
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const target = link.scrollTarget * totalHeight;
      if (lenis) lenis.scrollTo(target, { immediate, duration: immediate ? 0 : 0.6 });
      else window.scrollTo({ top: target, behavior: immediate ? "instant" as ScrollBehavior : "smooth" });
    };

    // If we're not on the home page, navigate there first then scroll
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      setTimeout(scrollToTarget, 120);
      return;
    }

    e.preventDefault();
    scrollToTarget();
    setMenuOpen(false);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('[data-section="projects"]');
    if (target) {
      target.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
      return;
    }
    handleNavClick(e as unknown as React.MouseEvent, links[2]);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
          scrolled ? "glass-strong" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, links[0])}
            className="flex items-center"
          >
            <img
              src="/images/vctdev_logo.svg"
              alt="Victor logo"
              className="h-8 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className={`font-display text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                  isActive(link)
                    ? "text-violet-glow"
                    : "text-ghost/60 hover:text-ghost"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-violet to-cyan transition-all duration-300 ${
                    isActive(link) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {showSkip && location.pathname === "/" && (
              <button
                onClick={handleSkip}
                className="font-mono text-xs tracking-widest px-4 py-2 rounded-full border border-white/20 bg-black/60 text-ghost/70 backdrop-blur hover:border-violet-500/50 hover:text-ghost transition-colors"
                aria-label="Skip story to projects"
              >
                Skip story → Projects
              </button>
            )}
            <button
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-ghost/70 hover:text-ghost hover:border-violet-500/30 transition-colors"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              <span className="text-sm">{theme === "dark" ? "☀" : "☾"}</span>
            </button>
            <Link
              to="/contact"
              onClick={(e) => handleNavClick(e, links[3])}
              className="font-display text-sm font-semibold px-5 py-2 rounded-full glass gradient-border text-ghost/80 hover:text-ghost transition-all duration-300 hover:glow-violet"
            >
              Let's Talk
            </Link>
          </div>

          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="md:hidden w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-ghost/70 mr-2"
          >
            <span className="text-sm">{theme === "dark" ? "☀" : "☾"}</span>
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-ghost transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-ghost transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-ghost transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-16 left-4 right-4 z-40 glass-strong rounded-2xl p-6 flex flex-col gap-4"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`block font-display text-lg font-medium ${
                    isActive(link) ? "gradient-text" : "text-ghost/70"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
