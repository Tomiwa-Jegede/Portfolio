import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const isMobileViewport = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

export const projects = [
  {
    name: "Convertly",
    tagline:
      "Revenue automation for businesses that can't afford to leak leads.",
    description:
      "A full-stack platform that combines conversion-focused websites, AI-powered customer engagement, automated booking systems, lead tracking dashboards, and follow-up workflows — all in one place.",
    stack: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "OpenAI",
      "Automation",
    ],
    link: "https://convertlly.netlify.app/",
    status: "live",
    image: "/images/convertly.png" as string | null, // drop screenshot in /public/images/
    accent: "#7c3aed",
  },
  {
    name: "Trend Tribe",
    tagline:
      "The student-only marketplace to buy, sell, and trade within your campus.",
    description:
      "A full-stack marketplace built for student communities — listings, real-time messaging, notifications, and JWT-based authentication, backed by a Prisma/PostgreSQL data layer and Cloudinary media delivery.",
    stack: [
      "React",
      "Express.js",
      "PostgreSQL",
      "Prisma",
      "Cloudinary",
      "JWT Auth",
    ],
      link: "https://trendtribee.netlify.app/",
    status: "Live",
    image: "/images/trendtribe.png" as string | null, // drop screenshot in /public/images/
    accent: "#1340B8",
  },
  {
    name: "Jegz Menswear",
    tagline: "A modern Nigerian menswear e-commerce experience.",
    description:
      "A full-stack e-commerce platform built for Jegz Menswear, featuring product discovery, size and inventory management, cart and checkout, made-to-measure ordering, Flutterwave payments, automated email marketing, and a production-ready admin system.",
    stack: [
      "React",
      "Vite",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "Nest.js",
      "PostgreSQL",
      "Prisma",
      "Flutterwave",
      "Brevo",
      "Cloudinary",
      "Playwright",
    ],
    link: "https://jegzmenswear.store/",
    status: "Live",
    image: "/images/jegzmenswear.PNG" as string | null, // drop screenshot in /public/images/
    accent: "#e5e5e5",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mobile = isMobileViewport();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: mobile ? "0px" : "-80px", amount: 0.1 }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="glass-strong rounded-2xl p-8 md:p-10 relative overflow-hidden cursor-none"
          data-magnetic
        >
          {/* Glare layer */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 transition-opacity duration-300"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.06), transparent 60%)`,
              ),
              opacity: hovered ? 1 : 0,
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            {/* Left: content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-display font-bold text-2xl text-ghost/90 tracking-tight">
                  {project.name}
                </h3>
                <span className="font-mono text-[10px] tracking-widest text-violet-400/70 border border-violet-500/20 rounded-full px-3 py-1 uppercase inline-flex items-center gap-2">
                  {project.status.toLowerCase() === "live" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                  )}

                  {project.status}
                </span>
              </div>

              <p className="text-ghost/70 font-medium mb-3 text-[15px]">
                {project.tagline}
              </p>
              <p className="text-ghost/40 text-sm leading-relaxed mb-6 max-w-xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] tracking-wide text-cyan-400/60 bg-cyan-400/5 border border-cyan-400/10 rounded-full px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs tracking-widest text-ghost/80 border border-white/10 rounded-xl px-5 py-3 hover:border-violet-500/50 hover:text-ghost transition-colors duration-300"
                  >
                    View Project ↗
                  </a>
                ) : (
                  <span className="font-mono text-xs tracking-widest text-ghost/20 border border-white/5 rounded-xl px-5 py-3 cursor-default">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>

            {/* Right: screenshot preview */}
            <motion.div
              className="w-full lg:w-[340px] h-[240px] flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                transformStyle: "preserve-3d",
                transform: "translateZ(20px)",
                border: `1px solid ${project.accent}20`,
                boxShadow: hovered
                  ? `0 0 40px ${project.accent}20, 0 20px 60px rgba(0,0,0,0.4)`
                  : `0 10px 30px rgba(0,0,0,0.3)`,
                transition: "box-shadow 0.4s ease",
              }}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} screenshot`}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                // Placeholder shown until you add a screenshot
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: project.accent + "10" }}
                >
                  <span className="font-mono text-xs text-white/20">
                    screenshot coming soon
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-px"
            style={{
              background: `linear-gradient(90deg, ${project.accent}, #06b6d4)`,
            }}
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

export default function Projects({ standalone = false }: { standalone?: boolean }) {
  const mobile = isMobileViewport();
  const [activeIndex, setActiveIndex] = useState(0);
  const HeadingTag = standalone ? motion.h1 : motion.h2;

  return (
    <>
      <Helmet>
        <title>Projects — Victor</title>
        <meta
          name="description"
          content="A selection of full-stack projects built by Victor — e-commerce platforms, marketplaces, and revenue automation systems."
        />
        <link rel="canonical" href="https://vctdev.netlify.app/" />
      </Helmet>
      <section className="min-h-screen bg-[#050508] flex items-center px-6 py-32">
      <div className="max-w-5xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{
            once: true,
            margin: mobile ? "0px" : "-100px",
            amount: 0.1,
          }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.3em] text-cyan-400/60 uppercase mb-8"
        >
          Projects
        </motion.p>

        <HeadingTag
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            margin: mobile ? "0px" : "-100px",
            amount: 0.1,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tighter mb-16"
        >
          Things I've <span className="gradient-text">shipped.</span>
        </HeadingTag>

        {mobile ? (
          <div className="space-y-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={projects[activeIndex].name}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProjectCard
                    project={projects[activeIndex]}
                    index={activeIndex}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() =>
                  setActiveIndex(
                    (prev) => (prev - 1 + projects.length) % projects.length,
                  )
                }
                className="font-mono text-xs tracking-widest text-ghost/70 border border-white/10 rounded-xl px-5 py-3 hover:border-violet-500/50 hover:text-ghost transition-colors duration-300"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-2">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "bg-cyan-400 w-6"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to project ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % projects.length)
                }
                className="font-mono text-xs tracking-widest text-ghost/70 border border-white/10 rounded-xl px-5 py-3 hover:border-violet-500/50 hover:text-ghost transition-colors duration-300"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
      </section>
    </>
  );
}
