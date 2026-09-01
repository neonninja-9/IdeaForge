import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, ArrowUp } from "lucide-react";
import solutionService from "../../services/solutionService";
import type { AlternativeSolution } from "../../types/idea.types";
import AlternativeSolutionModal from "./AlternativeSolutionModal";
import { useAuth } from "../../hooks/useAuth";

function formatDate(dateString?: string) {
  if (!dateString) return "Recently";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));
}

interface Props {
  ideaId: string;
}

export default function AlternativeSolutionsSection({ ideaId }: Props) {
  const [solutions, setSolutions] = useState<AlternativeSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [votingOn, setVotingOn] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    solutionService.getSolutions(ideaId)
      .then(res => setSolutions(res.data.solutions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ideaId]);

  const handleProposeClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSolutionAdded = (newSolution: AlternativeSolution) => {
    setSolutions(current => [newSolution, ...current]);
  };

  const handleVote = async (solutionId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (votingOn) return;
    
    setVotingOn(solutionId);
    try {
      const res = await solutionService.toggleVote(solutionId);
      setSolutions(current => current.map(sol => {
        if (sol.id === solutionId || sol._id === solutionId) {
          const hasVoted = res.data.voted;
          const upvotedBy = [...sol.upvotedBy];
          if (hasVoted) {
            upvotedBy.push(user.id);
          } else {
            const index = upvotedBy.indexOf(user.id);
            if (index > -1) upvotedBy.splice(index, 1);
          }
          return { ...sol, upvotes: res.data.upvotes, upvotedBy };
        }
        return sol;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setVotingOn(null);
    }
  };

  if (loading) return null;

  return (
    <section className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Users size={18} className="text-violet-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Community Approaches</h2>
          <span className="ml-2 rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">{solutions.length}</span>
        </div>
        <button
          onClick={handleProposeClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition"
        >
          <Plus size={14} /> Propose
        </button>
      </div>

      <div className="space-y-4">
        {solutions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-12 px-6 text-center bg-slate-50/50 dark:bg-[#1C1917]/50 flex flex-col items-center justify-center">
            {/* Custom SVG Illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
              {/* Central node */}
              <circle cx="60" cy="60" r="16" fill="url(#brandGlow)" fillOpacity="0.15" />
              <circle cx="60" cy="60" r="8" fill="#A16207" />
              {/* Branching paths */}
              <path d="M60 44V24" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M60 76V96" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M44 60H24" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <path d="M76 60H96" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              
              <circle cx="60" cy="24" r="4" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
              <circle cx="60" cy="96" r="4" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
              <circle cx="24" cy="60" r="4" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
              <circle cx="96" cy="60" r="4" fill="currentColor" className="text-slate-300 dark:text-slate-600" />
              
              <defs>
                <radialGradient id="brandGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(16)">
                  <stop stopColor="#A16207" />
                  <stop offset="1" stopColor="#A16207" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">No Alternative Approaches Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
              Have a different way to build this? A different tech stack? Share your alternative solution and branch this idea in a new direction.
            </p>
            <button
              onClick={handleProposeClick}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#A16207] px-5 text-sm font-semibold text-white shadow-md shadow-[#A162071a] transition hover:-translate-y-0.5 hover:bg-[#854D0E]"
            >
              <Plus size={16} /> Propose First Alternative
            </button>
          </div>
        ) : (
          solutions.map(solution => {
            const hasVoted = user && solution.upvotedBy?.includes(user.id);
            const isVoting = votingOn === (solution.id || solution._id);

            return (
              <article key={solution.id || solution._id} className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5 transition hover:border-slate-200 dark:hover:border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{solution.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{solution.description}</p>
                    
                    {solution.techStack && (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stack:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {solution.techStack.split(",").map(tech => (
                            <span key={tech} className="rounded-full bg-slate-100 dark:bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">{tech.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white">
                          {solution.author?.username?.charAt(0).toUpperCase()}
                        </span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{solution.author?.username}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(solution.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVote(solution.id || solution._id)}
                    disabled={isVoting}
                    className={`shrink-0 inline-flex flex-col items-center justify-center gap-1 rounded-xl border min-w-16 h-14 transition ${
                      hasVoted
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    <ArrowUp size={16} />
                    <span className="text-xs font-bold leading-none">{solution.upvotes}</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <AlternativeSolutionModal
        ideaId={ideaId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSolutionAdded}
      />
    </section>
  );
}
