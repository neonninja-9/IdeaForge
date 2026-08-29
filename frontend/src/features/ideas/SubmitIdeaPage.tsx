import { useEffect, useMemo, useState, useCallback, useRef, type FormEvent } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Lightbulb,
  LoaderCircle,
  Mic,
  PartyPopper,
  Save,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import categoryService from "../../services/categoryService";
import tagService from "../../services/tagService";
import aiService from "../../services/aiService";
import type { Category, Tag, Attachment } from "../../types/idea.types";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import AttachmentUploader from "../../components/AttachmentUploader/AttachmentUploader";

/* ─── Constants ─────────────────────────────────────────────────── */
const DRAFT_STORAGE_KEY = "ideaforge:draft";
const DRAFT_SAVE_DELAY = 800; // ms debounce

/* ─── Helper: tech-stack suggestion ─────────────────────────────── */
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

/* ─── Types ──────────────────────────────────────────────────────── */
interface FormErrors { title?: string; problem?: string; solution?: string; category?: string; tags?: string; difficulty?: string; }
interface DraftData { title: string; problem: string; solution: string; impact: string; difficulty: string; selectedCategory: string; selectedTags: string[]; attachments: Attachment[]; savedAt: number; }

/* ─── Draft persistence helpers ──────────────────────────────────── */
function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveDraft(data: Omit<DraftData, "savedAt">) {
  try { localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...data, savedAt: Date.now() })); } catch { /* quota exceeded — silently skip */ }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_STORAGE_KEY); } catch { /* ignore */ }
}
function formatDraftTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* ─── "Coming soon" disabled button wrapper ──────────────────────── */
function ComingSoonButton({ icon: Icon, label }: { icon: React.ComponentType<{ size: number }>; label: string }) {
  return (
    <span className="group relative">
      <button
        type="button"
        disabled
        className="inline-flex min-h-9 cursor-not-allowed items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-300 dark:text-slate-600"
        aria-label={`${label} — coming soon`}
      >
        <Icon size={15} /> {label}
      </button>
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        Coming soon
      </span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function SubmitIdeaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCategorizing, setIsCategorizing] = useState(false);

  // Draft auto-save state
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHydratedRef = useRef(false);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdIdeaId, setCreatedIdeaId] = useState<string | null>(null);

  /* ─── Auth guard & reference data ──────────────────────────────── */
  useEffect(() => { if (!authLoading && !user) navigate("/login"); }, [user, authLoading, navigate]);
  useEffect(() => {
    Promise.all([categoryService.getCategories(), tagService.getTags()])
      .then(([categoryResponse, tagResponse]) => { setCategories(categoryResponse.data.categories); setAllTags(tagResponse.data.tags); })
      .catch(console.error)
      .finally(() => setReferenceLoading(false));
  }, []);
  useEffect(() => { const prompt = searchParams.get("prompt"); if (prompt) setProblem(prompt); }, [searchParams]);

  /* ─── Hydrate from localStorage or Router State on first render ────────────────── */
  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    // Check if we came from Dashboard's Magic Structure
    const prefill = location.state?.prefillData;
    if (prefill) {
      setTitle(prefill.title || "");
      setProblem(prefill.problem || "");
      setSolution(prefill.solution || "");
      setImpact(prefill.impact || "");
      setDifficulty(prefill.difficulty || "");
      // Clear navigation state so a refresh doesn't overwrite a draft again
      window.history.replaceState({}, document.title);
      return;
    }

    const draft = loadDraft();
    if (draft) {
      setTitle(draft.title || "");
      setProblem(draft.problem || "");
      setSolution(draft.solution || "");
      setImpact(draft.impact || "");
      setDifficulty(draft.difficulty || "");
      setSelectedCategory(draft.selectedCategory || "");
      setSelectedTags(draft.selectedTags || []);
      setAttachments(draft.attachments || []);
      setDraftSavedAt(draft.savedAt);
    }
  }, [location.state]);

  /* ─── Debounced auto-save ──────────────────────────────────────── */
  const debouncedSave = useCallback(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      saveDraft({ title, problem, solution, impact, difficulty, selectedCategory, selectedTags, attachments });
      setDraftSavedAt(Date.now());
    }, DRAFT_SAVE_DELAY);
  }, [title, problem, solution, impact, difficulty, selectedCategory, selectedTags, attachments]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (title || problem || solution || impact || difficulty || selectedCategory || selectedTags.length || attachments.length) {
      debouncedSave();
    }
    return () => { if (draftTimerRef.current) clearTimeout(draftTimerRef.current); };
  }, [title, problem, solution, impact, difficulty, selectedCategory, selectedTags, attachments, debouncedSave]);

  /* ─── Derived values ───────────────────────────────────────────── */
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

  /* ─── Actions ──────────────────────────────────────────────────── */
  function toggleTag(tagId: string) { setSelectedTags((current) => current.includes(tagId) ? current.filter((id) => id !== tagId) : current.length < 5 ? [...current, tagId] : current); }

  function validateStep(step: number): FormErrors {
    const next: FormErrors = {};
    if (step === 1) {
      if (title.trim().length < 3) next.title = "Give your idea a title of at least 3 characters.";
      if (problem.trim().length < 20) next.problem = "Describe the problem in at least 20 characters.";
    }
    if (step === 2) {
      if (solution.trim().length < 20) next.solution = "Describe a possible solution in at least 20 characters.";
    }
    if (step === 3) {
      if (!selectedCategory) next.category = "Choose a category.";
      if (!selectedTags.length) next.tags = "Choose at least one focus area.";
      if (!difficulty) next.difficulty = "Choose a starting level.";
    }
    return next;
  }

  async function handleNextStep() {
    const nextErrors = validateStep(currentStep);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      if (currentStep === 2) {
        setIsCategorizing(true);
        try {
          const res = await aiService.categorizeIdea(title, problem, solution, impact);
          if (res.data) {
            if (res.data.categoryId) setSelectedCategory(res.data.categoryId);
            if (res.data.difficulty) setDifficulty(res.data.difficulty);
            if (res.data.tagIds) setSelectedTags(res.data.tagIds);

            // Re-fetch categories and tags in case AI created new ones
            const [categoryResponse, tagResponse] = await Promise.all([
              categoryService.getCategories(),
              tagService.getTags()
            ]);
            setCategories(categoryResponse.data.categories);
            setAllTags(tagResponse.data.tags);
          }
        } catch (e) {
          console.error("Auto-categorization failed", e);
        } finally {
          setIsCategorizing(false);
          setCurrentStep(3);
        }
      } else {
        setCurrentStep(s => Math.min(3, s + 1));
      }
    }
  }

  function handlePrevStep() {
    setCurrentStep(s => Math.max(1, s - 1));
  }

  function validateAll(): FormErrors {
    return { ...validateStep(1), ...validateStep(2), ...validateStep(3) };
  }

  async function handleSubmit(event: FormEvent, status: "published" | "draft" = "published") {
    event.preventDefault();
    setServerError("");

    if (status === "published") {
      const nextErrors = validateAll();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
    }

    if (status === "draft") setIsSavingDraft(true);
    else setIsSubmitting(true);

    try {
      const response = await ideaService.createIdea({
        title: title.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        impact: impact.trim() || undefined,
        difficulty: (difficulty || "Beginner") as "Beginner" | "Intermediate" | "Advanced",
        category: selectedCategory || undefined,
        tags: selectedTags,
        suggestedTechStack: techStack || undefined,
        status,
        attachments,
      });

      clearDraft();

      if (status === "draft") {
        navigate("/dashboard");
      } else {
        const newIdea = response.data.idea as { _id?: string; id?: string };
        const newId = newIdea.id || newIdea._id || "";
        setCreatedIdeaId(newId);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "We couldn't save your idea. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsSavingDraft(false);
    }
  }

  function resetForm() {
    setTitle(""); setProblem(""); setSolution(""); setImpact(""); setDifficulty(""); setSelectedCategory(""); setSelectedTags([]); setAttachments([]);
    setErrors({}); setServerError(""); setDraftSavedAt(null); setCurrentStep(1);
    clearDraft();
  }

  /* ─── Loading ──────────────────────────────────────────────────── */
  if (authLoading || referenceLoading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500"><PageSkeleton variant="form" /></div>;

  /* ─── Success Modal ────────────────────────────────────────────── */
  if (showSuccessModal) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500">
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 dark:bg-black/50 backdrop-blur-sm px-5">
          <div className="animate-reveal-up w-full max-w-md rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-[#1a1625] p-8 shadow-2xl dark:shadow-none text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-[20px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <PartyPopper size={28} />
            </span>
            <h2 className="font-heading mt-6 text-2xl font-bold text-slate-900 dark:text-white">Your idea is live!</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your idea has been published and is now visible to the community. Watch it grow with votes and feedback.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to={`/idea/${createdIdeaId}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                View your idea <ArrowRight size={17} />
              </Link>
              <button
                type="button"
                onClick={() => { setShowSuccessModal(false); resetForm(); }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#120F17] px-5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <Sparkles size={16} /> Submit another idea
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main form ────────────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={18} /> Back</button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 dark:text-slate-500 sm:flex">{draftSavedAt ? <><span className="size-2 rounded-full bg-emerald-500" /> Draft saved at {formatDraftTime(draftSavedAt)}</> : <><span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" /> No draft</>}</div>
        </div>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">IDEA CAPTURE</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Give your thought room to grow.</h1>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">Start messy. Capture your raw thoughts, attach visuals or specs, and present it clearly to the community.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <form onSubmit={(e) => handleSubmit(e, "published")} noValidate className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] dark:shadow-none sm:p-8 transition-colors duration-500">
            {serverError && <div className="mb-6 rounded-2xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">{serverError}</div>}
            
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className={`h-1.5 w-12 rounded-full ${currentStep >= 1 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  <div className={`h-1.5 w-12 rounded-full ${currentStep >= 2 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  <div className={`h-1.5 w-12 rounded-full ${currentStep >= 3 ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                  {currentStep === 1 ? "Step 1: The Spark" : currentStep === 2 ? "Step 2: The Solution" : "Step 3: Categorization"}
                </p>
                <h2 className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  {currentStep === 1 ? "What are you thinking about?" : currentStep === 2 ? "How could this be solved?" : "Where does this fit in?"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Idea clarity</p>
                  <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">{confidence}%</p>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Lightbulb size={20} /></span>
              </div>
            </div>

            <div className="mt-7 space-y-6">
              {currentStep === 1 && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name your idea</span>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this thought a working title" className={`w-full rounded-2xl border bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-3.5 text-base text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 ${errors.title ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.title && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.title}</span>}
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Describe your idea <span className="font-normal text-slate-400 dark:text-slate-500">{problem.length} characters</span>
                    </span>
                    <textarea value={problem} onChange={(event) => setProblem(event.target.value)} rows={6} placeholder="Describe the problem, the moment you noticed it, or the possibility you can't stop thinking about..." className={`w-full resize-none rounded-2xl border bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 ${errors.problem ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.problem && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.problem}</span>}
                  </label>

                  <div className="-mt-3 flex flex-wrap items-center gap-1">
                    <ComingSoonButton icon={Mic} label="Voice recording" />
                    <ComingSoonButton icon={WandSparkles} label="AI Copilot" />
                  </div>

                  <AttachmentUploader
                    attachments={attachments}
                    onChange={setAttachments}
                    maxFiles={5}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">A possible first solution</span>
                    <textarea value={solution} onChange={(event) => setSolution(event.target.value)} rows={4} placeholder="How could this become useful? Don't worry about getting it right yet." className={`w-full resize-none rounded-2xl border bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 ${errors.solution ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.solution && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.solution}</span>}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">The impact you hope for <span className="font-normal text-slate-400 dark:text-slate-500">optional</span></span>
                    <textarea value={impact} onChange={(event) => setImpact(event.target.value)} rows={4} placeholder="What would a better future look like?" className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-3 text-sm leading-6 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10" />
                  </label>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
                      <span className="relative block">
                        <select aria-label="Category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={`w-full appearance-none rounded-2xl border bg-[#fcfcfd] dark:bg-[#1a1625] px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-400 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 ${errors.category ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`}>
                          <option value="">Choose a category</option>
                          {categories.map((category) => <option key={category.id || category._id} value={category.id || category._id}>{category.icon} {category.name}</option>)}
                        </select>
                        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-3.5 text-slate-400 dark:text-slate-500" />
                      </span>
                      {errors.category && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.category}</span>}
                    </label>
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Starting point</span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <button key={level} type="button" onClick={() => setDifficulty(level)} className={`min-h-[50px] rounded-xl border px-2 text-xs font-semibold transition ${difficulty === level ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625] text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-500/30"}`}>{level}</button>
                        ))}
                      </div>
                      {errors.difficulty && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.difficulty}</span>}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Focus areas</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Up to 5</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => {
                        const id = tag.id || tag._id;
                        const selected = selectedTags.includes(id);
                        return <button key={id} type="button" onClick={() => toggleTag(id)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selected ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-500/30"}`}>{selected && <Check size={13} className="mr-1 inline" />}{tag.name}</button>;
                      })}
                    </div>
                    {errors.tags && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.tags}</span>}
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-white/10 pt-6 sm:flex-row sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                {currentStep > 1 && (
                  <button type="button" onClick={handlePrevStep} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5"><ArrowLeft size={17} /> Back</button>
                )}
                <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={isSavingDraft || !title.trim()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-60"><Save size={17} /> {isSavingDraft ? "Saving..." : "Save draft"}</button>
              </div>
              
              {currentStep < 3 ? (
                <button type="button" onClick={handleNextStep} disabled={isCategorizing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:translate-y-0">
                  {isCategorizing ? <><LoaderCircle className="animate-spin" size={17} /> Categorizing...</> : <>Next Step <ArrowRight size={17} /></>}
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 dark:shadow-none transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />}{isSubmitting ? "Publishing..." : "Publish idea"}<ArrowRight size={17} /></button>
              )}
            </div>
          </form>

          <aside className="xl:sticky xl:top-24 xl:h-fit">
            <div className="overflow-hidden rounded-[28px] border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-b from-indigo-50/80 to-white dark:from-indigo-900/20 dark:to-[#120F17] shadow-[0_18px_50px_-32px_rgba(79,70,229,0.4)] dark:shadow-none transition-colors duration-500">
              <div className="border-b border-indigo-100 dark:border-indigo-500/20 bg-white/65 dark:bg-[#120F17]/65 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                    <Sparkles size={15} /> Live Blueprint
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-100/80 dark:bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                    AI Expansion · Soon
                  </span>
                </div>
                <h2 className="font-heading mt-4 text-xl font-bold text-slate-900 dark:text-white">Your idea, taking shape.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">A live view of how your raw thought will be presented to others.</p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {blueprint.map((card) => (
                    <article key={card.label} className="rounded-2xl border border-white dark:border-white/5 bg-white/90 dark:bg-[#1a1625]/90 p-4 shadow-sm dark:shadow-none transition-colors">
                      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{card.label}</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
                    </article>
                  ))}
                  {techStack && (
                    <article className="rounded-2xl border border-violet-100 dark:border-violet-500/20 bg-violet-50/60 dark:bg-violet-500/10 p-4">
                      <p className="text-xs font-bold text-violet-600 dark:text-violet-400">Suggested foundation</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{techStack}</p>
                    </article>
                  )}
                  {attachments.length > 0 && (
                    <article className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/10 p-4">
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Visuals ({attachments.length})</p>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">{attachments.map((a) => a.name).join(", ")}</p>
                    </article>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/10 px-4 py-3 text-xs leading-5 text-indigo-800 dark:text-indigo-300">
              <Sparkles size={17} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              Focus on capturing raw thoughts and attaching specs. The community will help iterate on the rest.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
