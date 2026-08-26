import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const skills = [
  "Full Stack Web Development",
  "SaaS Product Development",
  "AI & Automation Integration",
  "API Design & Backend Systems",
  "Conversion-Focused UX",
  "Business Process Automation",
];

// Mobile-safe: no negative viewport margins, amount guard instead
const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About({ standalone = false }: { standalone?: boolean }) {
  const mobile = isMobileViewport();
  const HeadingTag = standalone ? motion.h1 : motion.h2;
  return (
    <>
      <Helmet>
        <title>About — Victor</title>
        <meta
          name="description"
          content="Learn more about Victor, a Full Stack Developer who builds revenue systems, not just websites."
        />
        <link rel="canonical" href="https://vctdev.netlify.app/" />
      </Helmet>
      <section className="min-h-screen bg-[#050508] flex items-center px-6 py-32">
      <div className="max-w-5xl mx-auto w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          // On mobile: 0px margin + require 10% visibility before firing
          viewport={{
            once: true,
            margin: mobile ? "0px" : "-100px",
            amount: 0.1,
          }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.3em] text-cyan-400/60 uppercase mb-8"
        >
          About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — story */}
          <div>
            <HeadingTag
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                margin: mobile ? "0px" : "-100px",
                amount: 0.1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tighter mb-10"
            >
              I don't just build{" "}
              <span className="gradient-text">websites.</span>
              <br />I build systems that{" "}
              <span className="gradient-text">grow businesses.</span>
            </HeadingTag>

            {[
              "I'm Victor — a Full Stack Developer who works across the entire product lifecycle, from designing user experiences and building scalable frontends to developing backend systems, APIs, databases, and automation workflows.",
              "My approach is straightforward: software should serve a clear purpose. Every line of code I write is aimed at increasing efficiency, improving customer experiences, or helping a business generate more revenue.",
              "That thinking led me to build Convertly — a revenue automation platform that helps businesses stop leaking leads through conversion-focused websites, AI-powered customer engagement, and end-to-end workflow automation.",
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{
                  once: true,
                  margin: mobile ? "0px" : "-80px",
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-ghost/50 leading-relaxed mb-5 text-[15px]"
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Right — skills */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs tracking-[0.25em] text-violet-400/50 uppercase mb-6"
            >
              What I do
            </motion.p>

            <div className="space-y-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  // Raised amount on mobile so items only animate once actually visible
                  viewport={{
                    once: true,
                    margin: mobile ? "0px" : "-60px",
                    amount: mobile ? 0.25 : 0.1,
                  }}
                  className="group flex items-center gap-4 py-3 border-b border-white/5 cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 group-hover:bg-cyan-400 transition-colors duration-300 flex-shrink-0" />
                  <span className="text-ghost/60 group-hover:text-ghost/90 transition-colors duration-300 text-sm font-medium tracking-wide">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4"
            >
              {[
                { value: "1", label: "SaaS Built" },
                { value: "∞", label: "Problems Solved" },
                { value: "100%", label: "Outcome-Driven" },
              ].map(({ value, label }) => (
                <div key={label} className="glass rounded-xl p-4 text-center">
                  <div className="font-display font-bold text-2xl gradient-text mb-1">
                    {value}
                  </div>
                  <div className="font-mono text-[10px] tracking-widest text-ghost/30 uppercase">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
