import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";
import type Lenis from "@studio-freight/lenis";

type LenisScrollContextValue = {
  scrollYProgress: MotionValue<number> | null;
  lenis: Lenis | null;
};

export const LenisScrollContext = createContext<LenisScrollContextValue>({
  scrollYProgress: null,
  lenis: null,
});

export function useLenisScrollContext() {
  return useContext(LenisScrollContext);
}