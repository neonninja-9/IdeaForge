import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, MessageCircle, Send, Trash2, Vote } from "lucide-react";
import type { Idea } from "../../types/idea.types";
import { potentialScore, relativeDate } from "../../utils/formatters";

interface IdeaCardProps {
  idea: Idea;
  deleteConfirmId: string | null;
  isDeleting: boolean;
  isPublishing: string | null;
  onDeleteConfirm: (id: string | null) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onDraftSimilar: (problem: string) => void;
}

export default function IdeaCard({
  idea,
  deleteConfirmId,
  isDeleting,
  isPublishing,
  onDeleteConfirm,
  onDelete,
  onPublish,
  onDraftSimilar,
}: IdeaCardProps) {
  const score = potentialScore(idea);
  const ideaId = idea.id || idea._id;
  const isDraft = idea.status === "draft";
  const statusClasses = isDraft
    ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
    : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/[0.08] dark:bg-[#100d18]/90 dark:shadow-black/30 dark:hover:border-white/15 sm:p-5">
      {deleteConfirmId === ideaId && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-w-xs rounded-lg bg-white p-5 text-center shadow-xl dark:bg-[#171323]">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Delete this idea?</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This action cannot be undone. All votes and comments will also be removed.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onDeleteConfirm(null)} className="min-h-11 flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5">Cancel</button>
              <button onClick={() => onDelete(ideaId)} disabled={isDeleting} className="min-h-11 flex-1 rounded-lg bg-rose-600 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">{idea.category?.name || "Uncategorized"}</span>
            <span className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusClasses}`}>{isDraft ? "Draft" : "Published"}</span>
          </div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{relativeDate(idea.updatedAt || idea.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onDeleteConfirm(ideaId)} className="grid size-11 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:text-slate-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400" aria-label={`Delete ${idea.title}`}><Trash2 size={16} /></button>
          <button className="grid size-11 place-items-center rounded-lg text-slate-400 transition hover:bg-vivid/10 hover:text-vivid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:text-slate-500 dark:hover:text-vivid-light" aria-label={`Favorite ${idea.title}`}><Heart size={18} /></button>
        </div>
      </div>
      <Link to={`/idea/${ideaId}`} className="mt-5 block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A16207]">
        <h3 className="font-heading line-clamp-2 text-xl font-normal leading-tight text-slate-950 transition-colors group-hover:text-vivid dark:text-white">{idea.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{idea.problem}</p>
      </Link>
      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Potential</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{score}%</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-white/[0.06]">
              <div className="h-full rounded-full bg-[#A16207]" style={{ width: `${score}%` }} />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Vote size={16} />{idea.voteCount}</span>
            <span className="flex items-center gap-1.5"><MessageCircle size={16} />{idea.commentCount}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex min-w-0 flex-wrap gap-2">
        {isDraft ? (
          <>
            <Link to={`/edit-idea/${ideaId}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">Edit</Link>
            <button onClick={() => onPublish(ideaId)} disabled={isPublishing === ideaId} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-60"><Send size={14} /> {isPublishing === ideaId ? "Publishing..." : "Publish"}</button>
          </>
        ) : (
          <>
            <Link to={`/idea/${ideaId}`} className="inline-flex min-h-11 min-w-[8rem] flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10">View <ArrowUpRight size={14} /></Link>
            <button onClick={() => onDraftSimilar(idea.problem)} className="min-h-11 min-w-[8rem] flex-1 rounded-lg bg-vivid/10 text-sm font-semibold text-vivid transition hover:bg-vivid/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:bg-vivid/15 dark:text-vivid-light dark:hover:bg-vivid/25">Draft similar</button>
          </>
        )}
      </div>
    </article>
  );
}
