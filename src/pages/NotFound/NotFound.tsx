import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Victor</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <section className="min-h-screen bg-[#050508] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display font-bold text-6xl text-ghost/90 mb-4">404</h1>
        <p className="text-ghost/50 mb-8">This page doesn't exist.</p>
        <a href="/" className="font-mono text-xs tracking-widest text-ghost/80 border border-white/10 rounded-xl px-5 py-3 hover:border-violet-500/50 hover:text-ghost transition-colors duration-300">← Back home</a>
      </section>
    </>
  );
}