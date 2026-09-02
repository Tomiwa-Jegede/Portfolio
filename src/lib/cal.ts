let calLoaded = false;

export function useCalEmbed() {
  const load = async () => {
    if (calLoaded) return;
    if (document.querySelector('script[data-cal]')) { calLoaded = true; return; }
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://app.cal.com/embed/embed.js";
      s.async = true;
      s.setAttribute("data-cal", "true");
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("cal embed load failed"));
      document.head.appendChild(s);
    });
    calLoaded = true;
  };
  const openCal = async (calLink = "victor/30min") => {
    const fallback = () => window.open(`https://cal.com/${calLink}`, "_blank", "noopener");
    try {
      await load();
      const w = window as unknown as { Cal?: (...args: unknown[]) => void };
      if (w.Cal) {
        try {
          w.Cal("ui", { styles: { branding: { brandColor: "#7c3aed" } } });
          // try popup via Cal ns, fallback to direct open if not ready
          const opened = document.querySelector(`[data-cal-link="${calLink}"]`);
          if (opened) {
            opened.dispatchEvent(new Event("click", { bubbles: true }));
            setTimeout(() => {
              // if popup not visible after 600ms, fallback
              if (!document.querySelector("[data-cal-modal]") && !document.querySelector("iframe[src*='cal.com']")) fallback();
            }, 600);
            return;
          }
        } catch {}
      }
      fallback();
    } catch {
      fallback();
    }
  };
  return { load, openCal };
}
