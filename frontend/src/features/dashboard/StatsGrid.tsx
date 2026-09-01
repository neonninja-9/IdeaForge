import { Coins, Lightbulb, TrendingUp, MessageCircle } from "lucide-react";
import { MagicBentoContainer, ParticleCard } from "../../components/MagicBento";

interface StatsGridProps {
  stats: { ideasCount: number; totalVotes: number; totalComments: number; forgeCoins?: number };
  totalEngagement: number;
}

const statItems = [
  { key: "ideasCount", label: "Ideas", detail: "Captured concepts", icon: Lightbulb, tint: "bg-[#FEF3C7] text-[#A16207] dark:bg-[#A16207]/10 dark:text-[#CA8A04]" },
  { key: "totalVotes", label: "Votes", detail: "Community signals", icon: TrendingUp, tint: "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300" },
  { key: "totalComments", label: "Comments", detail: "Conversations", icon: MessageCircle, tint: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" },
  { key: "forgeCoins", label: "ForgeCoins", detail: "Available rewards", icon: Coins, tint: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" },
] as const;

export default function StatsGrid({ stats, totalEngagement }: StatsGridProps) {
  return (
    <section className="mt-4">
      <MagicBentoContainer
        enableSpotlight
        spotlightRadius={400}
        glowColor="132, 0, 255"
      >
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map(({ key, label, detail, icon: Icon, tint }) => (
            <ParticleCard
              key={label}
              className="card--border-glow min-w-0 rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-[#2F293A] dark:bg-[#120F17] dark:shadow-black/30"
              glowColor="132, 0, 255"
              particleCount={12}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`grid size-11 shrink-0 place-items-center rounded-lg ${tint}`}><Icon size={19} /></span>
                <span className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{stats[key] ?? 0}</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{detail}</p>
                </div>
                {key === "ideasCount" && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                    Active
                  </span>
                )}
                {(key === "totalVotes" || key === "totalComments") && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                    {totalEngagement > 0 ? `${Math.round(((stats[key] ?? 0) / Math.max(1, totalEngagement)) * 100)}%` : "0%"}
                  </span>
                )}
                {key === "forgeCoins" && (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                    Balance
                  </span>
                )}
              </div>
            </ParticleCard>
          ))}
        </div>
      </MagicBentoContainer>
    </section>
  );
}
