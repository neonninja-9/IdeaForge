import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Lightbulb,
  Radar,
  RotateCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { runIdeaSimilaritySimulation, type SimulationResult } from "../../utils/similaritySimulation";

interface IdeaSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaData: {
    title: string;
    problem: string;
    solution: string;
    tags?: string[];
    category?: string;
  };
  createdIdeaId: string;
}

export default function IdeaSimulationModal({
  isOpen,
  onClose,
  ideaData,
  createdIdeaId,
}: IdeaSimulationModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeScanStep, setActiveScanStep] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const SCAN_STEPS = [
    "Vectorizing problem & solution semantic matrix...",
    "Querying benchmark demo database (15+ curated projects)...",
    "Running multi-factor semantic overlap analysis...",
    "Synthesizing market novelty & competitive differentiation...",
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Reset simulation state
    setIsScanning(true);
    setScanProgress(0);
    setActiveScanStep(0);

    const simulation = runIdeaSimilaritySimulation(ideaData);
    setResult(simulation);

    // Progress stepper animation
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsScanning(false), 300);
          return 100;
        }
        const next = prev + 5;
        if (next >= 25 && next < 50) setActiveScanStep(1);
        else if (next >= 50 && next < 75) setActiveScanStep(2);
        else if (next >= 75) setActiveScanStep(3);
        return next;
      });
    }, 80);

    return () => clearInterval(progressInterval);
  }, [isOpen, ideaData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md px-4 py-6 sm:px-6 overflow-y-auto">
      <div className="animate-reveal-up relative w-full max-w-3xl rounded-[32px] border border-violet-500/20 bg-[#120F17] text-white shadow-2xl shadow-purple-950/40 p-6 sm:p-8 my-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-indigo-600/15 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 grid size-9 place-items-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isScanning ? (
          /* ─── PHASE 1: Interactive Live Scanner Simulation ─── */
          <div className="py-8 flex flex-col items-center text-center">
            {/* Animated Radar Pulse Icon */}
            <div className="relative mb-6">
              <div className="grid size-24 place-items-center rounded-[28px] bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/40 text-violet-400 shadow-xl shadow-violet-900/40">
                <Radar size={44} className="animate-spin text-violet-400" style={{ animationDuration: "3s" }} />
              </div>
              <span className="absolute inset-0 rounded-[28px] border-2 border-violet-400/40 animate-ping" />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300 mb-3">
              <Cpu size={14} className="animate-pulse" />
              <span>Simulating Market Landscape (Demo Database)</span>
            </div>

            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Benchmarking Your Idea
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Comparing "{ideaData.title}" against demo benchmark ideas to calculate novelty, domain overlaps, and competitive edge.
            </p>

            {/* Progress Bar */}
            <div className="mt-8 w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                <span>Simulation progress</span>
                <span className="font-bold text-violet-400">{scanProgress}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-100 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>

            {/* Animated Stepper Steps */}
            <div className="mt-6 w-full max-w-md space-y-2 text-left">
              {SCAN_STEPS.map((step, idx) => {
                const isCompleted = activeScanStep > idx || scanProgress === 100;
                const isCurrent = activeScanStep === idx && scanProgress < 100;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : isCurrent
                        ? "bg-violet-500/15 text-violet-200 border border-violet-500/30 shadow-sm"
                        : "text-slate-500 bg-white/[0.02]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                    ) : isCurrent ? (
                      <RotateCw size={15} className="shrink-0 animate-spin text-violet-400" />
                    ) : (
                      <div className="size-2 rounded-full bg-slate-600 mx-1" />
                    )}
                    <span className="font-medium">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ─── PHASE 2: Simulation Results & Visual Similarity Radar ─── */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 size={13} /> Idea Published
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300">
                    <Radar size={13} /> Demo Database Simulation
                  </span>
                </div>
                <h2 className="font-heading mt-2 text-xl font-bold text-white sm:text-2xl">
                  Similarity & Novelty Simulation Report
                </h2>
              </div>
            </div>

            {/* Novelty Score & Market Saturation Gauge */}
            {result && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-indigo-950/30 p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Novelty Score</span>
                  <div className="relative my-2 flex items-baseline">
                    <span className="font-heading text-4xl font-extrabold text-white">
                      {result.noveltyScore}
                    </span>
                    <span className="text-lg font-bold text-violet-400">%</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-violet-300">
                    <Sparkles size={11} /> {result.noveltyScore >= 80 ? "Highly Novel" : "Differentiated"}
                  </span>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                    <TrendingUp size={14} className="text-indigo-400" />
                    <span>Market Saturation</span>
                  </div>
                  <p className="text-base font-bold text-white">{result.marketSaturation}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    {result.strategicOpportunity}
                  </p>
                </div>
              </div>
            )}

            {/* Top Similar Ideas from Demo Database */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Layers size={16} className="text-violet-400" />
                  Top Benchmark Matches ({result?.topMatches.length} Similar Ideas Found)
                </h3>
                <span className="text-xs text-slate-400">Queried {result?.scannedCount} demo benchmark ideas</span>
              </div>

              <div className="space-y-3">
                {result?.topMatches.map((match) => (
                  <div
                    key={match.idea.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-4 transition duration-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{match.idea.categoryIcon}</span>
                        <h4 className="font-semibold text-sm text-white">{match.idea.title}</h4>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          {match.idea.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-400">
                            {match.similarityScore}% Similarity
                          </span>
                        </div>
                        <div className="h-2 w-16 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              match.similarityScore >= 75
                                ? "bg-amber-400"
                                : match.similarityScore >= 50
                                ? "bg-indigo-400"
                                : "bg-emerald-400"
                            }`}
                            style={{ width: `${match.similarityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                      <span className="text-slate-400 font-medium">Concept:</span> {match.idea.solution}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-slate-400">Overlap:</span>
                      {match.overlapReasons.map((r) => (
                        <span key={r} className="rounded-md bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-violet-300 font-medium">
                          {r}
                        </span>
                      ))}
                      <span className="text-slate-400 ml-auto hidden sm:inline">
                        <span className="text-emerald-400 font-semibold">Your edge:</span> {match.differentiationAngle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Differentiators / Strategic Advantage */}
            <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/20 to-purple-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
                <ShieldCheck size={16} className="text-indigo-400" />
                <span>What Gives Your Idea an Advantage</span>
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-300">
                {result?.uniqueStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
              >
                <Lightbulb size={16} /> Submit Another Idea
              </button>
              
              <Link
                to={`/idea/${createdIdeaId}`}
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 transition"
              >
                View Your Published Idea <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
