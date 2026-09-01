import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Lightbulb, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import walletService from "../../services/walletService";
import type { Idea } from "../../types/idea.types";
import { greeting, relativeDate } from "../../utils/formatters";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import QuickCapture from "./QuickCapture";
import StatsGrid from "./StatsGrid";
import IdeaCard from "./IdeaCard";
import InspirationPanel from "./InspirationPanel";
import { MagicBentoContainer, ParticleCard } from "../../components/MagicBento";
import RadialRevealButton from "../../components/RadialRevealButton";

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
    color: index === 0 ? "bg-[#A16207]" : index === 1 ? "bg-[#A16207]" : "bg-emerald-500",
  })), [ideas]);

  const dashboardSummary = useMemo(() => {
    const publishedCount = ideas.filter((idea) => idea.status === "published").length;
    const draftCount = ideas.filter((idea) => idea.status === "draft").length;
    const lastIdea = ideas[0];
    const totalEngagement = stats.totalVotes + stats.totalComments;

    return {
      publishedCount,
      draftCount,
      totalEngagement,
      latestLabel: lastIdea ? relativeDate(lastIdea.createdAt) : "No ideas yet",
      latestTitle: lastIdea?.title ?? "Start by capturing your first rough concept.",
    };
  }, [ideas, stats.totalComments, stats.totalVotes]);

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
    <div className="min-h-[calc(100vh-76px)] bg-[#fafafa] text-slate-950 transition-colors duration-500 dark:bg-transparent dark:text-white">
      <main className="mx-auto w-full max-w-[1360px] px-4 py-5 sm:px-8 sm:py-8 xl:px-12">
        <MagicBentoContainer enableSpotlight spotlightRadius={400} glowColor="132, 0, 255">
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ParticleCard 
              className="card--border-glow min-w-0 rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(0,0,0,0.15)] dark:border-[#2F293A] dark:bg-[#120F17] dark:shadow-black/30 sm:p-6 lg:p-8"
              particleCount={15}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              glowColor="132, 0, 255"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between relative z-10">
                <div className="max-w-2xl">
                  <h1 className="font-heading text-3xl font-normal leading-tight text-slate-950 dark:text-white sm:text-4xl">
                    {greeting()}, {user?.username}.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
                    Shape new ideas, review momentum, and keep drafts moving toward a publishable concept.
                  </p>
                </div>
                <RadialRevealButton
                  to="/submit"
                  padding="0 16px"
                  style={{ minHeight: '44px', fontWeight: 600, fontSize: '0.875rem' }}
                  className="shrink-0 shadow-sm shadow-vivid/20"
                  fill="transparent"
                  colors={{ textColor: "#A16207", hoverFill: "#A16207", hoverTextColor: "#ffffff" }}
                  border={{ borderWidth: 1, borderColor: "rgba(161, 98, 7, 0.3)" }}
                  rounded={20}
                >
                  <span className="flex items-center gap-2">
                    <Plus size={17} />
                    New idea
                  </span>
                </RadialRevealButton>
              </div>

              <div className="relative z-10 mt-6">
                <QuickCapture capture={capture} setCapture={setCapture} onManualEntry={() => openCapture()} />
              </div>
            </ParticleCard>

            <ParticleCard 
              className="card--border-glow grid min-w-0 gap-3 rounded-[20px] border border-slate-200 bg-[#FEF3C7] p-4 shadow-[0_8px_25px_rgba(0,0,0,0.15)] dark:border-[#2F293A] dark:bg-[#161126]/90 sm:grid-cols-3 lg:grid-cols-1"
              particleCount={8}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              glowColor="132, 0, 255"
            >
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Latest activity</p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-900 dark:text-white">{dashboardSummary.latestTitle}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dashboardSummary.latestLabel}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 relative z-10">
                <div className="rounded-lg border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{dashboardSummary.publishedCount}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Published</p>
                </div>
                <div className="rounded-lg border border-black/5 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{dashboardSummary.draftCount}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Drafts</p>
                </div>
              </div>
              <Link
                to="/explore"
                className="relative z-10 inline-flex min-h-11 items-center justify-between rounded-lg border border-black/5 bg-white/70 px-3 text-sm font-semibold text-slate-800 transition hover:border-vivid/30 hover:text-vivid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-vivid-light"
              >
                Browse community
                <ArrowUpRight size={16} />
              </Link>
            </ParticleCard>
          </section>
        </MagicBentoContainer>

        <StatsGrid stats={stats} totalEngagement={dashboardSummary.totalEngagement} />

        <div className="mt-8 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-vivid">Your incubator</p>
                <h2 className="font-heading mt-2 text-2xl font-normal tracking-tight text-slate-950 dark:text-white sm:text-3xl">Ideas taking shape</h2>
              </div>
              <Link to="/explore" className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-vivid transition hover:bg-vivid/10 hover:text-vivid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207]">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            {ideas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-vivid/30 bg-white px-6 py-14 text-center transition-colors dark:border-white/10 dark:bg-[#100d18]/90">
                <span className="mx-auto grid size-14 place-items-center rounded-lg bg-vivid/10 text-vivid dark:bg-vivid/20 dark:text-vivid-light"><Lightbulb size={26} /></span>
                <h3 className="font-heading mt-6 text-2xl font-normal text-slate-950 dark:text-white">Your next big idea starts here.</h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Capture a rough thought and let AI help you find its potential.</p>
                <button onClick={() => openCapture()} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-vivid px-5 text-sm font-semibold text-white transition hover:bg-vivid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A16207]"><Plus size={17} /> Capture first idea</button>
              </div>
            ) : (
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
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
