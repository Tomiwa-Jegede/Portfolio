import { useEffect, useRef, useState } from "react";

export interface CursorState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isHovering: boolean;
  isClicking: boolean;
}

export function useCursor() {
  const state = useRef<CursorState>({
    x: -200,
    y: -200,
    vx: 0,
    vy: 0,
    isHovering: false,
    isClicking: false,
  });

  const [, forceRender] = useState(0);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;
    const onMove = (e: MouseEvent) => {
      const prev = state.current;
      state.current = {
        ...prev,
        vx: e.clientX - prev.x,
        vy: e.clientY - prev.y,
        x: e.clientX,
        y: e.clientY,
      };
      forceRender((n) => n + 1);
    };

    const onDown = () => {
      state.current = { ...state.current, isClicking: true };
      forceRender((n) => n + 1);
    };

    const onUp = () => {
      state.current = { ...state.current, isClicking: false };
      forceRender((n) => n + 1);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-magnetic]")) {
        state.current = { ...state.current, isHovering: true };
        forceRender((n) => n + 1);
      }
    };

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-magnetic]")) {
        state.current = { ...state.current, isHovering: false };
        forceRender((n) => n + 1);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mouseout", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return state;
}
