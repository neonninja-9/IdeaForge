import { Clock3 } from "lucide-react";

const inspirations = [
  { title: "Technology", prompt: "What everyday task could AI make simpler?", tone: "from-[#fa520f] to-[#fff8e0]0", icon: "✦" },
  { title: "Healthcare", prompt: "How could care feel more personal?", tone: "from-emerald-500 to-teal-500", icon: "✚" },
  { title: "Education", prompt: "What would make learning more accessible?", tone: "from-amber-400 to-orange-500", icon: "⌁" },
  { title: "Environment", prompt: "What small habit could create a bigger impact?", tone: "from-sky-500 to-cyan-500", icon: "◌" },
  { title: "Finance", prompt: "How can money decisions become less stressful?", tone: "from-fuchsia-500 to-purple-500", icon: "↗" },
];

interface InspirationPanelProps {
  activity: { title: string; detail: string; date: string; color: string }[];
  onSelectPrompt: (prompt: string) => void;
}

export default function InspirationPanel({ activity, onSelectPrompt }: InspirationPanelProps) {
  return (
    <aside className="space-y-12">
      <section><div className="mb-8"><p className="text-xs font-bold tracking-widest text-vivid uppercase">Spark something new</p><h2 className="font-heading mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Need inspiration?</h2></div><div className="flex gap-4 overflow-x-auto pb-4 xl:flex-col xl:overflow-visible">
        {inspirations.map((inspiration) => <button key={inspiration.title} onClick={() => onSelectPrompt(inspiration.prompt)} className="group min-w-[200px] rounded-[24px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 text-left shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-lg xl:min-w-0"><span className={`grid size-12 place-items-center rounded-[14px] bg-gradient-to-br ${inspiration.tone} text-2xl text-white`}>{inspiration.icon}</span><p className="font-heading mt-6 text-base font-bold text-slate-800 dark:text-slate-200">{inspiration.title}</p><p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{inspiration.prompt}</p></button>)}
      </div></section>
      <section className="rounded-[32px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-8 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-widest text-vivid uppercase">Recent Activity</p><h2 className="font-heading mt-3 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Your momentum</h2></div><Clock3 size={22} className="text-slate-300 dark:text-slate-600" /></div>{activity.length === 0 ? <p className="mt-8 text-sm leading-relaxed text-slate-400">Your creative journey will appear here as you capture and develop ideas.</p> : <ol className="mt-8 space-y-8">{activity.map((item, index) => <li key={item.detail} className="relative flex gap-4">{index < activity.length - 1 && <span className="absolute left-[9px] top-7 h-[calc(100%+12px)] w-px bg-slate-100 dark:bg-white/10" />}<span className={`mt-1.5 size-5 shrink-0 rounded-full ring-4 ring-white dark:ring-[#120F17] ${item.color}`} /><div><p className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</p><p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.detail} · {item.date}</p></div></li>)}</ol>}</section>
    </aside>
  );
}
