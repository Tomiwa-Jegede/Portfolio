import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * Override the viewport margin used to trigger the entrance animation.
   * On mobile the default "-80px" fires too early when the user scrolls
   * to read off-screen text, so we use "0px" there instead.
   * Pass a custom value if you need per-section control.
   */
  viewportMargin?: string;
}

function getMobileViewportMargin(): string {
  if (typeof window === "undefined") return "-80px";
  // Treat anything narrower than 768 px as "mobile"
  return window.innerWidth < 768 ? "0px" : "-80px";
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  viewportMargin,
}: SectionWrapperProps) {
  // Resolve margin once at render time. This is fine because SectionWrapper
  // is typically rendered after the first paint, when window dimensions are
  // already known. If the user rotates the device the component will
  // re-render and pick up the new value.
  const margin = viewportMargin ?? getMobileViewportMargin();

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        // A positive margin means "wait until the element is this far
        // *inside* the viewport before firing". On desktop we keep a small
        // negative margin so the animation starts just before the element
        // scrolls fully into view. On mobile we use 0px so the animation
        // only fires once the element is actually visible.
        margin,
        // Require at least 10 % of the element to be visible before the
        // animation triggers. This adds a second guard on mobile where a
        // section's top edge can technically enter the viewport while the
        // content the user is reading is still below the fold.
        amount: 0.1,
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      // Respect the user's "reduce motion" OS preference.
      style={{ willChange: "opacity, transform" }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}
