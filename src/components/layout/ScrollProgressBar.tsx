import { useSpring, motion } from "framer-motion";
import { useLenisScrollContext } from "@/context/LenisScrollContext";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useLenisScrollContext();

  // Spring smoothing so the bar doesn't stutter on mobile
  const scaleX = useSpring(scrollYProgress ?? 0, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "5px",
        background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}