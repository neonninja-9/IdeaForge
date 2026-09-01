import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Lightbulb, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import walletService from "../../services/walletService";
import type { Idea } from "../../types/idea.types";
import { greeting, relativeDate } from "../../utils/formatters";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import { ParticleCard, GlobalSpotlight } from "../../components/ui/magic-bento/magic-bento";
import QuickCapture from "./QuickCapture";
import StatsGrid from "./StatsGrid";
import IdeaCard from "./IdeaCard";
import InspirationPanel from "./InspirationPanel";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ ideasCount: 0, totalVotes: 0, totalComments: 0, forgeCoins: 0 });
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
    Promise.all([
      ideaService.getDashboard(),
      walletService.getWallet().catch(() => ({ data: { wallet: { balance: 0 } } })),
    ])
      .then(([dashRes, walletRes]) => {
        setStats({ ...dashRes.data.stats, forgeCoins: walletRes.data.wallet.balance });
        setIdeas(dashRes.data.ideas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const activity = useMemo(() => ideas.slice(0, 4).map((idea, index) => ({
    title: index === 0 ? "Idea created" : index === 1 ? "Idea gaining momentum" : "Idea added to your workspace",
    detail: idea.title,
    date: relativeDate(idea.createdAt),
    color: index === 0 ? "bg-[#fa520f]" : index === 1 ? "bg-[#fa520f]" : "bg-emerald-500",
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
            className="card card--border-glow rounded-[32px] px-5 py-8 bg-white border border-slate-200 dark:bg-[#120F17] dark:border-white/[0.06] shadow-[0_4px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] sm:px-12 sm:py-14"
            style={{
              borderRadius: "28px",
            }}
            particleCount={12}
            glowColor="132, 0, 255"
            enableTilt={false}
            clickEffect
            enableMagnetism={false}
          >
            <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full bg-[#fa520f]/5 dark:bg-[#fa520f]/10 blur-3xl" />
            <div className="relative max-w-3xl">
              <h1 className="font-heading text-2xl font-normal leading-[1.15] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">{greeting()},<br /><span className="text-slate-400 dark:text-slate-400 font-normal">{user?.username}.</span></h1>
              <div className="mt-6" />
              <QuickCapture capture={capture} setCapture={setCapture} onManualEntry={() => openCapture()} />
            </div>
          </ParticleCard>
        </section>

        <StatsGrid stats={stats} gridRef={gridRef} />

        <div className="mt-16 md:mt-24 grid gap-12 xl:gap-20 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-widest text-vivid uppercase">Your Incubator</p><h2 className="font-heading mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ideas taking shape</h2></div><Link to="/explore" className="inline-flex items-center gap-1 text-sm font-semibold text-vivid hover:text-vivid-hover transition-colors">View all <ChevronRight size={16} /></Link></div>
            {ideas.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-vivid/30 bg-gradient-to-br from-white to-vivid/5 px-8 py-20 text-center transition-colors dark:border-white/10 dark:from-[#120F17] dark:to-[#1a1625]"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-vivid/10 text-vivid dark:bg-vivid/20 dark:text-vivid-light"><Lightbulb size={28} /></span><h3 className="font-heading mt-8 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Your next big idea starts here.</h3><p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-500">Capture a rough thought and let AI help you find its potential.</p><button onClick={() => openCapture()} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-vivid px-6 text-sm font-semibold text-white hover:bg-vivid-hover transition-colors"><Plus size={17} /> Capture first idea</button></div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ideas.slice(0, 4).map((idea) => (
                  <IdeaCard
                    key={idea.id || idea._id}
                    idea={idea}
                    deleteConfirmId={deleteConfirmId}
                    isDeleting={isDeleting}
                    isPublishing={isPublishing}
                    onDeleteConfirm={setDeleteConfirmId}
                    onDelete={handleDeleteIdea}
                    onPublish={handlePublishIdea}
                    onDraftSimilar={openCapture}
                  />
                ))}
              </div>
            )}
          </section>

          <InspirationPanel activity={activity} onSelectPrompt={openCapture} />
        </div>
      </main>
    </div>
  );
}
