"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function Contact({ standalone = false }: { standalone?: boolean }) {
  const HeadingTag = standalone ? motion.h1 : motion.h2;
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  useEffect(() => {
    const saved = localStorage.getItem("contactDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm({
        name: parsed.name ?? "",
        email: parsed.email ?? "",
        message: parsed.message ?? "",
      });
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/xjyvbvkv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Form submission failed");
      }

      setStatus("sent");
      setForm({
        name: "",
        email: "",
        message: "",
      });
      localStorage.removeItem("contactDraft");
    } catch (err) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!form.name && !form.email && !form.message) return;
    localStorage.setItem("contactDraft", JSON.stringify(form));
  }, [form]);

  const inputClass =
    "w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4 text-ghost/80 placeholder:text-ghost/20 font-body text-sm focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-colors duration-300";

  return (
    <>
      <Helmet>
        <title>Contact — Victor</title>
        <meta name="description" content="Get in touch with Victor to discuss your next full-stack project or revenue system." />
        <link rel="canonical" href="https://vctdev.netlify.app/" />
      </Helmet>
      <section className="min-h-screen bg-[#050508] flex items-center px-6 py-32">
        <div className="max-w-2xl mx-auto w-full">
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} className="font-mono text-xs tracking-[0.3em] text-cyan-400/60 uppercase mb-8">
            Contact
          </motion.p>
          <HeadingTag initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="font-display font-bold text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tighter mb-6">
            Let's build <span className="gradient-text">something real.</span>
          </HeadingTag>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="text-ghost/40 text-sm leading-relaxed mb-14">
            Have a business problem worth solving? A system that needs building? Send me a message and I'll get back to you within 24 hours.
          </motion.p>
          {status === "sent" ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-2xl p-12 text-center">
              <div className="text-4xl mb-4">✦</div>
              <h3 className="font-display font-bold text-xl text-ghost/90 mb-2">Message sent.</h3>
              <p className="text-ghost/40 text-sm">I'll be in touch within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className={inputClass} />
              </div>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project or problem..." required rows={6} className={inputClass + " resize-none"} />
              <motion.button type="submit" disabled={status === "sending"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl font-mono text-sm tracking-widest uppercase bg-gradient-to-r from-violet-600 to-cyan-500 text-whitefont-medium hover:opacity-90 transition-opacity duration-300 disabled:opacity-50">
                {status === "sending" ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}