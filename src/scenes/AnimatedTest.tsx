import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: "word" | "char";
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  splitBy = "word",
}: AnimatedTextProps) {
  const items = splitBy === "word" ? text.split(" ") : text.split("");

  return (
    <span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      aria-label={text}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {item}
          {splitBy === "word" ? "" : ""}
        </motion.span>
      ))}
    </span>
  );
}
