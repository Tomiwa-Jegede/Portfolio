import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 rounded-full border border-violet/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border border-cyan/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-3 rounded-full bg-violet/30" />
        </div>
        <span className="font-mono text-xs text-ghost/40 tracking-widest">
          LOADING
        </span>
      </motion.div>
    </div>
  );
}
