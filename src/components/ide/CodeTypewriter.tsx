import { useEffect, useRef, useState } from "react";

// Reusable char-by-char typing primitive. Used both for the IDE's code panel
// and later for hero/nav text during construction. No GSAP dependency here —
// plain timeouts are sufficient for character-level typing and keep this
// component trivially testable in isolation.

interface CodeTypewriterProps {
  text: string;
  speed?: number; // ms per character
  startDelay?: number; // ms before typing begins
  onComplete?: () => void;
  className?: string;
  showCaret?: boolean;
  active?: boolean; // when false, renders nothing (waits its turn in a sequence)
}

export default function CodeTypewriter({
  text,
  speed = 28,
  startDelay = 0,
  onComplete,
  className = "",
  showCaret = true,
  active = true,
}: CodeTypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;
      if (i >= text.length) {
        setDone(true);
        onCompleteRef.current?.();
        return;
      }
      i += 1;
      setDisplayed(text.slice(0, i));
      timeoutId = setTimeout(tick, speed);
    }

    const startId = setTimeout(tick, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(startId);
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay, active]);

  if (!active) return null;

  return (
    <span className={className}>
      {displayed}
      {showCaret && !done && (
        <span
          aria-hidden="true"
          className="inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle animate-pulse"
        />
      )}
    </span>
  );
}