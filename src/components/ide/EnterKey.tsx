import { useEffect, useState } from "react";

// Physical-keyboard-key styled CTA. Fires onPress on click, Space, or Enter.
// Deliberately not styled like the portfolio's real Button — this belongs to
// the muted IDE chrome, not the finished-portfolio brand palette.

interface EnterKeyProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

export default function EnterKey({
  onPress,
  label = "ENTER",
  disabled = false,
}: EnterKeyProps) {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setPressed(true);
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        setPressed(false);
        onPress();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [disabled, onPress]);

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={onPress}
      aria-label={`${label} — start the experience`}
      className={`
        font-mono text-sm tracking-[0.2em] uppercase
        px-8 py-4 rounded-md
        border border-white/15
        bg-[#111318] text-white/70
        transition-all duration-100
        ${pressed ? "translate-y-[3px] shadow-none border-white/25 text-cyan-glow" : "shadow-[0_4px_0_0_rgba(255,255,255,0.08)] hover:border-white/25 hover:text-white/90"}
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      [ {label} ↵ ]
    </button>
  );
}