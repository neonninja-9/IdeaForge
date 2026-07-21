import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ChevronRight,
  Clock3,
  FileUp,
  Heart,
  Lightbulb,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  Vote,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import type { Idea } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton";

const inspirations = [
  { title: "Technology", prompt: "What everyday task could AI make simpler?", tone: "from-indigo-500 to-violet-500", icon: "✦" },
  { title: "Healthcare", prompt: "How could care feel more personal?", tone: "from-emerald-500 to-teal-500", icon: "✚" },
  { title: "Education", prompt: "What would make learning more accessible?", tone: "from-amber-400 to-orange-500", icon: "⌁" },
  { title: "Environment", prompt: "What small habit could create a bigger impact?", tone: "from-sky-500 to-cyan-500", icon: "◌" },
  { title: "Finance", prompt: "How can money decisions become less stressful?", tone: "from-fuchsia-500 to-purple-500", icon: "↗" },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function potentialScore(idea: Idea) {
  return Math.min(98, Math.max(58, 62 + idea.voteCount * 4 + idea.commentCount * 2));
}

function relativeDate(date: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ideasCount: 0, totalVotes: 0, totalComments: 0 });
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [capture, setCapture] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    ideaService.getDashboard()
      .then((res) => {
        setStats(res.data.stats);
        setIdeas(res.data.ideas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const activity = useMemo(() => ideas.slice(0, 4).map((idea, index) => ({
    title: index === 0 ? "Idea created" : index === 1 ? "Idea gaining momentum" : "Idea added to your workspace",
    detail: idea.title,
    date: relativeDate(idea.createdAt),
    color: index === 0 ? "bg-indigo-500" : index === 1 ? "bg-violet-500" : "bg-emerald-500",
  })), [ideas]);

  function openCapture(prompt = capture) {
    const trimmed = prompt.trim();
    navigate(trimmed ? `/submit?prompt=${encodeURIComponent(trimmed)}` : "/submit");
  }

  if (authLoading || loading) return <div className="min-h-[calc(100vh-76px)] bg-[#fafaf8]"><PageSkeleton variant="dashboard" /></div>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#fafaf8]">
      <main className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 xl:px-12">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-9 text-white shadow-[0_24px_60px_-28px_rgba(79,70,229,0.65)] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-100"><span className="size-2 rounded-full bg-emerald-300" /> Your creative workspace is ready</p>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{greeting()}, {user?.username}.</h1>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-indigo-100 sm:text-xl">Every breakthrough starts as a small thought.</p>

            <div className="mt-8 rounded-[22px] border border-white/20 bg-white p-3 shadow-2xl shadow-indigo-950/15 sm:p-4">
              <textarea value={capture} onChange={(event) => setCapture(event.target.value)} rows={3} placeholder="What's on your mind today?" className="min-h-24 w-full resize-none bg-transparent px-2 py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-lg" aria-label="Capture an idea" />
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1">
                  <button type="button" className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Record voice note"><Mic size={18} /></button>
                  <button type="button" className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Add camera image"><Camera size={18} /></button>
                  <button type="button" className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600" aria-label="Attach a file"><FileUp size={18} /></button>
                  <span className="ml-1 hidden text-xs text-slate-400 sm:inline">A thought is all you need to start.</span>
                </div>
                <button type="button" onClick={() => openCapture()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  <Sparkles size={17} /> Expand with AI <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Ideas in motion", value: stats.ideasCount, detail: "Thoughts worth exploring", icon: Lightbulb, tint: "bg-indigo-50 text-indigo-600" },
            { label: "Community signals", value: stats.totalVotes, detail: "Votes on your ideas", icon: TrendingUp, tint: "bg-violet-50 text-violet-600" },
            { label: "Conversations", value: stats.totalComments, detail: "New perspectives shared", icon: MessageCircle, tint: "bg-emerald-50 text-emerald-600" },
          ].map(({ label, value, detail, icon: Icon, tint }) => (
            <div key={label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.35)]">
              <div className="flex items-start justify-between"><span className={`grid size-10 place-items-center rounded-2xl ${tint}`}><Icon size={19} /></span><span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span></div>
              <p className="mt-5 text-sm font-semibold text-slate-800">{label}</p><p className="mt-1 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </section>

        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section>
            <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-indigo-600">YOUR INCUBATOR</p><h2 className="font-heading mt-1 text-2xl font-bold tracking-tight text-slate-900">Ideas taking shape</h2></div><Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all <ChevronRight size={16} /></Link></div>
            {ideas.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-indigo-200 bg-gradient-to-br from-white to-indigo-50/50 px-6 py-14 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600"><Lightbulb size={25} /></span><h3 className="font-heading mt-5 text-xl font-bold text-slate-900">Your next big idea starts here.</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Capture a rough thought and let AI help you find its potential.</p><button onClick={() => openCapture()} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"><Plus size={17} /> Capture first idea</button></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ideas.slice(0, 4).map((idea) => {
                  const score = potentialScore(idea);
                  return <article key={idea.id || idea._id} className="group rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/60">
                    <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{idea.category?.name || "Uncategorized"}</span><button className="grid size-8 place-items-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500" aria-label={`Favorite ${idea.title}`}><Heart size={17} /></button></div>
                    <Link to={`/idea/${idea.id || idea._id}`} className="mt-5 block"><h3 className="font-heading line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-indigo-600">{idea.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{idea.problem}</p></Link>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-[11px] font-medium text-slate-400">POTENTIAL</p><p className="mt-0.5 text-sm font-bold text-slate-800">{score}% <span className="font-normal text-slate-400">score</span></p></div><div className="flex items-center gap-3 text-xs text-slate-400"><span className="flex items-center gap-1"><Vote size={14} />{idea.voteCount}</span><span className="flex items-center gap-1"><MessageCircle size={14} />{idea.commentCount}</span></div></div>
                    <div className="mt-4 flex gap-2"><Link to={`/idea/${idea.id || idea._id}`} className="flex-1 rounded-xl bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100">Continue</Link><button onClick={() => openCapture(idea.problem)} className="flex-1 rounded-xl bg-indigo-50 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100">Expand</button></div>
                  </article>;
                })}
              </div>
            )}
          </section>

          <aside className="space-y-8">
            <section><div className="mb-5"><p className="text-sm font-semibold text-violet-600">SPARK SOMETHING NEW</p><h2 className="font-heading mt-1 text-xl font-bold text-slate-900">Need inspiration?</h2></div><div className="flex gap-3 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible">
              {inspirations.map((inspiration) => <button key={inspiration.title} onClick={() => openCapture(inspiration.prompt)} className="group min-w-44 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md xl:min-w-0"><span className={`grid size-9 place-items-center rounded-xl bg-gradient-to-br ${inspiration.tone} text-lg text-white`}>{inspiration.icon}</span><p className="mt-4 text-sm font-bold text-slate-800">{inspiration.title}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{inspiration.prompt}</p></button>)}
            </div></section>
            <section className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-indigo-600">RECENT ACTIVITY</p><h2 className="font-heading mt-1 text-lg font-bold text-slate-900">Your momentum</h2></div><Clock3 size={19} className="text-slate-300" /></div>{activity.length === 0 ? <p className="mt-6 text-sm leading-6 text-slate-400">Your creative journey will appear here as you capture and develop ideas.</p> : <ol className="mt-6 space-y-5">{activity.map((item, index) => <li key={item.detail} className="relative flex gap-3">{index < activity.length - 1 && <span className="absolute left-[7px] top-5 h-[calc(100%+8px)] w-px bg-slate-100" />}<span className={`mt-1 size-3 shrink-0 rounded-full ring-4 ring-white ${item.color}`} /><div><p className="text-sm font-semibold text-slate-700">{item.title}</p><p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{item.detail} · {item.date}</p></div></li>)}</ol>}</section>
          </aside>
        </div>
      </main>
    </div>
  );
}
