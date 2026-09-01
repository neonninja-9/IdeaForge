import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  FileUp,
  Mic,
  LoaderCircle,
  WandSparkles,
} from "lucide-react";
import aiService from "../../services/aiService";
import RadialRevealButton from "../../components/RadialRevealButton";

interface QuickCaptureProps {
  capture: string;
  setCapture: (value: string) => void;
  onManualEntry: () => void;
}

export default function QuickCapture({ capture, setCapture, onManualEntry }: QuickCaptureProps) {
  const navigate = useNavigate();
  const [isStructuring, setIsStructuring] = useState(false);

  async function handleMagicStructure() {
    const trimmed = capture.trim();
    if (!trimmed) return;

    setIsStructuring(true);
    try {
      const res = await aiService.structureIdea(trimmed);
      navigate("/submit", { state: { prefillData: res.data } });
    } catch (err) {
      console.error("AI Structure failed", err);
      onManualEntry();
    } finally {
      setIsStructuring(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-2 transition focus-within:border-vivid/50 focus-within:ring-2 focus-within:ring-vivid/20 dark:border-white/10 dark:bg-[#171323] sm:p-3">
      <textarea
        value={capture}
        onChange={(event) => setCapture(event.target.value)}
        rows={3}
        placeholder="Describe a problem, feature, product, or rough thought..."
        className="min-h-20 w-full resize-none border-none bg-transparent px-2 py-2 text-base leading-6 text-slate-800 shadow-none outline-none placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500"
        aria-label="Capture an idea"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-white/10">
        <div className="flex items-center gap-1">
          <span className="group relative"><button type="button" disabled className="grid size-11 cursor-not-allowed place-items-center rounded-lg text-slate-400 dark:text-slate-600" aria-label="Record voice note, coming soon"><Mic size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
          <span className="group relative"><button type="button" disabled className="grid size-11 cursor-not-allowed place-items-center rounded-lg text-slate-400 dark:text-slate-600" aria-label="Add camera image, coming soon"><Camera size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
          <span className="group relative"><button type="button" disabled className="grid size-11 cursor-not-allowed place-items-center rounded-lg text-slate-400 dark:text-slate-600" aria-label="Attach a file, coming soon"><FileUp size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <button
            type="button"
            onClick={onManualEntry}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:flex-none"
          >
            Manual Entry
          </button>
          <RadialRevealButton
            onClick={handleMagicStructure}
            disabled={isStructuring || !capture.trim()}
            padding="0 16px"
            style={{ minHeight: '44px', fontWeight: 600, fontSize: '0.875rem' }}
            className="flex-1 sm:flex-none shadow-sm shadow-vivid/20 disabled:cursor-not-allowed disabled:opacity-50"
            fill="transparent"
            colors={{ textColor: "#A16207", hoverFill: "#A16207", hoverTextColor: "#ffffff" }}
            border={{ borderWidth: 1, borderColor: "rgba(161, 98, 7, 0.3)" }}
            rounded={20}
          >
            <span className="flex items-center justify-center gap-2">
              {isStructuring ? <LoaderCircle className="animate-spin" size={17} /> : <WandSparkles size={17} />}
              {isStructuring ? "Forging..." : "Magic Structure"}
            </span>
          </RadialRevealButton>
        </div>
      </div>
    </div>
  );
}
