import { Link } from "react-router-dom";
import { Heart, MessageCircle, Send, Trash2, Vote } from "lucide-react";
import type { Idea } from "../../types/idea.types";
import { potentialScore } from "../../utils/formatters";

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

  return (
    <article className="group relative rounded-[32px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.1)] dark:shadow-none transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Delete confirmation overlay */}
      {deleteConfirmId === ideaId && (
        <div className="absolute inset-0 z-20 grid place-items-center rounded-[32px] bg-black/50 backdrop-blur-sm">
          <div className="rounded-2xl bg-white dark:bg-[#1a1625] p-6 shadow-xl text-center max-w-xs">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Delete this idea?</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This action cannot be undone. All votes and comments will also be removed.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => onDeleteConfirm(null)} className="flex-1 min-h-11 sm:min-h-10 rounded-xl border border-slate-200 dark:border-white/10 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5">Cancel</button>
              <button onClick={() => onDelete(ideaId)} disabled={isDeleting} className="flex-1 min-h-11 sm:min-h-10 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">{idea.category?.name || "Uncategorized"}</span>
          {isDraft && <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-700 dark:text-amber-400 uppercase">Draft</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onDeleteConfirm(ideaId)} className="grid size-11 sm:size-10 place-items-center rounded-full text-slate-300 dark:text-slate-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500" aria-label={`Delete ${idea.title}`}><Trash2 size={16} /></button>
          <button className="grid size-11 sm:size-10 place-items-center rounded-full text-slate-300 dark:text-slate-500 transition hover:bg-vivid/10 hover:text-vivid" aria-label={`Favorite ${idea.title}`}><Heart size={18} /></button>
        </div>
      </div>
      <Link to={`/idea/${ideaId}`} className="mt-8 block"><h3 className="font-heading line-clamp-2 text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-vivid transition-colors">{idea.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{idea.problem}</p></Link>
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6"><div><p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Potential</p><p className="mt-1 text-lg font-bold text-slate-800 dark:text-white">{score}% <span className="font-normal text-slate-400">score</span></p></div><div className="flex items-center gap-4 text-sm text-slate-400"><span className="flex items-center gap-1.5"><Vote size={16} />{idea.voteCount}</span><span className="flex items-center gap-1.5"><MessageCircle size={16} />{idea.commentCount}</span></div></div>
      <div className="mt-6 flex gap-3">
        {isDraft ? (
          <>
            <Link to={`/edit-idea/${ideaId}`} className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10">Edit</Link>
            <button onClick={() => onPublish(ideaId)} disabled={isPublishing === ideaId} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 py-3.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-60"><Send size={14} /> {isPublishing === ideaId ? "Publishing..." : "Publish"}</button>
          </>
        ) : (
          <>
            <Link to={`/idea/${ideaId}`} className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10">View</Link>
            <button onClick={() => onDraftSimilar(idea.problem)} className="flex-1 rounded-2xl bg-vivid/5 dark:bg-vivid/10 py-3.5 text-sm font-semibold text-vivid dark:text-vivid-light transition hover:bg-vivid/10 dark:hover:bg-vivid/20">Draft similar</button>
          </>
        )}
      </div>
    </article>
  );
}
