import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { projects } from "./Projects";
import { track } from "@/lib/analytics";
import { canonicalFor } from "@/lib/canonical";
import { useCalEmbed } from "@/lib/cal";

const caseExtra: Record<string, { problem: string; system: string[]; outcomeDetail: string }> = {
  convertly: {
    problem: "Leads from ads and website die in inbox — no booking, no AI follow-up, no dashboard.",
    system: ["Booking page → calendar sync", "AI auto-answer on missed leads", "Dashboard + workflow automation"],
    outcomeDetail: "Demo shows 100+ messages auto-answered + booking→follow-up in one place. Honest estimate — instrument prod to replace with real leads/week.",
  },
  "trend-tribe": {
    problem: "Students trade on scattered chats — no campus-only listings, no trust, no discovery.",
    system: ["Listings + Cloudinary media", "Marketplace filters (Category/Condition/price)", "JWT auth + Prisma/Postgres"],
    outcomeDetail: "Pilot: filter in <1s @100 listings (current 16 <14d). Proves query + image sync before scaling.",
  },
  "jegz-menswear": {
    problem: "Menswear brand needs product discovery + size/inventory + checkout that staff can run.",
    system: ["Product discovery + size/inventory", "Cart + Flutterwave checkout + made-to-measure", "Brevo email + admin ops"],
    outcomeDetail: "Live store ✓ — Flutterwave checkout at jegzmenswear.store. Track orders to add real weekly metric.",
  },
};

export default function ProjectCase() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const extra = slug ? caseExtra[slug] : undefined;
  const { openCal } = useCalEmbed();

  useEffect(() => {
    if (slug) track({ type: "PROJECT_CASE_VIEW", slug });
  }, [slug]);

  if (!project || !extra) {
    return (
      <>
        <Helmet>
          <title>Case not found — Victor</title>
          <link rel="canonical" href={canonicalFor("/projects")} />
        </Helmet>
        <section className="min-h-screen bg-[#050508] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-mono text-xs tracking-widest text-ghost/40">Case not found</p>
            <Link to="/projects" className="mt-4 inline-block font-mono text-xs text-violet-400 hover:text-ghost">Back to Projects →</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.name} — Case Study — Victor</title>
        <meta name="description" content={`${project.name}: ${project.tagline} — ${project.outcome}`} />
        <link rel="canonical" href={canonicalFor(`/projects/${project.slug}`)} />
      </Helmet>
      <section className="min-h-screen bg-[#050508] px-6 py-32">
        <div className="max-w-3xl mx-auto">
          <Link to="/projects" className="font-mono text-xs tracking-widest text-ghost/40 hover:text-ghost mb-8 inline-block">← All Projects</Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display font-bold text-[clamp(2rem,6vw,3.5rem)] leading-none tracking-tight text-ghost mb-4">
            {project.name}
          </motion.h1>
          <p className="font-mono text-xs tracking-wide text-cyan-400/70 mb-2">{project.tagline}</p>
          <p className="font-mono text-xs tracking-wide text-violet-400/80 mb-8">{project.outcome}</p>

          <div className="space-y-10">
            <section>
              <h2 className="font-mono text-xs tracking-[0.3em] text-ghost/40 uppercase mb-3">Problem</h2>
              <p className="text-ghost/70 leading-relaxed text-[15px]">{extra.problem}</p>
            </section>
            <section>
              <h2 className="font-mono text-xs tracking-[0.3em] text-ghost/40 uppercase mb-3">System</h2>
              <ul className="space-y-2">
                {extra.system.map((s) => (
                  <li key={s} className="flex gap-3 text-ghost/60 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 mt-2 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-mono text-xs tracking-[0.3em] text-ghost/40 uppercase mb-3">Outcome</h2>
              <p className="text-ghost/70 leading-relaxed text-[15px]">{extra.outcomeDetail}</p>
            </section>
            <section>
              <h2 className="font-mono text-xs tracking-[0.3em] text-ghost/40 uppercase mb-3">Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span key={t} className="font-mono text-[11px] tracking-wide text-cyan-400/60 bg-cyan-400/5 border border-cyan-400/10 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <button
              data-cal-link="victor/30min"
              data-cal-namespace="victor30"
              data-cal-config='{"metadata[source]":"case-convertly"}'
              onClick={() => { track({ type: "CAL_CTA_VIEW", slug }); track({ type: "CAL_POPUP_OPEN", slug }); openCal("victor/30min"); }}
              className="font-mono text-xs tracking-widest text-white bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl px-5 py-3 hover:opacity-90"
            >
              Book 20 min →
            </button>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={() => track({ type: "VIEW_PROJECT_CLICK", project: project.slug, surface: "external-live" })} className="font-mono text-xs tracking-widest text-ghost/80 border border-white/10 rounded-xl px-5 py-3 hover:border-violet-500/50">
                View Live ↗
              </a>
            )}
            <Link to="/contact" onClick={() => track({ type: "CONTACT_FORM_START" })} className="font-mono text-xs tracking-widest text-ghost/60 border border-white/5 rounded-xl px-5 py-3 hover:border-white/10">
              Get a 24h reply
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] text-ghost/20">Live ↗ is secondary — this case is primary proof. Book above form per spec.</p>
        </div>
      </section>
    </>
  );
}
