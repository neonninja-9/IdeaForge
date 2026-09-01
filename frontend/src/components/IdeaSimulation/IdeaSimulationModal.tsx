import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Lightbulb,
  Radar,
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
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset simulation state
    setIsScanning(true);

    const simulation = runIdeaSimilaritySimulation(ideaData);
    setResult(simulation);

    // Progress stepper animation
    const progressInterval = setInterval(() => {
      setIsScanning(false);
      clearInterval(progressInterval);
    }, 2400); // Wait 2.4s for minimal animation

    return () => clearInterval(progressInterval);
  }, [isOpen, ideaData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-[#1C1917]/80 backdrop-blur-md transition-opacity">
      <div className="animate-reveal-up sm:animate-reveal-scale relative w-full max-w-3xl rounded-t-[32px] sm:rounded-[32px] border-t sm:border border-[#CA8A04]/20 bg-[#1C1917] text-white shadow-[0_-10px_40px_rgba(250,82,15,0.15)] sm:shadow-2xl sm:shadow-purple-950/40 p-6 sm:p-8 sm:my-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-[#A16207]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-96 rounded-full bg-[#A16207]/15 blur-3xl" />

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
          /* ─── PHASE 1: Minimal Scanning Animation ─── */
          <div className="py-20 flex flex-col items-center justify-center">
            {/* Animated Radar Pulse Icon Only */}
            <div className="relative">
              <div className="grid size-28 place-items-center rounded-full bg-gradient-to-tr from-[#A16207]/10 to-[#854D0E]/10 border border-[#CA8A04]/20 text-[#CA8A04] shadow-2xl shadow-[#A16207]/20">
                <Radar size={48} className="animate-spin text-[#CA8A04]" style={{ animationDuration: "2s" }} />
              </div>
              <span className="absolute inset-0 rounded-full border-2 border-[#CA8A04]/30 animate-ping" style={{ animationDuration: "1.5s" }} />
              <span className="absolute inset-[-15px] rounded-full border border-[#CA8A04]/10 animate-pulse" style={{ animationDuration: "2s" }} />
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A16207]/15 border border-[#CA8A04]/30 px-3 py-1 text-xs font-semibold text-[#EAB308]">
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
                <div className="sm:col-span-1 rounded-2xl border border-[#CA8A04]/30 bg-gradient-to-br from-[#292524]/40 to-[#292524]/30 p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#CA8A04]">Novelty Score</span>
                  <div className="relative my-2 flex items-baseline">
                    <span className="font-heading text-4xl font-extrabold text-white">
                      {result.noveltyScore}
                    </span>
                    <span className="text-lg font-bold text-[#CA8A04]">%</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#A16207]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#EAB308]">
                    <Sparkles size={11} /> {result.noveltyScore >= 80 ? "Highly Novel" : "Differentiated"}
                  </span>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                    <TrendingUp size={14} className="text-[#A16207]" />
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
                  <Layers size={16} className="text-[#CA8A04]" />
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
                                ? "bg-[#A16207]"
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
                        <span key={r} className="rounded-md bg-[#A16207]/10 border border-[#CA8A04]/20 px-2 py-0.5 text-[#EAB308] font-medium">
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
            <div className="rounded-2xl border border-[#A16207]/20 bg-gradient-to-r from-[#292524]/20 to-[#292524]/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ffd06a] mb-2">
                <ShieldCheck size={16} className="text-[#A16207]" />
                <span>What Gives Your Idea an Advantage</span>
              </div>
              <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-300">
                {result?.uniqueStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-[#A16207] mt-1.5 shrink-0" />
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
                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A16207] to-[#854D0E] px-6 text-sm font-semibold text-white shadow-lg shadow-[#A16207]/20 hover:from-[#CA8A04] hover:to-[#EAB308] transition"
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
