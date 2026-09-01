import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock,
  Download,
  Edit3,
  Heart,
  Lightbulb,
  MessageCircle,
  Paperclip,
  FileText,
  Send,
  Share2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import commentService from "../../services/commentService";
import favoriteService from "../../services/favoriteService";
import ideaService from "../../services/ideaService";
import voteService from "../../services/voteService";
import type { Comment, Idea } from "../../types/idea.types";
import AiLaunchpadSection from "../../components/AiLaunchpad/AiLaunchpadSection";
import AlternativeSolutionsSection from "./AlternativeSolutionsSection";

function formatDate(dateString?: string) {
  if (!dateString) return "Recently";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      ideaService.getIdeaById(id),
      commentService.getComments(id),
    ])
      .then(([ideaResponse, commentsResponse]) => {
        const item = ideaResponse.data.idea;
        setIdea(item);
        setHasVoted(item.hasVoted ?? false);
        setVoteCount(item.voteCount ?? 0);
        setComments(commentsResponse.data.comments || []);
      })
      .catch((err) => setError(err.message || "Failed to load idea"))
      .finally(() => setLoading(false));

    if (user) {
      favoriteService.getFavorites()
        .then((res) => {
          setIsFavorite(res.data.favorites.includes(id));
        })
        .catch(console.error);
    }
  }, [id, user]);

  async function handleVote() {
    if (!user) return navigate("/login");
    if (!id || voting) return;
    setVoting(true);
    try {
      const response = await voteService.toggleVote(id);
      setHasVoted(response.data.voted);
      setVoteCount(response.data.voteCount);
    } catch (voteError) {
      console.error(voteError);
    } finally {
      setVoting(false);
    }
  }

  async function handleCommentSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return navigate("/login");
    if (!id || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const response = await commentService.addComment(id, commentText.trim());
      setComments((current) => [...current, response.data.comment]);
      setCommentText("");
    } catch (commentError) {
      console.error(commentError);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await commentService.deleteComment(commentId);
      setComments((current) => current.filter((comment) => (comment.id || comment._id) !== commentId));
    } catch (deleteError) {
      console.error(deleteError);
    }
  }

  function handleFavorite() {
    if (!user) return navigate("/login");
    if (!id) return;
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    if (newIsFavorite) {
      favoriteService.addFavorite(id).catch(() => setIsFavorite(false));
    } else {
      favoriteService.removeFavorite(id).catch(() => setIsFavorite(true));
    }
  }

  async function handleShare() {
    const shareUrl = window.location.href;
    const shareData = { title: idea?.title || "Check out this idea", text: idea?.problem?.slice(0, 120) || "", url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch {
        /* ignore */
      }
    }
  }

  function handleExportMarkdown() {
    if (!idea) return;
    const md = `# ${idea.title}

**Author**: @${idea.author?.username || "Anonymous"}  
**Category**: ${idea.category?.name || "Uncategorized"}  
**Difficulty**: ${idea.difficulty}  
**Status**: ${idea.status || "published"}  
**Created**: ${formatDate(idea.createdAt)}  

---

## Problem
${idea.problem || "N/A"}

## Solution
${idea.solution || "N/A"}

${idea.impact ? `## Impact\n${idea.impact}\n` : ""}
${idea.techStack && idea.techStack.length > 0 ? `## Tech Stack\n${idea.techStack.join(", ")}\n` : idea.suggestedTechStack ? `## Suggested Tech Stack\n${idea.suggestedTechStack}\n` : ""}

## Tags
${idea.tags?.map((t) => `- ${t.name}`).join("\n") || "- None"}

---
*Exported from IdeaForge on ${new Date().toLocaleDateString()}*
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500"><PageSkeleton variant="detail" /></div>;
  if (error || !idea) return <div className="min-h-screen bg-[var(--background)] dark:bg-transparent grid place-items-center px-5 transition-colors duration-500"><div className="text-center"><CircleAlert className="mx-auto text-rose-400" size={30} /><p className="mt-4 text-slate-600 dark:text-slate-400">{error || "Idea not found"}</p><Link to="/explore" className="mt-4 inline-flex text-sm font-semibold text-[#fa520f]">Back to ideas</Link></div></div>;

  const hasRealRoadmap = idea.roadmap && idea.roadmap.length > 0;
  const roadmap = hasRealRoadmap
    ? idea.roadmap!.map((item, index) => ({
        name: item.phase,
        detail: item.tasks.join(" · "),
        done: index === 0,
      }))
    : [];

  const authorId = idea.author?._id || (idea.author as any)?.id;
  const isAuthor = user && authorId && user.id === authorId;
  const hasTechStack = idea.techStack?.length ? idea.techStack.length > 0 : !!idea.suggestedTechStack;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500">
      <main className="mx-auto max-w-[1120px] px-5 py-7 sm:px-8 sm:py-10">

        {/* ── Back nav ── */}
        <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300">
          <ArrowLeft size={16} /> All ideas
        </Link>

        {/* ── Header ── */}
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 font-semibold text-slate-600 dark:text-slate-300">{idea.category?.name || "Uncategorized"}</span>
            <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 font-semibold text-slate-500 dark:text-slate-400">{idea.difficulty}</span>
            {idea.estimatedTime && (
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 font-semibold text-slate-500 dark:text-slate-400">
                <Clock size={12} /> {idea.estimatedTime}
              </span>
            )}
            {idea.status === "draft" && (
              <span className="rounded-full border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 font-semibold text-amber-700 dark:text-amber-300">Draft</span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">{idea.title}</h1>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            {/* Author */}
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#fa520f] to-[#ff8105] text-xs font-bold text-white">
                {idea.author?.username?.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{idea.author?.username}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(idea.createdAt)}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {isAuthor && (
                <Link to={`/edit-idea/${id}`} className="grid size-9 place-items-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white" title="Edit">
                  <Edit3 size={16} />
                </Link>
              )}
              <button onClick={handleExportMarkdown} className="grid size-9 place-items-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white" title="Export Markdown">
                <Download size={16} />
              </button>
              <button onClick={handleFavorite} className={`grid size-9 place-items-center rounded-lg transition ${isFavorite ? "text-rose-500 bg-rose-50 dark:bg-rose-500/10" : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-rose-500"}`} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              </button>
              <button onClick={handleShare} className="grid size-9 place-items-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white" title="Share">
                <Share2 size={16} />
              </button>
              {linkCopied && <span className="text-xs font-medium text-emerald-500 ml-1">Copied!</span>}
            </div>
          </div>
        </header>

        <div className="mt-8 border-t border-slate-100 dark:border-white/5" />

        {/* ── Two-column layout ── */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* ── Main content ── */}
          <div className="space-y-8">

            {/* Problem & Solution */}
            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
                  <CircleAlert size={16} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Problem</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.problem || "No problem statement recorded."}</p>
              </section>
              <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
                  <Lightbulb size={16} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Solution</h2>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.solution || "No solution outline recorded."}</p>
              </section>
            </div>

            {/* Alternative Solutions */}
            <AlternativeSolutionsSection ideaId={id!} />

            {/* Impact (inline, no heavy card) */}
            {idea.impact && (
              <section className="flex gap-3">
                <span className="mt-0.5 text-[#fa520f]"><Target size={16} /></span>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#fa520f]">Impact</h2>
                  <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.impact}</p>
                </div>
              </section>
            )}

            {/* Tech stack (inline tags) */}
            {hasTechStack && (
              <section className="flex gap-3">
                <span className="mt-0.5 text-[#fa520f]"><Sparkles size={16} /></span>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#fa520f]">Tech Stack</h2>
                  {idea.techStack && idea.techStack.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {idea.techStack.map(tech => (
                        <span key={tech} className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">{tech}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{idea.suggestedTechStack}</p>
                  )}
                </div>
              </section>
            )}

            {/* Attachments */}
            {idea.attachments && idea.attachments.length > 0 && (
              <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Paperclip size={16} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Attachments</h2>
                  <span className="text-xs text-slate-400">{idea.attachments.length}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {idea.attachments.map((att, index) => {
                    const isImg = att.type?.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(att.url);
                    return (
                      <div key={index} className="group overflow-hidden rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-2 transition hover:border-slate-300 dark:hover:border-white/15">
                        {isImg ? (
                          <div className="overflow-hidden rounded-lg aspect-video relative flex items-center justify-center bg-slate-100 dark:bg-black/20">
                            <img src={att.url} alt={att.name} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <a href={att.url} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white text-xs font-semibold">View</a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-2">
                            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"><FileText size={16} /></div>
                            <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{att.name}</p>
                            <a href={att.url} target="_blank" rel="noreferrer" download={att.name} className="ml-auto grid size-7 place-items-center rounded-lg text-slate-400 hover:text-[#fa520f] hover:bg-slate-100 dark:hover:bg-white/5"><Download size={14} /></a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Roadmap (only with real AI data, collapsible) */}
            {hasRealRoadmap && (
              <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
                <button
                  onClick={() => setRoadmapOpen(!roadmapOpen)}
                  className="flex w-full items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#fa520f]"><Sparkles size={16} /></span>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">Execution Roadmap</h2>
                    <span className="rounded-full bg-[#fa520f]/10 px-2 py-0.5 text-[10px] font-semibold text-[#fa520f]">AI Generated</span>
                  </div>
                  {roadmapOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {roadmapOpen && (
                  <ol className="mt-5 space-y-0">
                    {roadmap.map((stage, index) => (
                      <li key={stage.name} className="relative flex gap-3 pb-5 last:pb-0">
                        {index < roadmap.length - 1 && <span className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-slate-100 dark:bg-white/10" />}
                        <span className={`z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${stage.done ? "bg-emerald-500 text-white" : "border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400"}`}>
                          {stage.done ? <Check size={14} /> : index + 1}
                        </span>
                        <div className="pt-0.5">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stage.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{stage.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            )}

            {/* Discussion */}
            <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <MessageCircle size={16} />
                  <h2 className="text-xs font-bold uppercase tracking-wider">Discussion</h2>
                </div>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
              </div>

              {/* Comment form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mt-5">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    rows={2}
                    placeholder="Share a thought or suggestion..."
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-700 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f]/40 focus:ring-2 focus:ring-[#fa520f]/10"
                  />
                  <div className="mt-2 flex justify-end">
                    <button type="submit" disabled={submittingComment || !commentText.trim()} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#fa520f] px-4 text-xs font-semibold text-white transition hover:bg-[#cc3a05] disabled:opacity-50">
                      {submittingComment ? "Posting..." : "Post"}<Send size={13} />
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  <Link to="/login" className="font-semibold text-[#fa520f]">Sign in</Link> to join the discussion.
                </p>
              )}

              {/* Comment list */}
              <div className="mt-5 space-y-3">
                {comments.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400 dark:text-slate-500">No comments yet — be the first to share your perspective.</p>
                ) : comments.map((comment) => {
                  const commentAuthorId = comment.user?._id || (comment.user as any)?.id;
                  const isMyComment = user && commentAuthorId && user.id === commentAuthorId;

                  return (
                    <article key={comment.id || comment._id} className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#fa520f] to-[#ff8105] text-[10px] font-bold text-white">
                          {comment.user?.username?.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{comment.user?.username}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatDate(comment.createdAt)}</p>
                        </div>
                        {isMyComment && (
                          <button onClick={() => handleDeleteComment(comment.id || comment._id)} className="text-[10px] font-medium text-rose-400 hover:text-rose-600">Delete</button>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{comment.text}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">

            {/* Vote + Stats card */}
            <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <ArrowUp size={16} className="mx-auto text-[#fa520f]" />
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{voteCount}</p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Upvotes</p>
                </div>
                <div className="text-center">
                  <Users size={16} className="mx-auto text-[#ff8105]" />
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{comments.length}</p>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Comments</p>
                </div>
              </div>
              <button
                onClick={handleVote}
                disabled={voting}
                className={`mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
                  hasVoted
                    ? "bg-[#fa520f] text-white hover:bg-[#cc3a05]"
                    : "border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[#fa520f] hover:bg-[#fa520f]/5 dark:hover:bg-[#fa520f]/10"
                }`}
              >
                <ArrowUp size={15} />
                {voting ? "Updating..." : hasVoted ? "Supported" : "Support this idea"}
              </button>
            </section>

            {/* Focus areas (tags) */}
            <section className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/[0.02] p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Focus areas</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {idea.tags?.length ? idea.tags.map((tag) => (
                  <span key={tag._id || tag.id} className="rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">{tag.name}</span>
                )) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">No focus areas added yet.</span>
                )}
              </div>
            </section>

            {/* AI Architecture & Code Launchpad */}
            <AiLaunchpadSection idea={idea} />
          </aside>
        </div>
      </main>
    </div>
  );
}
