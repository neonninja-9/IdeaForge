import { Lightbulb, TrendingUp, MessageCircle } from "lucide-react";
import { ParticleCard, GlobalSpotlight } from "../../components/ui/magic-bento/magic-bento";

interface StatsGridProps {
  stats: { ideasCount: number; totalVotes: number; totalComments: number };
  gridRef: React.RefObject<HTMLElement | null>;
}

const statItems = [
  { key: "ideasCount", label: "Ideas in motion", detail: "Thoughts worth exploring", icon: Lightbulb, tint: "bg-indigo-50 text-indigo-600 dark:bg-[#1a1625] dark:text-indigo-400", offset: "" },
  { key: "totalVotes", label: "Community signals", detail: "Votes on your ideas", icon: TrendingUp, tint: "bg-violet-50 text-violet-600 dark:bg-[#1a1625] dark:text-violet-400", offset: "sm:translate-y-6" },
  { key: "totalComments", label: "Conversations", detail: "New perspectives shared", icon: MessageCircle, tint: "bg-emerald-50 text-emerald-600 dark:bg-[#1a1625] dark:text-emerald-400", offset: "sm:translate-y-12" },
] as const;

export default function StatsGrid({ stats, gridRef }: StatsGridProps) {
  return (
    <section className="mt-8 relative bento-section" ref={gridRef}>
      <GlobalSpotlight
        gridRef={gridRef}
        enabled={true}
        spotlightRadius={400}
        glowColor="132, 0, 255"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {statItems.map(({ key, label, detail, icon: Icon, tint, offset }) => (
          <ParticleCard
            key={label}
            className={`card card--border-glow rounded-[28px] border border-white/5 bg-[#120F17] p-8 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-2 ${offset}`}
            particleCount={6}
            glowColor="132, 0, 255"
            enableTilt={false}
            clickEffect
            enableMagnetism={false}
          >
            <div className="relative z-10 flex items-start justify-between">
              <span className={`grid size-10 place-items-center rounded-2xl ${tint}`}><Icon size={19} /></span>
              <span className="text-3xl font-bold tracking-tight text-white">{stats[key]}</span>
            </div>
            <p className="relative z-10 mt-5 text-sm font-semibold text-slate-200">{label}</p>
            <p className="relative z-10 mt-1 text-xs text-slate-500">{detail}</p>
          </ParticleCard>
        ))}
      </div>
    </section>
  );
}
