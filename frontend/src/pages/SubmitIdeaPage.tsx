import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  Lightbulb,
  LoaderCircle,
  Mic,
  Paperclip,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import categoryService from "../services/categoryService";
import tagService from "../services/tagService";
import aiService from "../services/aiService";
import type { Category, Tag } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";

function generateTechStack(tagNames: string[], difficulty: string): string {
  const lower = tagNames.map((tag) => tag.toLowerCase());
  let frontend = "React + TypeScript";
  let backend = "Node.js + Express";
  let database = "MongoDB";
  if (lower.some((tag) => ["mobile app"].includes(tag))) frontend = "React Native or Flutter";
  if (lower.some((tag) => ["ai", "machine learning", "data science", "computer vision", "nlp"].includes(tag))) backend = "Python (FastAPI)";
  if (lower.some((tag) => ["cloud computing", "devops"].includes(tag))) database = "PostgreSQL + Redis";
  return difficulty === "Beginner" ? `A simple start: ${frontend}, Firebase` : `${frontend} · ${backend} · ${database}`;
}

interface FormErrors { title?: string; problem?: string; solution?: string; category?: string; tags?: string; difficulty?: string; }

export default function SubmitIdeaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [impact, setImpact] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  useEffect(() => { if (!authLoading && !user) navigate("/login"); }, [user, authLoading, navigate]);
  useEffect(() => {
    Promise.all([categoryService.getCategories(), tagService.getTags()])
      .then(([categoryResponse, tagResponse]) => { setCategories(categoryResponse.data.categories); setAllTags(tagResponse.data.tags); })
      .catch(console.error)
      .finally(() => setReferenceLoading(false));
  }, []);
  useEffect(() => { const prompt = searchParams.get("prompt"); if (prompt) setProblem(prompt); }, [searchParams]);

  const selectedTagNames = allTags.filter((tag) => selectedTags.includes(tag.id || tag._id)).map((tag) => tag.name);
  const techStack = selectedTagNames.length > 0 && difficulty ? generateTechStack(selectedTagNames, difficulty) : "";
  const confidence = Math.min(100, Math.round((title.trim() ? 20 : 0) + Math.min(problem.trim().length, 160) / 160 * 35 + Math.min(solution.trim().length, 160) / 160 * 30 + (selectedTags.length > 0 ? 10 : 0) + (difficulty ? 5 : 0)));
  const activeCategory = categories.find((category) => (category.id || category._id) === selectedCategory)?.name || "your category";
  const blueprint = useMemo(() => [
    { label: "Problem", text: problem.trim() || "Clarify the real-world friction your idea will remove." },
    { label: "Solution", text: solution.trim() || "Describe the simplest useful experience that solves it." },
    { label: "Target audience", text: `Start with a focused group that feels this ${activeCategory} problem most often.` },
    { label: "Unique value", text: impact.trim() || "Make the first outcome feel faster, clearer, or more personal than existing alternatives." },
  ], [problem, solution, impact, activeCategory]);

  function toggleTag(tagId: string) { setSelectedTags((current) => current.includes(tagId) ? current.filter((id) => id !== tagId) : current.length < 5 ? [...current, tagId] : current); }
  function validate(): FormErrors {
    const next: FormErrors = {};
    if (title.trim().length < 5) next.title = "Give your idea a title of at least 5 characters.";
    if (problem.trim().length < 20) next.problem = "Describe the problem in at least 20 characters.";
    if (solution.trim().length < 20) next.solution = "Describe a possible solution in at least 20 characters.";
    if (!selectedCategory) next.category = "Choose a category.";
    if (!selectedTags.length) next.tags = "Choose at least one focus area.";
    if (!difficulty) next.difficulty = "Choose a starting level.";
    return next;
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setServerError("");
    const nextErrors = validate(); setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setIsSubmitting(true);
    try {
      await ideaService.createIdea({ title: title.trim(), problem: problem.trim(), solution: solution.trim(), impact: impact.trim() || undefined, difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced", category: selectedCategory, tags: selectedTags, suggestedTechStack: techStack || undefined });
      navigate("/dashboard");
    } catch (error) { setServerError(error instanceof Error ? error.message : "We couldn't save your idea. Please try again."); }
    finally { setIsSubmitting(false); }
  }
  async function generateBlueprint() {
    setIsThinking(true);
    try {
      const message = [title, problem, solution].filter(Boolean).join(" — ") || "Help me shape a new project idea";
      const response = await aiService.assist(message, { ideaTitle: title });
      setAiAdvice(response.data.message);
    } catch {
      setAiAdvice("The AI suggestion is unavailable right now. You can still use this blueprint as a starting point.");
    } finally {
      setIsThinking(false);
      setShowBlueprint(true);
    }
  }

  if (authLoading || referenceLoading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--color-surface-idea)]"><PageSkeleton variant="form" /></div>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--color-surface-idea)] px-5 py-7 sm:px-8 sm:py-10 xl:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-center justify-between gap-4"><button onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"><ArrowLeft size={18} /> Back</button><div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex"><span className="size-2 rounded-full bg-emerald-500" /> Draft saved locally</div></div>
        <div className="mb-8 max-w-3xl"><p className="text-sm font-semibold text-indigo-600">IDEA CAPTURE</p><h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Give your thought room to grow.</h1><p className="mt-3 text-base leading-7 text-slate-500">Start messy. Your AI collaborator will help turn the spark into a clear opportunity.</p></div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <form onSubmit={handleSubmit} noValidate className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] sm:p-8">
            {serverError && <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{serverError}</div>}
            <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">The spark</p><h2 className="font-heading mt-1 text-xl font-bold text-slate-900">What are you thinking about?</h2></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Idea clarity</p><p className="mt-1 text-sm font-bold text-indigo-600">{confidence}%</p></div><span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><Lightbulb size={20} /></span></div></div>
            <div className="mt-7 space-y-6">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Name your idea</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this thought a working title" className={`w-full rounded-2xl border bg-[#fcfcfd] px-4 py-3.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 ${errors.title ? "border-rose-300" : "border-slate-200"}`} />{errors.title && <span className="mt-1.5 block text-xs text-rose-600">{errors.title}</span>}</label>
              <label className="block"><span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">Describe your idea <span className="font-normal text-slate-400">{problem.length} characters</span></span><textarea value={problem} onChange={(event) => setProblem(event.target.value)} rows={7} placeholder="Describe the problem, the moment you noticed it, or the possibility you can't stop thinking about..." className={`w-full resize-none rounded-2xl border bg-[#fcfcfd] px-4 py-4 text-base leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 ${errors.problem ? "border-rose-300" : "border-slate-200"}`} />{errors.problem && <span className="mt-1.5 block text-xs text-rose-600">{errors.problem}</span>}</label>
              <div className="-mt-3 flex flex-wrap items-center gap-1"><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"><Mic size={16} /> Voice</button><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"><ImagePlus size={16} /> Image</button><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"><Paperclip size={16} /> Attach</button><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"><FileText size={16} /> Sketch</button></div>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">A possible first solution</span><textarea value={solution} onChange={(event) => setSolution(event.target.value)} rows={4} placeholder="How could this become useful? Don't worry about getting it right yet." className={`w-full resize-none rounded-2xl border bg-[#fcfcfd] px-4 py-4 text-base leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 ${errors.solution ? "border-rose-300" : "border-slate-200"}`} />{errors.solution && <span className="mt-1.5 block text-xs text-rose-600">{errors.solution}</span>}</label>
              <div className="grid gap-5 md:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Category</span><span className="relative block"><select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={`w-full appearance-none rounded-2xl border bg-[#fcfcfd] px-4 py-3.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 ${errors.category ? "border-rose-300" : "border-slate-200"}`}><option value="">Choose a category</option>{categories.map((category) => <option key={category.id || category._id} value={category.id || category._id}>{category.icon} {category.name}</option>)}</select><ChevronDown size={17} className="pointer-events-none absolute right-4 top-3.5 text-slate-400" /></span>{errors.category && <span className="mt-1.5 block text-xs text-rose-600">{errors.category}</span>}</label><div><span className="mb-2 block text-sm font-semibold text-slate-700">Starting point</span><div className="grid grid-cols-3 gap-2">{["Beginner", "Intermediate", "Advanced"].map((level) => <button key={level} type="button" onClick={() => setDifficulty(level)} className={`min-h-[50px] rounded-xl border px-2 text-xs font-semibold transition ${difficulty === level ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-[#fcfcfd] text-slate-500 hover:border-indigo-200"}`}>{level}</button>)}</div>{errors.difficulty && <span className="mt-1.5 block text-xs text-rose-600">{errors.difficulty}</span>}</div></div>
              <div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-slate-700">Focus areas</span><span className="text-xs text-slate-400">Up to 5</span></div><div className="flex flex-wrap gap-2">{allTags.map((tag) => { const id = tag.id || tag._id; const selected = selectedTags.includes(id); return <button key={id} type="button" onClick={() => toggleTag(id)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selected ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white text-slate-500 hover:border-indigo-200"}`}>{selected && <Check size={13} className="mr-1 inline" />}{tag.name}</button>; })}</div>{errors.tags && <span className="mt-1.5 block text-xs text-rose-600">{errors.tags}</span>}</div>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">The impact you hope for <span className="font-normal text-slate-400">optional</span></span><textarea value={impact} onChange={(event) => setImpact(event.target.value)} rows={2} placeholder="What would a better future look like?" className="w-full resize-none rounded-2xl border border-slate-200 bg-[#fcfcfd] px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" /></label>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between"><button type="button" onClick={generateBlueprint} disabled={isThinking} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-50 px-5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-60"><WandSparkles size={18} /> {isThinking ? "Thinking through it..." : "Preview with AI"}</button><button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />}{isSubmitting ? "Saving your idea..." : "Save idea"}<ArrowRight size={17} /></button></div>
          </form>

          <aside className="xl:sticky xl:top-24 xl:h-fit"><div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-b from-indigo-50/80 to-white shadow-[0_18px_50px_-32px_rgba(79,70,229,0.4)]"><div className="border-b border-indigo-100 bg-white/65 p-6"><div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700"><Bot size={15} /> AI collaborator</span><span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" /> Ready</span></div><h2 className="font-heading mt-5 text-xl font-bold text-slate-900">Your idea, expanded.</h2><p className="mt-2 text-sm leading-6 text-slate-500">A calm first look at the structure emerging from your thought.</p></div><div className="p-5 sm:p-6">{isThinking ? <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="grid size-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm"><Sparkles size={24} className="animate-pulse" /></span><p className="mt-5 text-sm font-semibold text-slate-700">Looking for the opportunity...</p><p className="mt-1 text-xs text-slate-400">Finding patterns in your idea</p></div> : showBlueprint ? <div className="space-y-3">{blueprint.map((card, index) => <article key={card.label} className="animate-reveal-up rounded-2xl border border-white bg-white/90 p-4 shadow-sm" style={{ animationDelay: `${index * 75}ms` }}><p className="text-xs font-bold text-indigo-600">{card.label}</p><p className="mt-1.5 text-sm leading-6 text-slate-600">{card.text}</p></article>)}{aiAdvice && <article className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4"><p className="text-xs font-bold text-violet-600">AI perspective</p><p className="mt-1.5 text-sm leading-6 text-slate-600">{aiAdvice}</p></article>}{techStack && <article className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4"><p className="text-xs font-bold text-violet-600">Suggested foundation</p><p className="mt-1.5 text-sm leading-6 text-slate-600">{techStack}</p></article>}<button type="button" onClick={generateBlueprint} className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"><RefreshCw size={15} /> Regenerate preview</button></div> : <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="grid size-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-sm"><Sparkles size={24} /></span><h3 className="font-heading mt-5 text-lg font-bold text-slate-800">A blueprint is waiting.</h3><p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Share a little about the problem and solution, then ask AI to reveal the first shape of your idea.</p><button type="button" onClick={generateBlueprint} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"><Sparkles size={16} /> Create a preview</button></div>}</div></div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800"><WandSparkles size={17} className="shrink-0" /> This preview is a creative starting point—review and shape it with your own expertise.</div></aside>
        </div>
      </div>
    </div>
  );
}
