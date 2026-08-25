import { useState } from "react";
import IdeShell from "./IdeShell";
import CodeTypewriter from "./CodeTypewriter";
import BuildStatusLine from "./BuildStatusLine";
import LivePreviewPane, { type PreviewStage } from "./LivePreviewPane";
import EnterKey from "./EnterKey";
import { projects } from "@/pages/Projects/Projects";

// Orchestrates the IDE → code typing → ENTER → handoff sequence for first-time
// visitors to "/". Owns no knowledge of the real Hero/Nav construction —
// once the visitor presses ENTER, this component calls onEnter() and Home.tsx
// takes over rendering the real, already-existing scroll experience.

type Phase = "typing" | "ready" | "collapsing";

const featuredNames = projects.map((p) => p.name);
const navLinks = ["Home", "About", "Projects", "Contact"];
const heroName = "VICTOR";
const heroRole = "Full Stack Developer · Revenue Systems";

const codeLines = [
  `import Header from "./Header";`,
  `import Hero from "./Hero";`,
  `import Projects from "./Projects";`,
  `import About from "./About";`,
  `import Contact from "./Contact";`,
  ``,
  `export default function Victor() {`,
  `  return (`,
  `    <Portfolio>`,
  `      <Header nav={["Home", "About", "Projects", "Contact"]} />`,
  `     <Hero name="${heroName}" role="${heroRole}" />`,
  `      <Projects featured={${JSON.stringify(featuredNames)}} />`,
  `      <About />`,
  `      <Contact />`,
  `    </Portfolio>`,
  `  );`,
  `}`,
];

const statusLines = [
  "INITIALIZING WORKSPACE...",
  "LOADING COMPONENTS...",
  "COMPILING...",
  "READY.",
];

interface BuildSequenceProps {
  onEnter: () => void;
}

export default function BuildSequence({ onEnter }: BuildSequenceProps) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [lineIndex, setLineIndex] = useState(0);
  const [previewStage, setPreviewStage] = useState<PreviewStage>("empty");
  const [statusStarted, setStatusStarted] = useState(false);

  const previewStageForLine = (i: number): PreviewStage => {
    if (i >= codeLines.length - 1) return "complete";
    if (i >= 12) return "projects";
    if (i >= 10) return "buttons";
    if (i >= 9) return "hero";
    if (i >= 8) return "header";
    return "empty";
  };

  function handleLineComplete() {
    const next = lineIndex + 1;
    setPreviewStage(previewStageForLine(lineIndex));
    if (next < codeLines.length) {
      setLineIndex(next);
    } else {
      setStatusStarted(true);
    }
  }

  function handleStatusComplete() {
    setPhase("ready");
  }

  function handleEnterPress() {
    setPhase("collapsing");
    // Brief exit beat before handing off, so ENTER doesn't feel abrupt.
    setTimeout(onEnter, 400);
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0b0d] transition-opacity duration-400 ${
        phase === "collapsing" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="flex-1 min-h-0">
          <IdeShell
            fileName="Hero.tsx"
            statusSlot={
              statusStarted ? (
                <BuildStatusLine
                  lines={statusLines}
                  onComplete={handleStatusComplete}
                />
              ) : (
                <span className="text-white/20">idle</span>
              )
            }
          >
            <div className="space-y-1">
              {codeLines.slice(0, lineIndex + 1).map((line, i) => (
                <div key={i} className="whitespace-pre text-white/70">
                  {i === lineIndex ? (
                    <CodeTypewriter
                      text={line}
                      speed={18}
                      onComplete={handleLineComplete}
                    />
                  ) : (
                    line || "\u00A0"
                  )}
                </div>
              ))}
            </div>
          </IdeShell>
        </div>

        <div className="hidden md:flex w-[360px] flex-shrink-0 border-l border-white/[0.06] p-4 flex-col gap-4">
          <div className="text-[10px] tracking-widest text-white/20 uppercase">
            live preview
          </div>
          <div className="flex-1 min-h-0">
            <LivePreviewPane
              stage={previewStage}
              name={heroName}
              role={heroRole}
              navLinks={navLinks}
              activeLink="Home"
              projectNames={featuredNames}
            />
          </div>
          {phase === "ready" && (
            <div className="flex justify-center pb-2">
              <EnterKey onPress={handleEnterPress} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile ENTER — preview pane is hidden below md, so the key needs its own slot */}
      {phase === "ready" && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center">
          <EnterKey onPress={handleEnterPress} />
        </div>
      )}
    </div>
  );
}