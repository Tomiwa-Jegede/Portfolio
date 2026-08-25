import { ReactNode } from "react";

// Muted, editorial IDE chrome — not a VS Code clone. Graphite/near-black base
// with a single cyan accent line, per the "backstage vs. finished product"
// contrast decision. Hosts whatever content BuildSequence passes as children
// (code panel, build status, live preview) — this component only owns the
// window/tabs/explorer framing around it.

interface IdeShellProps {
  fileName?: string;
  children: ReactNode;
  statusSlot?: ReactNode; // BuildStatusLine, rendered in the bottom bar
}

const explorerFiles = [
  "Header.tsx",
  "Hero.tsx",
  "About.tsx",
  "Projects.tsx",
  "Contact.tsx",
];

export default function IdeShell({
  fileName = "Hero.tsx",
  children,
  statusSlot,
}: IdeShellProps) {
  return (
    <div className="w-full h-full bg-[#0a0b0d] text-white/80 flex flex-col font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="ml-4 text-xs tracking-widest text-white/30 uppercase">
          victor — portfolio.build
        </span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* File explorer */}
        <div className="hidden md:block w-48 flex-shrink-0 border-r border-white/[0.06] px-3 py-4">
          <div className="text-[10px] tracking-widest text-white/20 uppercase mb-3 px-2">
            src/components
          </div>
          {explorerFiles.map((file) => (
            <div
              key={file}
              className={`px-2 py-1.5 rounded text-xs ${
                file === fileName
                  ? "text-cyan-glow bg-white/[0.04]"
                  : "text-white/30"
              }`}
            >
              {file}
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Tab */}
          <div className="flex items-center border-b border-white/[0.06] flex-shrink-0">
            <div className="px-4 py-2 text-xs text-white/70 border-r border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
              {fileName}
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
            </div>
          </div>

          {/* Code content */}
          <div className="flex-1 min-h-0 overflow-auto px-6 py-6">
            {children}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-white/30 flex-shrink-0">
        <div>{statusSlot}</div>
        <div className="text-[10px] tracking-widest uppercase">
          build environment
        </div>
      </div>
    </div>
  );
}
