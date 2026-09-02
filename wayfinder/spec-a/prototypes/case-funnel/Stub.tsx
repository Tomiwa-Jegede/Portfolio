// Cheap stub diff — copy hunks to repo to test card → case → funnel flow
// Ticket: 05-prototype-case-funnel — HITL, react, not ship as-is.

import { useCalEmbed } from "@/lib/cal";
import { track } from "@/lib/analytics";

// Projects.tsx:193 card — add telemetry, keep external link as secondary after case
export function ProjectCardWithTelemetry({ project }: any) {
  return (
    <div
      onClick={() => track({ type: "VIEW_PROJECT_CLICK", project: project.name, surface: "card" })}
      data-testid={`project-${project.name}`}
    >
      <a href={`/projects/${project.slug}`}>View Case →</a>{" "}
      <span className="text-ghost/30">/</span>{" "}
      <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); track({ type: "VIEW_PROJECT_CLICK", project: project.name, surface: "external-live" }); }}>
        View Live ↗
      </a>
    </div>
  );
}

// src/pages/Projects/Convertly.tsx — inline case md (Problem → System → Outcome → Stack → Live+Cal)
export function ConvertlyCase() {
  const { openCal } = useCalEmbed();
  React.useEffect(() => track({ type: "PROJECT_CASE_VIEW", slug: "convertly" }), []);
  return (
    <article className="prose prose-invert max-w-3xl mx-auto px-6 py-24">
      <h1>Convertly — Revenue system that doesn't leak leads</h1>
      <section><h2>Problem</h2><p>Leads from ads/website die in inbox — no booking, no follow-up.</p></section>
      <section><h2>System</h2><ul><li>Booking page → calendar sync</li><li>AI follow-up on missed leads</li><li>Dashboard + workflow</li></ul></section>
      <section><h2>Outcome</h2><p className="font-mono">Demo: 100+ msgs auto-answered + booking→follow-up <span className="text-ghost/40">estimate/demo</span></p><p className="text-sm text-ghost/40">Source: demo loom — honest estimate, not prod scale.</p></section>
      <div className="flex gap-2">{["Next.js","PostgreSQL","OpenAI"].map(t => <span key={t} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs">{t}</span>)}</div>
      <div className="mt-8 flex gap-3">
        <button
          data-cal-namespace="victor30"
          data-cal-link="victor/30min"
          data-cal-config='{"name":"visitor","metadata[source]":"portfolio-case-convertly"}'
          onClick={() => { track({ type: "CAL_CTA_VIEW", slug: "convertly" }); track({ type: "CAL_POPUP_OPEN", slug: "convertly" }); openCal(); }}
          className="rounded-xl bg-violet-600 px-5 py-3 font-mono text-xs text-white"
        >
          Book 20 min →
        </button>
        <a href="https://convertlly.netlify.app/" target="_blank" rel="noopener" className="rounded-xl border border-white/10 px-5 py-3 font-mono text-xs">View Live ↗</a>
      </div>
      {/* Form duplicate below case for funnel continuity — uses same Contact.tsx:43 handler */}
    </article>
  );
}

// Contact.tsx:43 hardened form — honeypot + Turnstile placeholder + 429 branch
export function ContactFormHardened() {
  const [form, setForm] = React.useState({ name:"", email:"", message:"", _gotcha:"" });
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      if (form._gotcha) return; // honeypot
      track({ type: "CONTACT_FORM_SUBMIT", surface: "case-funnel" });
      const r = await fetch("https://formspree.io/f/xjyvbvkv", { method:"POST", headers: {"Content-Type":"application/json", Accept:"application/json"}, body: JSON.stringify(form)});
      if (r.status === 429) { track({ type: "CONTACT_FORM_ERROR", code: "429" }); alert("Busy — try Cal or email directly."); return; }
      if (!r.ok) { track({ type: "CONTACT_FORM_ERROR", code: String(r.status) }); return; }
      track({ type: "CONTACT_FORM_SUCCESS" });
    }}>
      <input name="_gotcha" tabIndex={-1} autoComplete="off" style={{ display:"none" }} value={form._gotcha} onChange={e=>setForm({...form,_gotcha:e.target.value})} aria-hidden />
      <input name="name" required onChange={e=>setForm({...form,name:e.target.value})} />
      <input name="email" type="email" required onChange={e=>setForm({...form,email:e.target.value})} />
      <textarea name="message" required onChange={e=>setForm({...form,message:e.target.value})} />
      <div data-turnstile-sitekey={import.meta.env.VITE_TURNSTILE_KEY} className="my-2 h-16 rounded-xl border border-white/10 bg-white/[0.03]" />
      <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-4 font-mono text-xs uppercase tracking-widest text-white">Get a 24h reply</button>
      <p className="mt-2 text-center font-mono text-[11px] text-ghost/30">I reply within 24h — Cal is faster.</p>
    </form>
  );
}

// src/lib/analytics.ts — typed union (from 04-research-telemetry)
export type AnalyticsEvent =
  | { type:"VIEW_PROJECT_CLICK"; project:string; surface:"card"|"external-live" }
  | { type:"PROJECT_CASE_VIEW"; slug:string }
  | { type:"CAL_CTA_VIEW"; slug:string } | { type:"CAL_POPUP_OPEN"; slug:string } | { type:"CAL_BOOKED"; slug:string }
  | { type:"CONTACT_FORM_START"} | { type:"CONTACT_FORM_SUBMIT"; surface:string } | { type:"CONTACT_FORM_SUCCESS"} | { type:"CONTACT_FORM_ERROR"; code:string}
  | { type:"CONTACT_FUNNEL_STEP"; step:number; source:string };
export const track = (e: AnalyticsEvent) => { if ((window as any).plausible) (window as any).plausible(e.type, { props: e }); else if ((window as any).gtag) (window as any).gtag("event", e.type, e); else console.log("[analytics]", e); };

// src/lib/canonical.ts — per-route canonical fix (from 04)
export const canonicalFor = (path:string) => `https://vctdev.netlify.app${path === "/" ? "/" : path}`;
