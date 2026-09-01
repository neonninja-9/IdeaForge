import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, CircleCheck, Download, FolderKanban, GripVertical, Plus, Sparkles, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import projectService from "../../services/projectService";

type CanvasBlock = {
  title: string;
  prompt: string;
  gradient: string;
  tone: string;
  suggestion: string;
};

const canvasBlocks: CanvasBlock[] = [
  { title: "Problem", prompt: "What recurring friction are you removing?", gradient: "from-rose-50 to-white", tone: "text-rose-600", suggestion: "Describe a single recurring moment that feels expensive, slow, or frustrating." },
  { title: "Customer", prompt: "Who feels this problem most intensely?", gradient: "from-amber-50 to-white", tone: "text-amber-600", suggestion: "Name one early adopter and the context in which they feel this pain." },
  { title: "Solution", prompt: "What is the smallest useful outcome?", gradient: "from-emerald-50 to-white", tone: "text-emerald-600", suggestion: "Sketch the smallest result a person could receive in their first session." },
  { title: "Revenue", prompt: "How could the value become sustainable?", gradient: "from-[#fffaeb] to-white", tone: "text-[#fa520f]", suggestion: "Choose a simple value exchange: subscription, transaction, or team plan." },
  { title: "Channels", prompt: "Where will early users discover it?", gradient: "from-sky-50 to-white", tone: "text-sky-600", suggestion: "Identify one community, workflow, or trusted person that already reaches early users." },
  { title: "Costs", prompt: "What does the first proof require?", gradient: "from-orange-50 to-white", tone: "text-orange-600", suggestion: "List the smallest time, tooling, and research costs needed to test the idea." },
  { title: "Metrics", prompt: "What signal proves it is working?", gradient: "from-[#fffaeb] to-white", tone: "text-[#fa520f]", suggestion: "Pick one behavior that tells you a user received meaningful value." },
  { title: "Advantage", prompt: "What could make this hard to replace?", gradient: "from-fuchsia-50 to-white", tone: "text-fuchsia-600", suggestion: "Consider trust, a unique workflow, specialized knowledge, or a growing data advantage." },
  { title: "Growth", prompt: "What can compound after the first win?", gradient: "from-teal-50 to-white", tone: "text-teal-600", suggestion: "Describe one loop that could bring the next useful user in naturally." },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState("Problem");
  const [expanded, setExpanded] = useState<string | null>("Problem");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveState, setSaveState] = useState<"loading" | "saved" | "saving" | "error">("loading");
  const pendingNotes = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (!user) return;
    projectService.getCanvas()
      .then((response) => { setNotes(response.data.notes); setSaveState("saved"); })
      .catch(() => setSaveState("error"))
      .finally(() => setIsLoaded(true));
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;
    const timer = window.setTimeout(async () => {
      pendingNotes.current = notes;
      setSaveState("saving");
      try {
        await projectService.saveCanvas(notes);
        if (pendingNotes.current === notes) setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [isLoaded, notes]);

  const completed = canvasBlocks.filter((block) => notes[block.title]?.trim()).length;
  const progress = Math.round((completed / canvasBlocks.length) * 100);

  function updateNote(title: string, value: string) {
    setSelected(title);
    setNotes((current) => ({ ...current, [title]: value }));
  }

  function addSuggestion() {
    const block = canvasBlocks.find((item) => item.title === selected);
    if (!block) return;
    setExpanded(selected);
    setNotes((current) => ({
      ...current,
      [selected]: current[selected]?.trim() ? current[selected] : block.suggestion,
    }));
  }

  function startNewCanvas() {
    setNotes({});
    setSelected("Problem");
    setExpanded("Problem");
  }

  function handleExportCanvas() {
    const lines = [
      "# Lean Venture Canvas",
      "",
      `*Exported from IdeaForge on ${new Date().toLocaleDateString()}*`,
      "",
      "---",
      "",
    ];

    canvasBlocks.forEach((block) => {
      lines.push(`### ${block.title}`);
      lines.push(`> *${block.prompt}*`);
      lines.push("");
      lines.push(notes[block.title]?.trim() || "_No notes recorded yet._");
      lines.push("");
      lines.push("---");
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lean-venture-canvas.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <main className="mx-auto max-w-[1440px]">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-[#fa520f] dark:text-[#fa520f]">PROJECT CANVAS</p>
            <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Turn possibility into a plan.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">Explore the moving parts of your next venture. Your canvas is saved securely to your IdeaForge account.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleExportCanvas} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#120F17] px-4 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-white/5">
              <Download size={17} /> Export Canvas
            </button>
            <button onClick={startNewCanvas} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fa520f] px-5 text-sm font-semibold text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none transition hover:-translate-y-0.5 hover:bg-[#cc3a05]">
              <Plus size={18} /> New canvas
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-[#ededed] dark:border-white/10 bg-gradient-to-br from-[#fa520f] to-[#ffa110] p-6 text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none transition-colors duration-500">
            <span className="grid size-10 place-items-center rounded-2xl bg-white/15"><FolderKanban size={20} /></span>
            <p className="mt-7 text-sm font-medium text-white/80">Live Workspace</p>
            <h2 className="font-heading mt-1 text-xl font-bold">Your venture canvas</h2>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-xs text-white/80">{completed} of {canvasBlocks.length} sections shaped</p>
          </article>
          <article className="rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500"><Sparkles size={20} className="text-[#ff8105] dark:text-[#ff8105]" /><p className="mt-7 text-sm font-medium text-slate-400 dark:text-slate-500">Creative prompt</p><p className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">Start with the problem.</p><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">The sharpest projects begin with a specific human friction.</p></article>
          <article className="rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-colors duration-500"><Users size={20} className="text-emerald-500 dark:text-emerald-400" /><p className="mt-7 text-sm font-medium text-slate-400 dark:text-slate-500">Early validation</p><p className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">Find five voices.</p><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Talk to people who feel the problem before designing the whole solution.</p></article>
        </section>

        <section className="mt-10 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,.3)] dark:shadow-none sm:p-7 transition-colors duration-500">
          <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#fa520f] dark:text-[#fa520f]">STARTUP CANVAS</p><h2 className="font-heading mt-1 text-2xl font-bold text-slate-900 dark:text-white">A working model, one block at a time</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"><CircleCheck size={14} /> Synced to cloud</span></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {canvasBlocks.map((block) => {
              const isExpanded = expanded === block.title;
              return <article key={block.title} className={`group rounded-3xl border p-5 transition-all duration-300 ${selected === block.title ? "border-[#e6d5a8] ring-4 ring-[#fff8e0] dark:border-white/10 dark:ring-white/5" : "border-slate-100 dark:border-white/5 hover:border-[#e6d5a8] dark:hover:border-white/15"} bg-gradient-to-br ${block.gradient} dark:from-[#1a1625] dark:to-[#1a1625]`}>
                <div className="flex items-start justify-between gap-3"><button onClick={() => { setSelected(block.title); setExpanded(block.title); }} className="flex items-center gap-2 text-left"><GripVertical size={16} className="text-slate-300 dark:text-slate-500" /><span className={`text-sm font-bold ${block.tone} dark:text-opacity-90`}>{block.title}</span></button><button onClick={() => { setSelected(block.title); setExpanded(isExpanded ? null : block.title); }} className="grid size-10 place-items-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-white dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-300" aria-label={`${isExpanded ? "Collapse" : "Expand"} ${block.title}`} aria-expanded={isExpanded}><ChevronDown size={17} className={isExpanded ? "rotate-180 transition-transform" : "transition-transform"} /></button></div>
                <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-400">{block.prompt}</p>
                {isExpanded && <textarea value={notes[block.title] || ""} onChange={(event) => updateNote(block.title, event.target.value)} className="mt-4 w-full resize-none rounded-xl border border-white dark:border-white/10 bg-white/80 dark:bg-[#120F17]/80 p-3 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-[#fff8e0]0/50 transition-colors" rows={4} placeholder="Add your working note..." />}
                {!isExpanded && notes[block.title]?.trim() && <p className="mt-4 line-clamp-2 rounded-xl bg-white/65 dark:bg-[#120F17]/65 p-3 text-sm leading-6 text-slate-600 dark:text-slate-400 transition-colors">{notes[block.title]}</p>}
              </article>;
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-[#1a1625] px-4 py-3 text-sm text-slate-500 dark:text-slate-400 transition-colors"><span>Selected block: <strong className="font-semibold text-slate-700 dark:text-slate-300">{selected}</strong></span><div className="flex items-center gap-4"><span className={saveState === "error" ? "text-rose-600 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}>{saveState === "saving" ? "Saving…" : saveState === "error" ? "Could not save changes" : "Saved to your account"}</span><button onClick={addSuggestion} className="inline-flex min-h-11 items-center gap-1 font-semibold text-[#fa520f] dark:text-[#fa520f] hover:text-[#cc3a05] dark:hover:text-indigo-300">Add a starter prompt <ArrowUpRight size={16} /></button></div></div>
        </section>
      </main>
    </div>
  );
}
