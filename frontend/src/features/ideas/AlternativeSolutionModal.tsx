import { useState, type FormEvent } from "react";
import { X, Send, Rocket } from "lucide-react";
import solutionService from "../../services/solutionService";
import type { AlternativeSolution } from "../../types/idea.types";

interface Props {
  ideaId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (solution: AlternativeSolution) => void;
}

export default function AlternativeSolutionModal({ ideaId, isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const response = await solutionService.addSolution(ideaId, {
        title: title.trim(),
        description: description.trim(),
        techStack: techStack.trim(),
      });
      onSuccess(response.data.solution);
      setTitle("");
      setDescription("");
      setTechStack("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60 transition-opacity">
      <div className="w-full max-w-lg bg-white dark:bg-[#1A1625] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden animate-reveal-up flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Rocket size={18} className="text-[#fa520f]" />
            <h2 className="text-sm font-bold tracking-wide uppercase">Propose Approach</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-300 dark:hover:bg-white/10 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Title / Summary</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Use a Serverless architecture instead..."
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none transition focus:border-[#fa520f]/40 focus:ring-2 focus:ring-[#fa520f]/10"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Detailed Approach</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain how your solution works and why it's better..."
              rows={5}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-3 text-sm text-slate-700 dark:text-slate-300 outline-none transition focus:border-[#fa520f]/40 focus:ring-2 focus:ring-[#fa520f]/10 resize-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Suggested Tools / Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={e => setTechStack(e.target.value)}
              placeholder="e.g. React, Firebase, Tailwind..."
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none transition focus:border-[#fa520f]/40 focus:ring-2 focus:ring-[#fa520f]/10"
            />
          </div>
        </form>

        <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 transition">
            Cancel
          </button>
          <button type="submit" disabled={submitting} onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 bg-[#fa520f] hover:bg-[#cc3a05] text-white text-xs font-semibold rounded-xl transition disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit Proposal"} <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
