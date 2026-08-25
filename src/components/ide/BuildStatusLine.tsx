import { useEffect, useState } from "react";

// Sparse build-status sequence (INITIALIZING... / LOADING.../ READY.).
// Advances on a fixed interval; calls onComplete once the final line is shown.
// Deliberately not a terminal simulator — a handful of lines, not a scrolling log.

interface BuildStatusLineProps {
  lines: string[];
  interval?: number; // ms between lines
  onComplete?: () => void;
  className?: string;
}

export default function BuildStatusLine({
  lines,
  interval = 450,
  onComplete,
  className = "",
}: BuildStatusLineProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= lines.length - 1) {
      if (index === lines.length - 1) onComplete?.();
      return;
    }
    const id = setTimeout(() => setIndex((i) => i + 1), interval);
    return () => clearTimeout(id);
  }, [index, lines.length, interval, onComplete]);

  return (
    <div className={`font-mono text-xs tracking-widest uppercase ${className}`}>
      {lines[index]}
    </div>
  );
}