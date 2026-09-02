export type AnalyticsEvent =
  | { type: "VIEW_PROJECT_CLICK"; project: string; surface: "card" | "external-live" | "view-case" }
  | { type: "PROJECT_CASE_VIEW"; slug: string }
  | { type: "CAL_CTA_VIEW"; slug?: string }
  | { type: "CAL_POPUP_OPEN"; slug?: string }
  | { type: "CAL_BOOKED"; slug?: string }
  | { type: "CONTACT_FORM_START" }
  | { type: "CONTACT_FORM_SUBMIT"; surface: string }
  | { type: "CONTACT_FORM_SUCCESS"; surface: string }
  | { type: "CONTACT_FORM_ERROR"; code: string }
  | { type: "CONTACT_FUNNEL_STEP"; step: number; source: string };

// Minimal adapter — plausible → gtag → console, no npm dep
declare global {
  interface Window {
    plausible?: (event: string, opts?: { props: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function resolveProvider(): "plausible" | "ga" | "console" {
  const env = (import.meta as unknown as { env: Record<string, string> }).env ?? {};
  if (env.VITE_PLAUSIBLE_DOMAIN && typeof window.plausible === "function") return "plausible";
  if (env.VITE_GA_ID && typeof window.gtag === "function") return "ga";
  if (typeof window.plausible === "function") return "plausible";
  if (typeof window.gtag === "function") return "ga";
  return "console";
}

function toStringProps(e: AnalyticsEvent): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(e)) {
    if (k === "type") continue;
    out[k] = String(v);
  }
  return out;
}

export function track(event: AnalyticsEvent) {
  const provider = resolveProvider();
  if (provider === "plausible" && window.plausible) {
    window.plausible(event.type, { props: toStringProps(event) as Record<string, string> });
    return;
  }
  if (provider === "ga" && window.gtag) {
    window.gtag("event", event.type, toStringProps(event));
    return;
  }
  // bounded consolefallback, also buffer to localStorage for offline
  try {
    const key = "analytics_buffer";
    const raw = localStorage.getItem(key);
    const arr: unknown[] = raw ? JSON.parse(raw) : [];
    arr.push({ ...event, ts: Date.now() });
    while (arr.length > 50) arr.shift();
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {}
  // no noise in prod
  if (import.meta.env.DEV) console.log("[analytics]", event);
}

export function trackPageView(path: string) {
  if (typeof window.plausible === "function") {
    window.plausible("pageview", { props: { path } });
  } else if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", { page_path: path });
  }
}
