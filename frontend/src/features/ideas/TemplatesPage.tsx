import { ArrowRight, FileText, Lightbulb, Rocket, Users, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  { title: "Problem brief", description: "Frame a recurring friction, the people affected, and the outcome worth improving.", prompt: "I want to solve a recurring problem for ", icon: Lightbulb, tone: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { title: "MVP experiment", description: "Turn an early thought into a focused test with one audience and one measurable signal.", prompt: "Help me plan a small MVP experiment for ", icon: Rocket, tone: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { title: "Community project", description: "Organize an idea that benefits a group, with clear collaborators and next steps.", prompt: "I want to create a community project that helps ", icon: Users, tone: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <main className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">TEMPLATES</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">A clear starting point for every spark.</h1>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">Choose a structure, make it your own, and capture your raw idea for the community.</p>
        </header>

        <section className="mt-9 grid gap-5 md:grid-cols-3">
          {templates.map(({ title, description, prompt, icon: Icon, tone }) => (
            <article key={title} className="flex min-h-72 flex-col rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors">
              <span className={`grid size-11 place-items-center rounded-2xl ${tone}`}>
                <Icon size={21} />
              </span>
              <h2 className="font-heading mt-7 text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
              <Link to={`/submit?prompt=${encodeURIComponent(prompt)}`} className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                Use template <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </section>

        {/* AI Studio teaser - Coming Soon */}
        <section className="mt-8 flex flex-col gap-4 rounded-[28px] border border-violet-100 dark:border-violet-500/20 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 p-6 sm:flex-row sm:items-center sm:justify-between transition-colors">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-2xl bg-white dark:bg-[#120F17] text-violet-600 dark:text-violet-400 shadow-sm dark:shadow-none">
              <Bot size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-slate-900 dark:text-white">AI Studio Co-pilot</h2>
                <span className="rounded-full bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-400">Coming Soon</span>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Interactive AI brainstorm sessions for open-ended exploration are in development.</p>
            </div>
          </div>
          <Link to="/ai-studio" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-200 dark:bg-white/10 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 transition">
            Preview Studio
          </Link>
        </section>

        <section className="mt-6 rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
              <FileText size={18} />
            </span>
            <div>
              <h2 className="font-heading font-bold text-slate-900 dark:text-white">How templates work</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A template pre-fills your idea description to help structure raw thoughts; it never publishes an idea for you.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
