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

  // Hide native cursor globally
  useEffect(() => {
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
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed < 1.5) return;

      particles.current.push({
        x,
        y,
        vx: vx * 0.3 + (Math.random() - 0.5) * 1.5,
        vy: vy * 0.3 + (Math.random() - 0.5) * 1.5,
        life: 1,
        maxLife: 1,
        size: Math.random() * 3 + 1.5,
        hue: Math.random() > 0.5 ? 270 : 190, // violet or cyan
      });
    };

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      frameCount.current++;

      const { x, y, vx, vy, isHovering, isClicking } = cursor.current;

      // Smooth ring follows cursor with lag
      smoothPos.current.x += (x - smoothPos.current.x) * 0.12;
      smoothPos.current.y += (y - smoothPos.current.y) * 0.12;

      // Spawn particles every other frame while moving
      if (frameCount.current % 2 === 0) {
        spawnParticle(x, y, vx, vy);
      }

      // Update particles
      particles.current = particles.current.filter((p) => p.life > 0.01);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life *= 0.88;
      }

      // Draw particles
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

      // Move ring element
      const ring = cursorRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;

      const ringSize = isHovering ? 48 : isClicking ? 20 : 32;
      const ringOpacity = isHovering ? 1 : 0.6;

      ring.style.transform = `translate(${smoothPos.current.x - ringSize / 2}px, ${smoothPos.current.y - ringSize / 2}px)`;
      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.opacity = `${ringOpacity}`;
      ring.style.borderColor = isHovering
        ? "rgba(124,58,237,0.9)"
        : "rgba(255,255,255,0.5)";
      ring.style.backgroundColor = isHovering
        ? "rgba(124,58,237,0.08)"
        : "transparent";

      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      dot.style.opacity = isClicking ? "1" : "0.8";
      dot.style.backgroundColor = isHovering ? "#7c3aed" : "#fff";
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
