// Abstract wireframe-style preview shown inside the IDE while code types.
// Simple labeled blocks that appear in sequence, using the site's real
// name/copy and real brand colors, styled to match the muted IDE chrome.

export type PreviewStage =
  | "empty"
  | "header"
  | "hero"
  | "buttons"
  | "projects"
  | "complete";

const stageOrder: PreviewStage[] = [
  "empty",
  "header",
  "hero",
  "buttons",
  "projects",
  "complete",
];

interface LivePreviewPaneProps {
  stage: PreviewStage;
  name?: string;
  role?: string;
  navLinks?: string[];
  activeLink?: string;
  projectNames?: string[];
}

function reached(stage: PreviewStage, target: PreviewStage) {
  return stageOrder.indexOf(stage) >= stageOrder.indexOf(target);
}

export default function LivePreviewPane({
  stage,
  name = "",
  role = "",
  navLinks = [],
  activeLink = "",
  projectNames = [],
}: LivePreviewPaneProps) {
  return (
    <div className="w-full h-full bg-[#0e0f12] rounded-md border border-white/[0.06] p-4 flex flex-col gap-3">
      {/* Header block */}
      <div
        className={`h-6 rounded transition-all duration-500 ease-out flex items-center px-3 gap-3 overflow-hidden ${
          reached(stage, "header")
            ? "bg-white/[0.08] w-full scale-y-100"
            : "bg-white/[0.02] w-1/4 scale-y-95"
        }`}
      >
        {reached(stage, "header") &&
          navLinks.map((link) => (
            <span
              key={link}
              className={`font-mono text-[9px] tracking-wide whitespace-nowrap ${
                link === activeLink ? "text-violet-glow" : "text-ghost/50"
              }`}
            >
              {link}
            </span>
          ))}
      </div>

      {/* Hero block */}
      <div
        className={`flex-1 rounded flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
          reached(stage, "hero") ? "bg-white/[0.04]" : "bg-white/[0.01]"
        }`}
      >
        <div
          className={`transition-all duration-500 ease-out overflow-hidden text-center ${
            reached(stage, "hero") ? "scale-x-100" : "w-0 scale-x-95"
          }`}
        >
          {reached(stage, "hero") && (
            <span className="font-display text-sm font-bold gradient-text tracking-tight whitespace-nowrap">
              {name}
            </span>
          )}
        </div>
        <div
          className={`transition-all duration-500 delay-150 ease-out overflow-hidden text-center ${
            reached(stage, "hero") ? "scale-x-100" : "w-0 scale-x-95"
          }`}
        >
          {reached(stage, "hero") && (
            <span className="font-mono text-[9px] text-cyan-glow/70 whitespace-nowrap">
              {role}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2">
          <div
            className={`h-6 w-20 rounded-full border gradient-border transition-all duration-500 ease-out ${
              reached(stage, "buttons")
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90"
            }`}
          />
          <div
            className={`h-6 w-20 rounded-full border transition-all duration-500 delay-100 ease-out ${
              reached(stage, "buttons")
                ? "border-violet-glow/30 opacity-100 scale-100"
                : "border-white/5 opacity-0 scale-90"
            }`}
          />
        </div>
      </div>

      {/* Project cards row */}
      <div className="flex gap-2 h-10">
        {projectNames.slice(0, 2).map((projectName, i) => (
          <div
            key={projectName}
            className={`flex-1 rounded transition-all duration-500 ease-out flex items-center justify-center px-2 ${
              reached(stage, "projects")
                ? "bg-white/[0.06] opacity-100 scale-100"
                : "bg-white/[0.02] opacity-0 scale-90"
            }`}
            style={{ transitionDelay: reached(stage, "projects") ? `${i * 120}ms` : "0ms" }}
          >
            {reached(stage, "projects") && (
              <span className="font-mono text-[9px] text-ghost/60 truncate">
                {projectName}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
