import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  download?: boolean;
}

const variants = {
  primary:
    "bg-gradient-to-r from-violet to-cyan text-white font-semibold shadow-lg shadow-violet/30 hover:shadow-violet/50",
  secondary:
    "glass-strong gradient-border text-ghost/80 hover:text-ghost font-medium",
  ghost:
    "text-ghost/60 hover:text-ghost font-medium border-b border-transparent hover:border-ghost/30",
};

export default function Button({
  children,
  variant = "primary",
  href,
  to,
  onClick,
  className = "",
  download,
}: ButtonProps) {
  const base = `inline-flex items-center gap-2 px-6 py-3 rounded-full font-display text-sm transition-all duration-300 ${variants[variant]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2 },
  };

  if (to) {
    return (
      <motion.div {...motionProps}>
        <Link to={to} className={base}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target={download ? undefined : "_blank"}
        rel="noopener noreferrer"
        download={download}
        className={base}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} className={base} {...motionProps}>
      {children}
    </motion.button>
  );
}
