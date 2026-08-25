import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Read activeSection from the data attribute set in Home
useEffect(() => {
  if (location.pathname !== "/") {
    setActiveSection("hero");
    return;
  }

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;

    const v = scrollY / total;

    if (v < 0.18) setActiveSection("hero");
    else if (v < 0.54) setActiveSection("about");
    else if (v < 0.8) setActiveSection("projects");
    else setActiveSection("contact");
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, [location.pathname]);

  const isActive = (link: (typeof links)[0]) => {
    if (location.pathname !== "/") {
      return location.pathname === link.to;
    }
    return activeSection === link.section;
  };

  const handleNavClick = (e: React.MouseEvent, link: (typeof links)[0]) => {
    // If we're not on the home page, navigate there first then scroll
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      // Wait for home page to mount then scroll
      setTimeout(() => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: link.scrollTarget * totalHeight,
          behavior: "smooth",
        });
      }, 100);
      return;
    }

    // Already on home page — just scroll, no route change
    e.preventDefault();
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: link.scrollTarget * totalHeight,
      behavior: "smooth",
    });
    setMenuOpen(false);
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
            className="font-display font-bold text-lg tracking-tight"
          >
            <span className="gradient-text">VCT.</span>
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
          <div className="hidden md:block">
            <Link
              to="/contact"
              onClick={(e) => handleNavClick(e, links[3])}
              className="font-display text-sm font-semibold px-5 py-2 rounded-full glass gradient-border text-ghost/80 hover:text-ghost transition-all duration-300 hover:glow-violet"
            >
              Let's Talk
            </Link>
          </div>

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
