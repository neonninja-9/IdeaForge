import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUp, Bot, Check, ChevronRight, CircleAlert, Heart, Lightbulb, MessageCircle, Send, Share2, Sparkles, Target, TrendingUp, Users, Edit3 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import commentService from "../services/commentService";
import favoriteService from "../services/favoriteService";
import voteService from "../services/voteService";
import type { Comment, Idea } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";


function score(idea: Idea, adjustment = 0) { return Math.min(96, Math.max(58, 65 + idea.voteCount * 4 + idea.commentCount * 2 + adjustment)); }
function date(dateValue: string) { return new Date(dateValue).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }); }

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [voting, setVoting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        ideaService.getIdeaById(id),
        commentService.getComments(id),
        user ? favoriteService.getFavorites().catch(() => ({ data: { favorites: [] as string[] } })) : Promise.resolve({ data: { favorites: [] as string[] } })
      ])
      .then(([ideaResponse, commentsResponse, favResponse]) => {
        setIdea(ideaResponse.data.idea);
        const favIds = favResponse.data.favorites;
        setIsFavorite(favIds.includes(ideaResponse.data.idea.id || ideaResponse.data.idea._id));
        setHasVoted(ideaResponse.data.idea.hasVoted || false);
        setVoteCount(ideaResponse.data.idea.voteCount);
        setComments(commentsResponse.data.comments);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
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
    try { const response = await voteService.toggleVote(id); setHasVoted(response.data.voted); setVoteCount(response.data.voteCount); }
    catch (voteError) { console.error(voteError); }
    finally { setVoting(false); }
  }
  async function handleCommentSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return navigate("/login");
    if (!id || !commentText.trim()) return;
    setSubmittingComment(true);
    try { const response = await commentService.addComment(id, commentText.trim()); setComments((current) => [...current, response.data.comment]); setCommentText(""); }
    catch (commentError) { console.error(commentError); }
    finally { setSubmittingComment(false); }
  }
  async function handleDeleteComment(commentId: string) { try { await commentService.deleteComment(commentId); setComments((current) => current.filter((comment) => (comment.id || comment._id) !== commentId)); } catch (deleteError) { console.error(deleteError); } }
  function handleFavorite() {
    if (!id || !user) return;
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    if (newIsFavorite) {
      favoriteService.addFavorite(id).catch(() => setIsFavorite(false));
    } else {
      favoriteService.removeFavorite(id).catch(() => setIsFavorite(true));
    }
  }

  if (loading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--color-surface-idea)]"><PageSkeleton variant="detail" /></div>;
  if (error || !idea) return <div className="min-h-screen bg-[#fafaf8] grid place-items-center px-5"><div className="text-center"><CircleAlert className="mx-auto text-rose-400" size={30} /><p className="mt-4 text-slate-600">{error || "Idea not found"}</p><Link to="/explore" className="mt-4 inline-flex text-sm font-semibold text-indigo-600">Back to ideas</Link></div></div>;

  const overallScore = score(idea, 2);
  const roadmap = [
    { name: "Research", detail: "Validate the problem with 5 target users", done: true },
    { name: "Prototype", detail: "Sketch the smallest useful experience", done: false },
    { name: "MVP", detail: "Build and test the core value loop", done: false },
    { name: "Launch", detail: "Share with your first focused community", done: false },
  ];

  const isAuthor = user && idea.author && (user.id === (idea.author as any).id || user.id === (idea.author as any)._id);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--color-surface-idea)]">
      <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 xl:px-12">
        <div className="mb-7 flex items-center justify-between gap-4"><Link to="/explore" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft size={18} /> All ideas</Link><div className="flex items-center gap-2">{isAuthor && <Link to={`/edit-idea/${id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-indigo-600"><Edit3 size={18} /> <span className="hidden sm:inline">Edit</span></Link>}<button onClick={handleFavorite} className={`grid size-11 place-items-center rounded-xl transition ${isFavorite ? "bg-rose-50 text-rose-500" : "text-slate-500 hover:bg-white hover:text-rose-500"}`} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}><Heart size={18} className={isFavorite ? "fill-current" : ""} /></button><button className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-indigo-600"><Share2 size={18} /> <span className="hidden sm:inline">Share</span></button></div></div>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="space-y-8">
            <header className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-[0_25px_65px_-35px_rgba(79,70,229,.75)] sm:p-10"><div className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-white/10 blur-3xl" /><div className="relative"><div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded-full bg-white/15 px-3 py-1.5 font-semibold text-indigo-50">{idea.category?.name || "Uncategorized"}</span><span className="text-indigo-100">Created {date(idea.createdAt)}</span></div><h1 className="font-heading mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{idea.title}</h1><div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white/15 text-sm font-bold">{idea.author?.username?.charAt(0).toUpperCase()}</span><div><p className="text-sm font-semibold">{idea.author?.username}</p><p className="text-xs text-indigo-100">Idea creator</p></div></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-50">{idea.difficulty} path</span></div></div></header>

            <section className="grid gap-4 md:grid-cols-2"><article className="rounded-[24px] border border-rose-100 bg-white p-6 shadow-sm"><span className="grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500"><CircleAlert size={20} /></span><h2 className="font-heading mt-5 text-lg font-bold text-slate-900">The opportunity</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{idea.problem}</p></article><article className="rounded-[24px] border border-emerald-100 bg-white p-6 shadow-sm"><span className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-500"><Lightbulb size={20} /></span><h2 className="font-heading mt-5 text-lg font-bold text-slate-900">The first solution</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{idea.solution}</p></article></section>
            {idea.impact && <section className="rounded-[24px] border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/50 p-6"><div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm"><Target size={20} /></span><div><h2 className="font-heading text-lg font-bold text-slate-900">The impact to aim for</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{idea.impact}</p></div></div></section>}
            {idea.suggestedTechStack && <section className="rounded-[24px] border border-violet-100 bg-white p-6 shadow-sm"><div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Sparkles size={20} /></span><div><p className="text-xs font-bold uppercase tracking-wide text-violet-600">Suggested foundation</p><p className="mt-2 text-sm leading-7 text-slate-600">{idea.suggestedTechStack}</p></div></div></section>}

            <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-600">AI ROADMAP</p><h2 className="font-heading mt-1 text-2xl font-bold text-slate-900">From spark to first proof</h2></div><span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Bot size={20} /></span></div><ol className="mt-8 space-y-0">{roadmap.map((stage, index) => <li key={stage.name} className="relative flex gap-4 pb-7 last:pb-0">{index < roadmap.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-7px)] w-px bg-slate-100" />}<span className={`z-10 grid size-8 shrink-0 place-items-center rounded-full ${stage.done ? "bg-emerald-500 text-white" : "border-2 border-indigo-200 bg-white text-indigo-500"}`}>{stage.done ? <Check size={16} /> : index + 1}</span><div className="pt-1"><p className="text-sm font-bold text-slate-800">{stage.name}</p><p className="mt-1 text-sm text-slate-500">{stage.detail}</p></div></li>)}</ol><button className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-50 px-4 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100">Open full roadmap <ChevronRight size={16} /></button></section>

            <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-indigo-600">DISCUSSION</p><h2 className="font-heading mt-1 text-2xl font-bold text-slate-900">Build this idea together</h2></div><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"><MessageCircle size={14} /> {comments.length}</span></div>{user ? <form onSubmit={handleCommentSubmit} className="mt-7"><textarea value={commentText} onChange={(event) => setCommentText(event.target.value)} rows={3} placeholder="Offer a thought, challenge an assumption, or suggest a next move..." className="w-full resize-none rounded-2xl border border-slate-200 bg-[#fcfcfd] px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /><div className="mt-3 flex justify-end"><button type="submit" disabled={submittingComment || !commentText.trim()} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">{submittingComment ? "Posting..." : "Add to discussion"}<Send size={15} /></button></div></form> : <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500"><Link to="/login" className="font-semibold text-indigo-600">Sign in</Link> to add your perspective.</p>}<div className="mt-7 space-y-4">{comments.length === 0 ? <p className="py-5 text-center text-sm text-slate-400">No conversation yet—your perspective could start it.</p> : comments.map((comment) => <article key={comment.id || comment._id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-xl bg-white text-xs font-bold text-indigo-600 shadow-sm">{comment.user?.username?.charAt(0).toUpperCase()}</span><div><p className="text-sm font-semibold text-slate-700">{comment.user?.username}</p><p className="text-xs text-slate-400">{date(comment.createdAt)}</p></div>{user && comment.user?._id === user.id && <button onClick={() => handleDeleteComment(comment.id || comment._id)} className="ml-auto text-xs font-medium text-rose-500 hover:text-rose-600">Delete</button>}</div><p className="mt-3 text-sm leading-6 text-slate-600">{comment.text}</p></article>)}</div></section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit"><section className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-[0_18px_50px_-32px_rgba(79,70,229,.4)]"><div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white"><p className="text-xs font-semibold tracking-wide text-indigo-100">AI VALIDATION</p><div className="mt-3 flex items-end justify-between"><h2 className="font-heading text-xl font-bold">Opportunity signal</h2><span className="text-3xl font-bold">{overallScore}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-white" style={{ width: `${overallScore}%` }} /></div></div><div className="grid grid-cols-3 gap-2 p-5">{validation.map((metric) => <div key={metric.label} className="text-center"><div className="mx-auto grid size-[70px] place-items-center rounded-full" style={{ background: `conic-gradient(${metric.color} ${metric.value * 3.6}deg, #eef2ff 0deg)` }}><span className="grid size-[58px] place-items-center rounded-full bg-white text-sm font-bold text-slate-800">{metric.value}</span></div><p className="mt-2 text-[10px] font-semibold leading-4 text-slate-500">{metric.label}</p></div>)}</div><div className="border-t border-slate-100 px-6 py-5"><p className="text-sm leading-6 text-slate-600">This idea has a promising core. Test the problem with people in your first target group before investing in the full build.</p><button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">View validation notes <ChevronRight size={16} /></button></div></section>
            <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-amber-50 text-amber-600"><TrendingUp size={19} /></span><div><p className="text-sm font-semibold text-slate-800">Community momentum</p><p className="text-xs text-slate-400">Signals around this idea</p></div></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><ArrowUp size={17} className="text-indigo-500" /><p className="mt-3 text-2xl font-bold text-slate-900">{voteCount}</p><p className="text-xs text-slate-400">Upvotes</p></div><div className="rounded-2xl bg-slate-50 p-4"><Users size={17} className="text-violet-500" /><p className="mt-3 text-2xl font-bold text-slate-900">{comments.length}</p><p className="text-xs text-slate-400">Voices</p></div></div><button onClick={handleVote} disabled={voting} className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${hasVoted ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}><ArrowUp size={17} />{voting ? "Updating..." : hasVoted ? "You support this" : "Support this idea"}</button></section>
            <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Focus areas</p><div className="mt-4 flex flex-wrap gap-2">{idea.tags?.length ? idea.tags.map((tag) => <span key={tag._id || tag.id} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">{tag.name}</span>) : <span className="text-sm text-slate-400">No focus areas added yet.</span>}</div></section></aside>
        </div>
      </main>
    </div>
  );
}
