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
    <div className="mt-5 rounded-[22px] border border-white/10 bg-[#1a1625] p-3 shadow-2xl shadow-black/30 sm:p-4">
      <textarea value={capture} onChange={(event) => setCapture(event.target.value)} rows={2} placeholder="What's on your mind today? Jot down any raw thought..." className="min-h-16 w-full resize-none !border-none bg-transparent px-2 py-2 text-base text-slate-200 !outline-none focus:!outline-none focus-visible:!outline-none focus:!border-transparent focus:!ring-0 focus:!shadow-none !shadow-none placeholder:text-slate-500 sm:text-lg" aria-label="Capture an idea" style={{ outline: 'none', boxShadow: 'none', borderColor: 'transparent' }} />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1">
          <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Record voice note — coming soon"><Mic size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
          <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Add camera image — coming soon"><Camera size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
          <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Attach a file — coming soon"><FileUp size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
          <span className="ml-1 hidden text-xs text-slate-500 sm:inline">A raw thought is all you need to start.</span>
        </div>
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-2">
          <button
            type="button"
            onClick={onManualEntry}
            className="inline-flex min-h-11 flex-1 sm:flex-none items-center justify-center rounded-xl bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/20"
          >
            Manual Entry
          </button>
          <button
            type="button"
            onClick={handleMagicStructure}
            disabled={isStructuring || !capture.trim()}
            className="inline-flex min-h-11 flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:-translate-y-0.5 hover:from-purple-400 hover:to-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isStructuring ? <LoaderCircle className="animate-spin" size={17} /> : <WandSparkles size={17} />}
            {isStructuring ? "Forging..." : "Magic Structure"}
          </button>
        </div>
      </div>
    </div>
  );
}
