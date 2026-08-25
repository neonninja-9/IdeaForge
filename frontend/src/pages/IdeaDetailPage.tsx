import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Check,
  CircleAlert,
  Download,
  Edit3,
  FileText,
  Heart,
  Lightbulb,
  MessageCircle,
  Paperclip,
  Send,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";
import { useAuth } from "../hooks/useAuth";
import commentService from "../services/commentService";
import favoriteService from "../services/favoriteService";
import ideaService from "../services/ideaService";
import voteService from "../services/voteService";
import type { Comment, Idea } from "../types/idea.types";

function date(dateString?: string) {
  if (!dateString) return "Recently";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));
}

function score(idea: Idea, delta = 0) {
  const base = ((idea.title.length * 3 + idea.problem.length + idea.solution.length) % 24) + 72;
  return Math.min(98, Math.max(65, base + delta));
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

  const validation = useMemo(() => idea ? [
    { label: "Market demand", value: score(idea, 4), color: "#6366f1" },
    { label: "Feasibility", value: score(idea, -8), color: "#8b5cf6" },
    { label: "Innovation", value: score(idea, 1), color: "#f59e0b" },
  ] : [], [idea]);

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
**Created**: ${date(idea.createdAt)}  

---

## 1. Problem Statement
${idea.problem || "N/A"}

## 2. Proposed Solution
${idea.solution || "N/A"}

${idea.impact ? `## 3. Anticipated Impact\n${idea.impact}\n` : ""}
${idea.suggestedTechStack ? `## 4. Suggested Foundation & Tech Stack\n${idea.suggestedTechStack}\n` : ""}

## 5. Focus Areas
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
  if (error || !idea) return <div className="min-h-screen bg-[var(--background)] dark:bg-transparent grid place-items-center px-5 transition-colors duration-500"><div className="text-center"><CircleAlert className="mx-auto text-rose-400" size={30} /><p className="mt-4 text-slate-600 dark:text-slate-400">{error || "Idea not found"}</p><Link to="/explore" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-400">Back to ideas</Link></div></div>;

  const overallScore = score(idea, 2);
  const roadmap = [
    { name: "Research", detail: "Validate the problem with 5 target users", done: true },
    { name: "Prototype", detail: "Sketch the smallest useful experience", done: false },
    { name: "MVP", detail: "Build and test the core value loop", done: false },
    { name: "Launch", detail: "Share with your first focused community", done: false },
  ];

  const authorId = idea.author?._id || (idea.author as any)?.id;
  const isAuthor = user && authorId && user.id === authorId;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500">
      <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 xl:px-12">

        {/* ── Toolbar ──────────────────────────────────────────── */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <Link to="/explore" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft size={18} /> All ideas
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {isAuthor && (
              <Link to={`/edit-idea/${id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Edit3 size={18} /> <span className="hidden sm:inline">Edit</span>
              </Link>
            )}
            <button onClick={handleExportMarkdown} title="Export Markdown Brief" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Download size={18} /> <span className="hidden sm:inline">Export Brief</span>
            </button>
            <button onClick={handleFavorite} className={`grid size-11 place-items-center rounded-xl transition ${isFavorite ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 hover:text-rose-500"}`} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <Heart size={18} className={isFavorite ? "fill-current" : ""} />
            </button>
            <button onClick={handleShare} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Share2 size={18} /> <span className="hidden sm:inline">{linkCopied ? "Link copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">

          {/* ── Main content column ────────────────────────────── */}
          <div className="space-y-6">

            {/* Hero header */}
            <header className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-[0_25px_65px_-35px_rgba(79,70,229,.75)] sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 font-semibold text-indigo-50">{idea.category?.name || "Uncategorized"}</span>
                  <span className="text-indigo-100">Created {date(idea.createdAt)}</span>
                </div>
                <h1 className="font-heading mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{idea.title}</h1>
                <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-white/15 text-sm font-bold">{idea.author?.username?.charAt(0).toUpperCase()}</span>
                    <div>
                      <p className="text-sm font-semibold">{idea.author?.username}</p>
                      <p className="text-xs text-indigo-100">Idea creator</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">{idea.difficulty} path</span>
                  {idea.status === "draft" && (
                    <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200 border border-amber-300/30">Draft</span>
                  )}
                </div>
              </div>
            </header>

            {/* Problem & Solution cards */}
            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[24px] border border-rose-100 dark:border-rose-500/20 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500">
                <span className="grid size-10 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400">
                  <CircleAlert size={20} />
                </span>
                <h2 className="font-heading mt-5 text-lg font-bold text-slate-900 dark:text-white">The opportunity</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.problem || "No problem statement recorded."}</p>
              </article>
              <article className="rounded-[24px] border border-emerald-100 dark:border-emerald-500/20 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500">
                <span className="grid size-10 place-items-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <Lightbulb size={20} />
                </span>
                <h2 className="font-heading mt-5 text-lg font-bold text-slate-900 dark:text-white">The first solution</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.solution || "No initial solution outline recorded."}</p>
              </article>
            </section>

            {/* Impact */}
            {idea.impact && (
              <section className="rounded-[24px] border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 dark:from-indigo-500/10 dark:to-violet-500/5 p-6 transition-colors duration-500">
                <div className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white dark:bg-[#120F17] text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none">
                    <Target size={20} />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">The impact to aim for</h2>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.impact}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Attachments & Mockups Gallery */}
            {idea.attachments && idea.attachments.length > 0 && (
              <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-8 transition-colors duration-500">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Paperclip size={20} />
                  </span>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Visuals & Artifacts</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{idea.attachments.length} attached {idea.attachments.length === 1 ? "file" : "files"}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {idea.attachments.map((att, index) => {
                    const isImg = att.type?.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg)$/i.test(att.url);
                    return (
                      <div key={index} className="group overflow-hidden rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-3 transition hover:border-indigo-200 dark:hover:border-indigo-500/30">
                        {isImg ? (
                          <div className="overflow-hidden rounded-xl bg-slate-900/5 dark:bg-black/20 aspect-video relative flex items-center justify-center">
                            <img
                              src={att.url}
                              alt={att.name}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white text-xs font-semibold"
                            >
                              View full image
                            </a>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3">
                            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              <FileText size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{att.name}</p>
                              <p className="text-[10px] text-slate-400">Document</p>
                            </div>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              download={att.name}
                              className="grid size-8 place-items-center rounded-lg bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 shadow-sm hover:text-indigo-600"
                            >
                              <Download size={14} />
                            </a>
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between px-1">
                          <span className="truncate text-xs text-slate-600 dark:text-slate-400">{att.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tech stack */}
            {idea.suggestedTechStack && (
              <section className="rounded-[24px] border border-violet-100 dark:border-violet-500/20 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500">
                <div className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">Suggested foundation</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{idea.suggestedTechStack}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Execution Roadmap */}
            <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-8 transition-colors duration-500">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">EXECUTION ROADMAP</p>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">AI Milestones · Soon</span>
                  </div>
                  <h2 className="font-heading mt-1 text-2xl font-bold text-slate-900 dark:text-white">From spark to first proof</h2>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bot size={20} />
                </span>
              </div>
              <ol className="mt-8 space-y-0">
                {roadmap.map((stage, index) => (
                  <li key={stage.name} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < roadmap.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-7px)] w-px bg-slate-100 dark:bg-white/10" />}
                    <span className={`z-10 grid size-8 shrink-0 place-items-center rounded-full ${stage.done ? "bg-emerald-500 text-white" : "border-2 border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-[#1a1625] text-indigo-500 dark:text-indigo-400"}`}>
                      {stage.done ? <Check size={16} /> : index + 1}
                    </span>
                    <div className="pt-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{stage.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stage.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Discussion */}
            <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-8 transition-colors duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">DISCUSSION</p>
                  <h2 className="font-heading mt-1 text-2xl font-bold text-slate-900 dark:text-white">Build this idea together</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <MessageCircle size={14} /> {comments.length}
                </span>
              </div>

              {/* Comment form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mt-7">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    rows={3}
                    placeholder="Offer a thought, challenge an assumption, or suggest a next move..."
                    className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-3 text-sm leading-6 text-slate-700 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10"
                  />
                  <div className="mt-3 flex justify-end">
                    <button type="submit" disabled={submittingComment || !commentText.trim()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
                      {submittingComment ? "Posting..." : "Add to discussion"}<Send size={15} />
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-6 rounded-2xl bg-slate-50 dark:bg-white/5 p-4 text-sm text-slate-500 dark:text-slate-400">
                  <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">Sign in</Link> to add your perspective.
                </p>
              )}

              {/* Comment list */}
              <div className="mt-7 space-y-4">
                {comments.length === 0 ? (
                  <p className="py-5 text-center text-sm text-slate-400 dark:text-slate-500">No conversation yet—your perspective could start it.</p>
                ) : comments.map((comment) => {
                  const commentAuthorId = comment.user?._id || (comment.user as any)?.id;
                  const isMyComment = user && commentAuthorId && user.id === commentAuthorId;

                  return (
                    <article key={comment.id || comment._id} className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4 transition-colors duration-500">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-xl bg-white dark:bg-[#120F17] text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm dark:shadow-none">
                          {comment.user?.username?.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{comment.user?.username}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{date(comment.createdAt)}</p>
                        </div>
                        {isMyComment && (
                          <button onClick={() => handleDeleteComment(comment.id || comment._id)} className="ml-auto text-xs font-medium text-rose-500 hover:text-rose-600">Delete</button>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{comment.text}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Sidebar ────────────────────────────────────────── */}
          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">

            {/* Opportunity signal */}
            <section className="overflow-hidden rounded-[28px] border border-indigo-100 dark:border-indigo-500/20 bg-white dark:bg-[#120F17] shadow-[0_18px_50px_-32px_rgba(79,70,229,.4)] dark:shadow-none transition-colors duration-500">
              <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-indigo-100">OPPORTUNITY SIGNAL</p>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-50">AI Analysis · Soon</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <h2 className="font-heading text-xl font-bold">Estimated score</h2>
                  <span className="text-3xl font-bold">{overallScore}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                  <span className="block h-full rounded-full bg-white" style={{ width: `${overallScore}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 p-5">
                {validation.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <div className="mx-auto grid size-[70px] place-items-center rounded-full" style={{ background: `conic-gradient(${metric.color} ${metric.value * 3.6}deg, var(--conic-bg, #eef2ff) 0deg)` }}>
                      <span className="grid size-[58px] place-items-center rounded-full bg-white dark:bg-[#120F17] text-sm font-bold text-slate-800 dark:text-white transition-colors duration-500">
                        {metric.value}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] font-semibold leading-4 text-slate-500 dark:text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 px-6 py-5">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">This idea has a promising core. Capture raw insights and share with community members to validate the opportunity.</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <Sparkles size={14} className="text-indigo-500" /> Deep AI validation notes coming soon
                </div>
              </div>
            </section>

            {/* Community momentum */}
            <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <TrendingUp size={19} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Community momentum</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Signals around this idea</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4">
                  <ArrowUp size={17} className="text-indigo-500 dark:text-indigo-400" />
                  <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{voteCount}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Upvotes</p>
                </div>
                <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4">
                  <Users size={17} className="text-violet-500 dark:text-violet-400" />
                  <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{comments.length}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Voices</p>
                </div>
              </div>
              <button onClick={handleVote} disabled={voting} className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${hasVoted ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-indigo-100 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"}`}>
                <ArrowUp size={17} />{voting ? "Updating..." : hasVoted ? "You support this" : "Support this idea"}
              </button>
            </section>

            {/* Focus areas */}
            <section className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Focus areas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {idea.tags?.length ? idea.tags.map((tag) => (
                  <span key={tag._id || tag.id} className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">{tag.name}</span>
                )) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500">No focus areas added yet.</span>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* CSS custom property for conic-gradient dark mode fallback */}
      <style>{`
        :root { --conic-bg: #eef2ff; }
        .dark { --conic-bg: #1a1625; }
      `}</style>
    </div>
  );
}
