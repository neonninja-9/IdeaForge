import { useEffect, useMemo, useState, useRef } from "react";
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
  Plus,
  Send,
  Trash2,
  TrendingUp,
  Vote,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import type { Idea } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";
import { ParticleCard, GlobalSpotlight } from "../components/ui/magic-bento/magic-bento";

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const gridRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

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

  async function handleDeleteIdea(ideaId: string) {
    setIsDeleting(true);
    try {
      await ideaService.deleteIdea(ideaId);
      setIdeas((current) => current.filter((idea) => (idea.id || idea._id) !== ideaId));
      setStats((prev) => ({ ...prev, ideasCount: Math.max(0, prev.ideasCount - 1) }));
    } catch (err) {
      console.error("Failed to delete idea", err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  }

  async function handlePublishIdea(ideaId: string) {
    setIsPublishing(ideaId);
    try {
      await ideaService.updateIdea(ideaId, { status: "published" });
      setIdeas((current) => current.map((idea) => (idea.id || idea._id) === ideaId ? { ...idea, status: "published" } : idea));
    } catch (err) {
      console.error("Failed to publish idea", err);
    } finally {
      setIsPublishing(null);
    }
  }

  if (authLoading || loading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)]"><PageSkeleton variant="dashboard" /></div>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500">
      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 sm:px-12 sm:py-12 xl:px-16">
        <style>{`
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius, 400px) circle at var(--glow-x, 50%) var(--glow-y, 50%),
                rgba(132, 0, 255, calc(var(--glow-intensity, 0) * 0.8)) 0%,
                rgba(132, 0, 255, calc(var(--glow-intensity, 0) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 1;
          }
        `}</style>
        <section className="relative overflow-hidden rounded-[28px] bento-section" ref={heroRef}>
          <GlobalSpotlight gridRef={heroRef} enabled={true} spotlightRadius={400} glowColor="132, 0, 255" />
          <ParticleCard
            className="card card--border-glow rounded-[32px] px-8 py-10 text-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] sm:px-12 sm:py-14"
            style={{
              backgroundColor: "#120F17",
              borderRadius: "28px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            particleCount={12}
            glowColor="132, 0, 255"
            enableTilt={false}
            clickEffect
            enableMagnetism={false}
          >
            <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-widest text-slate-300 uppercase" style={{ fontFamily: "var(--f-izmir)" }}><span className="size-2 rounded-full bg-vivid animate-pulse" /> Your creative workspace</p>
              <h1 className="text-3xl font-normal leading-[1.1] tracking-tight sm:text-4xl md:text-5xl uppercase" style={{ fontFamily: "var(--f-regular)" }}>{greeting()},<br /><span className="italic text-slate-400" style={{ fontFamily: "var(--f-edit-italic)", textTransform: "none" }}>{user?.username}.</span></h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl font-light" style={{ fontFamily: "var(--f-edit-regular)" }}>Every breakthrough starts as a raw thought. Capture and shape it for the community.</p>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-[#1a1625] p-3 shadow-2xl shadow-black/30 sm:p-4">
                <textarea value={capture} onChange={(event) => setCapture(event.target.value)} rows={2} placeholder="What's on your mind today? Jot down any raw thought..." className="min-h-16 w-full resize-none !border-none bg-transparent px-2 py-2 text-base text-slate-200 !outline-none focus:!outline-none focus-visible:!outline-none focus:!border-transparent focus:!ring-0 focus:!shadow-none !shadow-none placeholder:text-slate-500 sm:text-lg" aria-label="Capture an idea" style={{ outline: 'none', boxShadow: 'none', borderColor: 'transparent' }} />
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Record voice note — coming soon"><Mic size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
                    <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Add camera image — coming soon"><Camera size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
                    <span className="group relative"><button type="button" disabled className="grid size-10 cursor-not-allowed place-items-center rounded-xl text-slate-600" aria-label="Attach a file — coming soon"><FileUp size={18} /></button><span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">Coming soon</span></span>
                    <span className="ml-1 hidden text-xs text-slate-500 sm:inline">A raw thought is all you need to start.</span>
                  </div>
                  <button type="button" onClick={() => openCapture()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:-translate-y-0.5 hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
                    <Plus size={17} /> Capture Idea <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </ParticleCard>
        </section>

        <section className="mt-8 relative bento-section" ref={gridRef}>
          <GlobalSpotlight
            gridRef={gridRef}
            enabled={true}
            spotlightRadius={400}
            glowColor="132, 0, 255"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Ideas in motion", value: stats.ideasCount, detail: "Thoughts worth exploring", icon: Lightbulb, tint: "bg-indigo-50 text-indigo-600 dark:bg-[#1a1625] dark:text-indigo-400" },
              { label: "Community signals", value: stats.totalVotes, detail: "Votes on your ideas", icon: TrendingUp, tint: "bg-violet-50 text-violet-600 dark:bg-[#1a1625] dark:text-violet-400" },
              { label: "Conversations", value: stats.totalComments, detail: "New perspectives shared", icon: MessageCircle, tint: "bg-emerald-50 text-emerald-600 dark:bg-[#1a1625] dark:text-emerald-400" },
            ].map(({ label, value, detail, icon: Icon, tint }) => (
              <ParticleCard
                key={label}
                className={`card card--border-glow rounded-[28px] border border-white/5 bg-[#120F17] p-8 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-2 ${label === "Community signals" ? "sm:translate-y-6" : label === "Conversations" ? "sm:translate-y-12" : ""}`}
                particleCount={6}
                glowColor="132, 0, 255"
                enableTilt={false}
                clickEffect
                enableMagnetism={false}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <span className={`grid size-10 place-items-center rounded-2xl ${tint}`}><Icon size={19} /></span>
                  <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
                </div>
                <p className="relative z-10 mt-5 text-sm font-semibold text-slate-200">{label}</p>
                <p className="relative z-10 mt-1 text-xs text-slate-500">{detail}</p>
              </ParticleCard>
            ))}
          </div>
        </section>

        <div className="mt-16 md:mt-24 grid gap-12 xl:gap-20 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-vivid uppercase" style={{ fontFamily: "var(--f-izmir)" }}>Your Incubator</p><h2 className="mt-3 text-4xl font-normal tracking-tight text-slate-900 dark:text-white uppercase" style={{ fontFamily: "var(--f-regular)" }}>Ideas taking shape</h2></div><Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-vivid hover:text-vivid-hover transition-colors">View all <ChevronRight size={16} /></Link></div>
            {ideas.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-vivid/30 bg-gradient-to-br from-white to-vivid/5 px-8 py-20 text-center transition-colors dark:border-white/10 dark:from-[#120F17] dark:to-[#1a1625]"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-vivid/10 text-vivid dark:bg-vivid/20 dark:text-vivid-light"><Lightbulb size={28} /></span><h3 className="mt-8 text-3xl font-normal text-slate-900 dark:text-white" style={{ fontFamily: "var(--f-regular)" }}>Your next big idea starts here.</h3><p className="mx-auto mt-3 max-w-md text-lg font-light leading-relaxed text-slate-500" style={{ fontFamily: "var(--f-edit-regular)" }}>Capture a rough thought and let AI help you find its potential.</p><button onClick={() => openCapture()} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-vivid px-6 text-sm font-semibold text-white hover:bg-vivid-hover transition-colors"><Plus size={17} /> Capture first idea</button></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ideas.slice(0, 4).map((idea) => {
                  const score = potentialScore(idea);
                  const ideaId = idea.id || idea._id;
                  const isDraft = idea.status === "draft";
                  return <article key={ideaId} className="group relative rounded-[32px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-8 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.1)] dark:shadow-none transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    {/* Delete confirmation overlay */}
                    {deleteConfirmId === ideaId && (
                      <div className="absolute inset-0 z-20 grid place-items-center rounded-[32px] bg-black/50 backdrop-blur-sm">
                        <div className="rounded-2xl bg-white dark:bg-[#1a1625] p-6 shadow-xl text-center max-w-xs">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">Delete this idea?</p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This action cannot be undone. All votes and comments will also be removed.</p>
                          <div className="mt-4 flex gap-2">
                            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5">Cancel</button>
                            <button onClick={() => handleDeleteIdea(ideaId)} disabled={isDeleting} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete"}</button>
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
                        <button onClick={() => setDeleteConfirmId(ideaId)} className="grid size-10 place-items-center rounded-full text-slate-300 dark:text-slate-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500" aria-label={`Delete ${idea.title}`}><Trash2 size={16} /></button>
                        <button className="grid size-10 place-items-center rounded-full text-slate-300 dark:text-slate-500 transition hover:bg-vivid/10 hover:text-vivid" aria-label={`Favorite ${idea.title}`}><Heart size={18} /></button>
                      </div>
                    </div>
                    <Link to={`/idea/${ideaId}`} className="mt-8 block"><h3 className="line-clamp-2 text-2xl font-normal leading-tight text-slate-900 dark:text-white group-hover:text-vivid transition-colors uppercase" style={{ fontFamily: "var(--f-regular)" }}>{idea.title}</h3><p className="mt-4 line-clamp-2 text-lg font-light leading-relaxed text-slate-500 dark:text-slate-400" style={{ fontFamily: "var(--f-edit-regular)" }}>{idea.problem}</p></Link>
                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6"><div><p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase" style={{ fontFamily: "var(--f-izmir)" }}>Potential</p><p className="mt-1 text-lg font-bold text-slate-800 dark:text-white">{score}% <span className="font-normal text-slate-400">score</span></p></div><div className="flex items-center gap-4 text-sm text-slate-400"><span className="flex items-center gap-1.5"><Vote size={16} />{idea.voteCount}</span><span className="flex items-center gap-1.5"><MessageCircle size={16} />{idea.commentCount}</span></div></div>
                    <div className="mt-6 flex gap-3">
                      {isDraft ? (
                        <>
                          <Link to={`/edit-idea/${ideaId}`} className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10">Edit</Link>
                          <button onClick={() => handlePublishIdea(ideaId)} disabled={isPublishing === ideaId} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 py-3.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-60"><Send size={14} /> {isPublishing === ideaId ? "Publishing..." : "Publish"}</button>
                        </>
                      ) : (
                        <>
                          <Link to={`/idea/${ideaId}`} className="flex-1 rounded-2xl bg-slate-50 dark:bg-white/5 py-3.5 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10">View</Link>
                          <button onClick={() => openCapture(idea.problem)} className="flex-1 rounded-2xl bg-vivid/5 dark:bg-vivid/10 py-3.5 text-sm font-semibold text-vivid dark:text-vivid-light transition hover:bg-vivid/10 dark:hover:bg-vivid/20">Draft similar</button>
                        </>
                      )}
                    </div>
                  </article>;
                })}
              </div>
            )}
          </section>

          <aside className="space-y-12">
            <section><div className="mb-8"><p className="text-xs font-bold tracking-widest text-vivid uppercase" style={{ fontFamily: "var(--f-izmir)" }}>Spark something new</p><h2 className="mt-3 text-3xl font-normal text-slate-900 dark:text-white uppercase" style={{ fontFamily: "var(--f-regular)" }}>Need inspiration?</h2></div><div className="flex gap-4 overflow-x-auto pb-4 xl:flex-col xl:overflow-visible">
              {inspirations.map((inspiration) => <button key={inspiration.title} onClick={() => openCapture(inspiration.prompt)} className="group min-w-[200px] rounded-[24px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 text-left shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-lg xl:min-w-0"><span className={`grid size-12 place-items-center rounded-[14px] bg-gradient-to-br ${inspiration.tone} text-2xl text-white`}>{inspiration.icon}</span><p className="mt-6 text-lg font-normal text-slate-800 dark:text-slate-200 uppercase" style={{ fontFamily: "var(--f-regular)" }}>{inspiration.title}</p><p className="mt-2 line-clamp-2 text-base font-light leading-relaxed text-slate-500 dark:text-slate-400" style={{ fontFamily: "var(--f-edit-regular)" }}>{inspiration.prompt}</p></button>)}
            </div></section>
            <section className="rounded-[32px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-8 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-widest text-vivid uppercase" style={{ fontFamily: "var(--f-izmir)" }}>Recent Activity</p><h2 className="mt-3 text-2xl font-normal text-slate-900 dark:text-white uppercase" style={{ fontFamily: "var(--f-regular)" }}>Your momentum</h2></div><Clock3 size={22} className="text-slate-300 dark:text-slate-600" /></div>{activity.length === 0 ? <p className="mt-8 text-lg font-light leading-relaxed text-slate-400" style={{ fontFamily: "var(--f-edit-regular)" }}>Your creative journey will appear here as you capture and develop ideas.</p> : <ol className="mt-8 space-y-8">{activity.map((item, index) => <li key={item.detail} className="relative flex gap-4">{index < activity.length - 1 && <span className="absolute left-[9px] top-7 h-[calc(100%+12px)] w-px bg-slate-100 dark:bg-white/10" />}<span className={`mt-1.5 size-5 shrink-0 rounded-full ring-4 ring-white dark:ring-[#120F17] ${item.color}`} /><div><p className="text-lg font-normal text-slate-800 dark:text-slate-200 uppercase" style={{ fontFamily: "var(--f-regular)" }}>{item.title}</p><p className="mt-1 line-clamp-2 text-base font-light text-slate-400" style={{ fontFamily: "var(--f-edit-regular)" }}>{item.detail} · {item.date}</p></div></li>)}</ol>}</section>
          </aside>
        </div>
      </main>
    </div>
  );
}
