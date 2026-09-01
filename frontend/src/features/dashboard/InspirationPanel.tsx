import { Clock3, Sparkles, Plus, Zap, Circle, ArrowUpRight } from "lucide-react";

const inspirations = [
  { title: "Technology", prompt: "What everyday task could AI make simpler?", tone: "bg-[#fa520f]/10 text-[#fa520f] dark:bg-[#fa520f]/15 dark:text-[#ff8105]", icon: Sparkles },
  { title: "Healthcare", prompt: "How could care feel more personal?", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300", icon: Plus },
  { title: "Education", prompt: "What would make learning more accessible?", tone: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300", icon: Zap },
  { title: "Environment", prompt: "What small habit could create a bigger impact?", tone: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300", icon: Circle },
  { title: "Finance", prompt: "How can money decisions become less stressful?", tone: "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300", icon: ArrowUpRight },
];

interface InspirationPanelProps {
  activity: { title: string; detail: string; date: string; color: string }[];
  onSelectPrompt: (prompt: string) => void;
}

export default function InspirationPanel({ activity, onSelectPrompt }: InspirationPanelProps) {
  return (
    <aside className="min-w-0 space-y-6">
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-vivid">Spark something new</p>
          <h2 className="font-heading mt-2 text-2xl font-normal text-slate-950 dark:text-white">Need inspiration?</h2>
        </div>
        <div className="flex max-w-full gap-3 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible xl:pb-0">
          {inspirations.map((inspiration) => (
            <button
              key={inspiration.title}
              onClick={() => onSelectPrompt(inspiration.prompt)}
              className="group min-w-[220px] rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa520f] dark:border-white/[0.08] dark:bg-[#100d18]/90 dark:shadow-black/30 dark:hover:border-white/15 xl:min-w-0"
            >
              <span className={`flex size-11 items-center justify-center rounded-lg ${inspiration.tone}`}><inspiration.icon size={19} /></span>
              <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-200">{inspiration.title}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{inspiration.prompt}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 dark:border-white/[0.08] dark:bg-[#100d18]/90 dark:shadow-black/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-vivid">Recent activity</p>
            <h2 className="font-heading mt-2 text-2xl font-normal text-slate-950 dark:text-white">Your momentum</h2>
          </div>
          <span className="grid size-11 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
            <Clock3 size={20} />
          </span>
        </div>
        {activity.length === 0 ? (
          <p className="mt-6 text-sm leading-6 text-slate-500 dark:text-slate-400">Your creative journey will appear here as you capture and develop ideas.</p>
        ) : (
          <ol className="mt-6 space-y-5">
            {activity.map((item, index) => (
              <li key={item.detail} className="relative flex gap-3">
                {index < activity.length - 1 && <span className="absolute left-[7px] top-6 h-[calc(100%+8px)] w-px bg-slate-100 dark:bg-white/10" />}
                <span className={`mt-1.5 size-4 shrink-0 rounded-full ring-4 ring-white dark:ring-[#100d18] ${item.color}`} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{item.detail} · {item.date}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
}
