import { useEffect, useRef } from "react";
import { useCursor } from "@/hooks/useCursor";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cursor = useCursor();
  const particles = useRef<Particle[]>([]);
  const smoothPos = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);
  const lastMove = useRef(0);

  if (
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    return null;
  }

  // Hide native cursor globally — only for fine pointer and not reduced-motion
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;
    document.documentElement.style.cursor = "none";
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = (x: number, y: number, vx: number, vy: number) => {
      if (particles.current.length > 18) return;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed < 2.5) return;

      particles.current.push({
        x,
        y,
        vx: vx * 0.25 + (Math.random() - 0.5) * 1,
        vy: vy * 0.25 + (Math.random() - 0.5) * 1,
        life: 1,
        maxLife: 1,
        size: Math.random() * 2 + 1,
        hue: Math.random() > 0.5 ? 270 : 190,
      });
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      frameCount.current++;

      const { x, y, vx, vy, isHovering, isClicking } = cursor.current;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 1) lastMove.current = performance.now();
      const idle = performance.now() - lastMove.current > 800;

      // Smooth ring follows cursor with lag
      smoothPos.current.x += (x - smoothPos.current.x) * 0.12;
      smoothPos.current.y += (y - smoothPos.current.y) * 0.12;

      // Spawn particles throttled + idle-aware: every 4 frames, capped at 18, not when idle
      if (!idle && frameCount.current % 4 === 0) {
        spawnParticle(x, y, vx, vy);
      }

      // Update particles — skip work when idle and empty
      if (!idle || particles.current.length) {
        particles.current = particles.current.filter((p) => p.life > 0.02);
        for (const p of particles.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.life *= 0.86;
        }
      } else {
        // idle and empty — skip canvas clear/draw this frame
        // still update ring/dot below
      }

      // Draw particles — skip when idle and no particles
      if (!idle || particles.current.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles.current) {
          const alpha = p.life * 0.7;
          const radius = p.size * p.life;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
          grd.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${alpha})`);
          grd.addColorStop(1, `hsla(${p.hue}, 80%, 65%, 0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      // Move ring element
      const ring = cursorRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;

      const ringSize = isHovering ? 48 : isClicking ? 20 : 32;
      const ringOpacity = isHovering ? 1 : 0.6;
      const isLight = document.documentElement.classList.contains("light");

      ring.style.transform = `translate(${smoothPos.current.x - ringSize / 2}px, ${smoothPos.current.y - ringSize / 2}px)`;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.opacity = `${ringOpacity}`;
      ring.style.borderColor = isHovering
        ? "rgba(124,58,237,0.9)"
        : isLight
          ? "rgba(15,15,18,0.55)"
          : "rgba(255,255,255,0.5)";
      ring.style.backgroundColor = isHovering
        ? "rgba(124,58,237,0.08)"
        : "transparent";

      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      dot.style.opacity = isClicking ? "1" : "0.8";
      dot.style.backgroundColor = isHovering ? "#7c3aed" : isLight ? "#0f0f12" : "#fff";
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [cursor]);

  return (
    <>
      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
      />

      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border transition-[width,height,border-color,background-color] duration-150 ease-out"
        style={{
          width: 32,
          height: 32,
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: "rgba(255,255,255,0.5)",
          willChange: "transform",
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#fff",
          willChange: "transform",
        }}
      />
    </>
  );
}
