import { useEffect, useRef, useState } from "react";

/**
 * Returns whether an element has scrolled into view.
 *
 * The threshold is automatically increased on narrow viewports so that the
 * animation only fires when the element is genuinely visible — not just
 * because the user scrolled down to read text that was clipped below the
 * fold.
 *
 * @param threshold  Fraction of the element that must be visible on desktop
 *                   (default 0.15). On mobile this is raised to at least 0.25
 *                   unless you pass a value higher than that.
 */
export function useAnimateIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use a stricter threshold on mobile so that scrolling to read
    // off-screen text doesn't accidentally fire the animation.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const effectiveThreshold = isMobile ? Math.max(threshold, 0.25) : threshold;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: effectiveThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
