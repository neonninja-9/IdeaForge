import { useEffect, useMemo, useState, useCallback, useRef, type FormEvent } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Lightbulb,
  LoaderCircle,
  Mic,
  Save,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import categoryService from "../../services/categoryService";
import tagService from "../../services/tagService";
import aiService from "../../services/aiService";
import type { Category, Tag, Attachment } from "../../types/idea.types";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import AttachmentUploader from "../../components/AttachmentUploader/AttachmentUploader";
import { cleanAiDescription } from "../../utils/textCleaner";


/* ─── Constants ─────────────────────────────────────────────────── */
const DRAFT_STORAGE_KEY = "ideaforge:draft";
const DRAFT_SAVE_DELAY = 800; // ms debounce

/* ─── Step metadata ─────────────────────────────────────────────── */
const STEPS = [
  { num: 1, title: "The Spark", subtitle: "What are you thinking about?", description: "Name your idea and describe the problem." },
  { num: 2, title: "The Solution", subtitle: "How could this be solved?", description: "Propose a solution and its impact." },
  { num: 3, title: "Categorization", subtitle: "Where does this fit in?", description: "AI-assisted tagging & classification." },
] as const;

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

/* ─── AI Suggestion Card ─────────────────────────────────────────── */
function AiSuggestionCard({
  suggestion,
  isLoading,
  onAccept,
  onDismiss,
  label,
}: {
  suggestion: string | null;
  isLoading: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  label: string;
}) {
  if (!isLoading && !suggestion) return null;

  return (
    <div className="animate-reveal-up rounded-2xl border border-[#e6d5a8] dark:border-[#ff8105]/20 bg-gradient-to-br from-[#fffaeb] to-[#fff8e0] dark:from-[#1a0800/30] dark:to-[#1a0800/20] p-4 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-3">
        <span className="grid size-7 place-items-center rounded-lg bg-[#fff0c2] dark:bg-[#fa520f]/20 text-[#fa520f] dark:text-[#ff8105]">
          {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}
        </span>
        <span className="text-xs font-semibold text-[#cc3a05] dark:text-[#ffa110]">
          {isLoading ? `AI is refining your ${label}…` : `✨ AI-refined ${label}`}
        </span>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-violet-200/60 dark:bg-[#fa520f]/20" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-violet-200/60 dark:bg-[#fa520f]/20" />
          <div className="h-3 w-3/5 animate-pulse rounded-full bg-violet-200/60 dark:bg-[#fa520f]/20" />
        </div>
      ) : (
        <>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-200 whitespace-pre-line">{suggestion}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onAccept}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-[#fa520f] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#cc3a05]"
            >
              <Check size={13} /> Accept
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#120F17] px-3 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-white/5"
            >
              <X size={13} /> Dismiss
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Categorization Loading Overlay ─────────────────────────────── */
function CategorizationOverlay() {
  const [phase, setPhase] = useState(0);
  const phases = [
    "Reading your problem and solution...",
    "Analyzing context and impact...",
    "Finding the perfect category...",
    "Generating focus areas...",
    "Finalizing details..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < phases.length - 1 ? p + 1 : p));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-reveal-up space-y-8 py-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          {/* Animated decorative rings */}
          <div className="absolute inset-0 -m-8 animate-[spin_4s_linear_infinite] rounded-full border border-dashed border-[#fa520f]/30" />
          <div className="absolute inset-0 -m-4 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-dashed border-[#fa520f]/20" />
          
          <span className="relative flex size-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#fff0c2] to-[#fffaeb] dark:from-[#fa520f]/20 dark:to-[#120F17] text-[#fa520f] shadow-lg shadow-[#fa520f]/10 dark:shadow-none transition-transform duration-500">
            <Sparkles size={32} className="animate-pulse" />
            <span className="absolute -right-1 -top-1 size-5 animate-ping rounded-full bg-[#fa520f]/60" />
            <span className="absolute -left-1 -bottom-1 size-3 animate-ping rounded-full bg-[#fa520f]/40 delay-150" />
          </span>
        </div>
        
        <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Analyzing your idea with AI</h3>
        
        <div className="mt-4 flex min-h-[24px] items-center justify-center gap-2">
          <LoaderCircle size={16} className="animate-spin text-[#fa520f]" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse transition-all duration-300">
            {phases[phase]}
          </p>
        </div>
      </div>
      
      {/* Scanning skeleton representation */}
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-6 shadow-inner">
        {/* Shimmer line scanning top to bottom */}
        <div className="absolute left-0 right-0 top-0 h-full animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-[#fa520f]/5 to-transparent" />
        
        <div className="relative space-y-6 opacity-60">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-white/10 transition-all duration-500" style={{ opacity: phase >= 2 ? 1 : 0.4 }} />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-white/10 transition-all duration-500 delay-100" style={{ opacity: phase >= 1 ? 1 : 0.3 }} />
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-white/10 transition-all duration-500 delay-200" style={{ opacity: phase >= 1 ? 1 : 0.3 }} />
                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-white/10 transition-all duration-500 delay-300" style={{ opacity: phase >= 1 ? 1 : 0.3 }} />
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-white/5">
            <div className="h-4 w-28 rounded-full bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`h-10 rounded-full bg-slate-200 dark:bg-white/10 transition-all duration-500 ${i % 2 === 0 ? 'w-24' : 'w-32'}`} 
                  style={{ opacity: phase >= 3 ? 1 : 0.2, transform: phase >= 3 ? 'scale(1)' : 'scale(0.95)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const [aiSuggestedStep3, setAiSuggestedStep3] = useState(false);

  // AI Refine state
  const [isRefiningProblem, setIsRefiningProblem] = useState(false);
  const [problemSuggestion, setProblemSuggestion] = useState<string | null>(null);
  const [isRefiningSolution, setIsRefiningSolution] = useState(false);
  const [solutionSuggestion, setSolutionSuggestion] = useState<string | null>(null);

  // Step transition animation
  const [stepAnimating, setStepAnimating] = useState(false);

  // Draft auto-save state
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHydratedRef = useRef(false);



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
      
      if (prefill.categoryId) {
        setSelectedCategory(prefill.categoryId);
        setAiSuggestedStep3(true);
      }
      if (prefill.tagIds && prefill.tagIds.length > 0) {
        setSelectedTags(prefill.tagIds);
        setAiSuggestedStep3(true);
      }
      
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

  /* ─── AI Refine Handlers ───────────────────────────────────────── */
  async function handleRefine(field: "problem" | "solution") {
    const text = field === "problem" ? problem : solution;
    if (!text.trim() || text.trim().length < 10) return;

    const setLoading = field === "problem" ? setIsRefiningProblem : setIsRefiningSolution;
    const setSuggestion = field === "problem" ? setProblemSuggestion : setSolutionSuggestion;

    setLoading(true);
    setSuggestion(null);

    try {
      const context = title.trim() ? { ideaTitle: title.trim() } : undefined;
      const prompt = field === "problem"
        ? `Refine and expand this problem description for a project idea. Make it clearer, more specific, and compelling (2-4 sentences). Output ONLY the direct refined description without any introductory phrase, title, headers, or quotes. Problem: "${text.trim()}"`
        : `Refine and expand this solution description for a project idea. Make it more concrete, actionable, and compelling (2-4 sentences). Output ONLY the direct refined description without any introductory phrase, title, headers, or quotes. Solution: "${text.trim()}"`;

      const res = await aiService.assist(prompt, context);
      const cleaned = cleanAiDescription(res.data.message);
      setSuggestion(cleaned);
    } catch (err) {
      console.error(`AI refine ${field} failed`, err);
      setSuggestion(null);
    } finally {
      setLoading(false);
    }
  }

  function acceptSuggestion(field: "problem" | "solution") {
    if (field === "problem" && problemSuggestion) {
      setProblem(cleanAiDescription(problemSuggestion));
      setProblemSuggestion(null);
    }
    if (field === "solution" && solutionSuggestion) {
      setSolution(cleanAiDescription(solutionSuggestion));
      setSolutionSuggestion(null);
    }
  }

  function dismissSuggestion(field: "problem" | "solution") {
    if (field === "problem") setProblemSuggestion(null);
    if (field === "solution") setSolutionSuggestion(null);
  }

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

  function animateStep(cb: () => void) {
    setStepAnimating(true);
    setTimeout(() => {
      cb();
      // Re-trigger animation for the incoming step
      requestAnimationFrame(() => setStepAnimating(false));
    }, 150);
  }

  async function handleNextStep() {
    const nextErrors = validateStep(currentStep);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      if (currentStep === 2) {
        // Animate into categorization loading state, then run AI
        animateStep(() => {
          setIsCategorizing(true);
          setCurrentStep(3);
        });

        try {
          const res = await aiService.categorizeIdea(title, problem, solution, impact);
          if (res.data) {
            if (res.data.categoryId) setSelectedCategory(res.data.categoryId);
            if (res.data.difficulty) setDifficulty(res.data.difficulty);
            if (res.data.tagIds) setSelectedTags(res.data.tagIds);
            setAiSuggestedStep3(true);

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
        }
      } else {
        animateStep(() => setCurrentStep(s => Math.min(3, s + 1)));
      }
    }
  }

  function handlePrevStep() {
    animateStep(() => setCurrentStep(s => Math.max(1, s - 1)));
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
      const cleanTitle = cleanAiDescription(title.trim());
      const cleanProb = cleanAiDescription(problem.trim());
      const cleanSol = cleanAiDescription(solution.trim());
      const cleanImp = impact.trim() ? cleanAiDescription(impact.trim()) : undefined;

      const response = await ideaService.createIdea({
        title: cleanTitle,
        problem: cleanProb,
        solution: cleanSol,
        impact: cleanImp,
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
        navigate(`/idea/${newId}`);
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
    setAiSuggestedStep3(false); setProblemSuggestion(null); setSolutionSuggestion(null);
    clearDraft();
  }

  /* ─── Loading ──────────────────────────────────────────────────── */
  if (authLoading || referenceLoading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500"><PageSkeleton variant="form" /></div>;



  /* ─── Current step info ────────────────────────────────────────── */
  const stepInfo = STEPS[currentStep - 1];

  /* ─── Main form ────────────────────────────────────────────────── */
  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={18} /> Back</button>
          <div className="hidden items-center gap-2 text-sm text-slate-400 dark:text-slate-500 sm:flex">{draftSavedAt ? <><span className="size-2 rounded-full bg-emerald-500" /> Draft saved at {formatDraftTime(draftSavedAt)}</> : <><span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" /> No draft</>}</div>
        </div>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-[#fa520f] dark:text-[#fa520f]">IDEA CAPTURE</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Give your thought room to grow.</h1>
          <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">Start messy. Capture your raw thoughts, attach visuals or specs, and present it clearly to the community.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <form onSubmit={(e) => handleSubmit(e, "published")} noValidate className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] dark:shadow-none sm:p-8 transition-colors duration-500">
            {serverError && <div className="mb-6 rounded-2xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">{serverError}</div>}
            
            {/* ─── Step Indicators ─────────────────────────────── */}
            <div className="mb-7">
              <div className="flex items-center gap-1.5 mb-5">
                {STEPS.map((step) => {
                  const isActive = currentStep === step.num;
                  const isComplete = currentStep > step.num;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => {
                        if (isComplete) animateStep(() => setCurrentStep(step.num));
                      }}
                      disabled={!isComplete}
                      className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#fa520f] text-white shadow-md shadow-[#fa520f1a] dark:shadow-none"
                          : isComplete
                          ? "bg-[#fff8e0] dark:bg-white/5 text-[#fa520f] dark:text-[#fa520f] cursor-pointer hover:bg-[#fff0c2] dark:hover:bg-[#fa520f]/20"
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-default"
                      }`}
                    >
                      <span className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : isComplete
                          ? "bg-[#fa520f] text-white"
                          : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                      }`}>
                        {isComplete ? <Check size={10} /> : step.num}
                      </span>
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                    Step {stepInfo.num}: {stepInfo.title}
                  </p>
                  <h2 className="font-heading mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    {stepInfo.subtitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{stepInfo.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden text-right sm:block">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Idea clarity</p>
                    <p className="mt-1 text-sm font-bold text-[#fa520f] dark:text-[#fa520f]">{confidence}%</p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#fff8e0] dark:bg-white/5 text-[#fa520f] dark:text-[#fa520f]"><Lightbulb size={20} /></span>
                </div>
              </div>
            </div>

            {/* ─── Step Content (animated) ─────────────────────── */}
            <div className={`space-y-6 transition-all duration-200 ${stepAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
              {currentStep === 1 && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name your idea</span>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this thought a working title" className={`w-full rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-3.5 text-base text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.title ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.title && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.title}</span>}
                  </label>

                  {/* ─── Contextual tip for title ─── */}
                  {!title.trim() && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/5 px-4 py-3">
                      <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400" />
                      <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                        <span className="font-semibold">Tip:</span> A good title is specific. Instead of "better app", try "AI-powered recipe planner for college students".
                      </p>
                    </div>
                  )}

                  <label className="block">
                    <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Describe your idea <span className="font-normal text-slate-400 dark:text-slate-500">{problem.length} characters</span>
                    </span>
                    <textarea value={problem} onChange={(event) => { setProblem(event.target.value); setProblemSuggestion(null); }} rows={6} placeholder="Describe the problem, the moment you noticed it, or the possibility you can't stop thinking about..." className={`w-full resize-none rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.problem ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.problem && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.problem}</span>}
                  </label>

                  {/* ─── AI Suggestion Card for Problem ─── */}
                  <AiSuggestionCard
                    suggestion={problemSuggestion}
                    isLoading={isRefiningProblem}
                    onAccept={() => acceptSuggestion("problem")}
                    onDismiss={() => dismissSuggestion("problem")}
                    label="problem description"
                  />

                  <div className="-mt-3 flex flex-wrap items-center gap-1">
                    <ComingSoonButton icon={Mic} label="Voice recording" />
                    <button
                      type="button"
                      onClick={() => handleRefine("problem")}
                      disabled={isRefiningProblem || problem.trim().length < 10}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#fa520f] dark:text-[#ff8105] transition hover:bg-[#fffaeb] dark:hover:bg-[#fa520f]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      {isRefiningProblem ? <LoaderCircle size={15} className="animate-spin" /> : <WandSparkles size={15} />}
                      {isRefiningProblem ? "Refining…" : "Refine with AI"}
                    </button>
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
                    <textarea value={solution} onChange={(event) => { setSolution(event.target.value); setSolutionSuggestion(null); }} rows={4} placeholder="How could this become useful? Don't worry about getting it right yet." className={`w-full resize-none rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.solution ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                    {errors.solution && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.solution}</span>}
                  </label>

                  {/* ─── AI Suggestion Card for Solution ─── */}
                  <AiSuggestionCard
                    suggestion={solutionSuggestion}
                    isLoading={isRefiningSolution}
                    onAccept={() => acceptSuggestion("solution")}
                    onDismiss={() => dismissSuggestion("solution")}
                    label="solution"
                  />

                  {/* ─── Refine button for solution ─── */}
                  <div className="-mt-3">
                    <button
                      type="button"
                      onClick={() => handleRefine("solution")}
                      disabled={isRefiningSolution || solution.trim().length < 10}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[#fa520f] dark:text-[#ff8105] transition hover:bg-[#fffaeb] dark:hover:bg-[#fa520f]/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      {isRefiningSolution ? <LoaderCircle size={15} className="animate-spin" /> : <WandSparkles size={15} />}
                      {isRefiningSolution ? "Refining…" : "Refine with AI"}
                    </button>
                  </div>

                  {/* ─── Contextual hint based on problem ─── */}
                  {problem.trim().length > 20 && !solution.trim() && (
                    <div className="flex items-start gap-3 rounded-xl border border-[#ededed] dark:border-white/10 bg-[#fff8e0]/60 dark:bg-[#fa520f]/5 px-4 py-3">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-[#fa520f] dark:text-[#fa520f]" />
                      <p className="text-xs leading-5 text-indigo-800 dark:text-indigo-300">
                        <span className="font-semibold">Based on your problem:</span> Think about the simplest version of a tool or experience that would eliminate the friction you described. What would the user see first?
                      </p>
                    </div>
                  )}

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">The impact you hope for <span className="font-normal text-slate-400 dark:text-slate-500">optional</span></span>
                    <textarea value={impact} onChange={(event) => setImpact(event.target.value)} rows={4} placeholder="What would a better future look like?" className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-4 py-3 text-sm leading-6 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10" />
                  </label>
                </>
              )}

              {currentStep === 3 && isCategorizing && (
                <CategorizationOverlay />
              )}

              {currentStep === 3 && !isCategorizing && (
                <>
                  {/* ─── AI-suggested banner ─── */}
                  {aiSuggestedStep3 && (
                    <div className="flex items-start gap-3 rounded-xl border border-[#e6d5a8] dark:border-[#ff8105]/20 bg-gradient-to-r from-[#fffaeb] to-[#fff8e0] dark:from-[#1a0800/20] dark:to-[#1a0800/20] px-4 py-3">
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-[#fa520f] dark:text-[#ff8105]" />
                      <div>
                        <p className="text-xs font-semibold text-[#cc3a05] dark:text-[#ffa110]">✨ AI analyzed your idea</p>
                        <p className="mt-0.5 text-xs text-[#fa520f]/80 dark:text-[#ff8105]/80">We've suggested a category, focus areas, and difficulty level based on your description. Feel free to adjust anything.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Category
                        {aiSuggestedStep3 && selectedCategory && <span className="rounded-full bg-[#fff0c2] dark:bg-[#fa520f]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fa520f] dark:text-[#ff8105]">AI suggested</span>}
                      </span>
                      <span className="relative block">
                        <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={`w-full appearance-none rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.category ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`}>
                          <option value="">Choose a category</option>
                          {categories.map((category) => <option key={category.id || category._id} value={category.id || category._id}>{category.icon} {category.name}</option>)}
                        </select>
                        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-3.5 text-slate-400 dark:text-slate-500" />
                      </span>
                      {errors.category && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.category}</span>}
                    </label>
                    <div>
                      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Starting point
                        {aiSuggestedStep3 && difficulty && <span className="rounded-full bg-[#fff0c2] dark:bg-[#fa520f]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fa520f] dark:text-[#ff8105]">AI suggested</span>}
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <button key={level} type="button" onClick={() => setDifficulty(level)} className={`min-h-[50px] rounded-xl border px-2 text-xs font-semibold transition ${difficulty === level ? "border-[#e6d5a8] dark:border-white/10 bg-[#fff8e0] dark:bg-white/5 text-[#fa520f] dark:text-[#fa520f]" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] text-slate-500 dark:text-slate-400 hover:border-[#e6d5a8] dark:hover:border-white/15"}`}>{level}</button>
                        ))}
                      </div>
                      {errors.difficulty && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.difficulty}</span>}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Focus areas
                        {aiSuggestedStep3 && selectedTags.length > 0 && <span className="rounded-full bg-[#fff0c2] dark:bg-[#fa520f]/20 px-2 py-0.5 text-[10px] font-semibold text-[#fa520f] dark:text-[#ff8105]">AI suggested</span>}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Up to 5</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => {
                        const id = tag.id || tag._id;
                        const selected = selectedTags.includes(id);
                        return <button key={id} type="button" onClick={() => toggleTag(id)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selected ? "border-[#e6d5a8] dark:border-white/10 bg-[#fff8e0] dark:bg-white/5 text-[#fa520f] dark:text-[#fa520f]" : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] text-slate-500 dark:text-slate-400 hover:border-[#e6d5a8] dark:hover:border-white/15"}`}>{selected && <Check size={13} className="mr-1 inline" />}{tag.name}</button>;
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
                <button type="button" onClick={handleNextStep} disabled={isCategorizing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fa520f] px-5 text-sm font-semibold text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none transition hover:-translate-y-0.5 hover:bg-[#cc3a05] disabled:opacity-50 disabled:hover:translate-y-0">
                  Next Step <ArrowRight size={17} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting || isCategorizing} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fa520f] px-5 text-sm font-semibold text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none transition hover:-translate-y-0.5 hover:bg-[#cc3a05] disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />}{isSubmitting ? "Publishing..." : "Publish idea"}<ArrowRight size={17} /></button>
              )}
            </div>
          </form>

          <aside className="xl:sticky xl:top-24 xl:h-fit">
            <div className="overflow-hidden rounded-[28px] border border-[#ededed] dark:border-white/10 bg-gradient-to-b from-[#fffaeb]/80 to-white dark:from-indigo-900/20 dark:to-[#120F17] shadow-[0_18px_50px_-32px_rgba(250,82,15,0.4)] dark:shadow-none transition-colors duration-500">
              <div className="border-b border-[#ededed] dark:border-white/10 bg-white/65 dark:bg-[#120F17]/65 p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-[#fa520f]/20 px-3 py-1.5 text-xs font-semibold text-[#cc3a05] dark:text-[#fa520f]">
                    <Sparkles size={15} /> Live Blueprint
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI-powered
                  </span>
                </div>
                <h2 className="font-heading mt-4 text-xl font-bold text-slate-900 dark:text-white">Your idea, taking shape.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">A live view of how your raw thought will be presented to others.</p>
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-3">
                  {blueprint.map((card) => (
                    <article key={card.label} className="rounded-2xl border border-white dark:border-white/5 bg-white/90 dark:bg-[#1a1625]/90 p-4 shadow-sm dark:shadow-none transition-colors">
                      <p className="text-xs font-bold uppercase tracking-wide text-[#fa520f] dark:text-[#fa520f]">{card.label}</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
                    </article>
                  ))}
                  {techStack && (
                    <article className="rounded-2xl border border-[#ededed] dark:border-[#ff8105]/20 bg-[#fffaeb]/60 dark:bg-white/5 p-4">
                      <p className="text-xs font-bold text-[#fa520f] dark:text-[#ff8105]">Suggested foundation</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{techStack}</p>
                    </article>
                  )}
                  {attachments.length > 0 && (
                    <article className="rounded-2xl border border-[#ededed] dark:border-white/10 bg-[#fff8e0]/60 dark:bg-white/5 p-4">
                      <p className="text-xs font-bold text-[#fa520f] dark:text-[#fa520f]">Visuals ({attachments.length})</p>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300">{attachments.map((a) => a.name).join(", ")}</p>
                    </article>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#ededed] dark:border-white/10 bg-[#fff8e0]/60 dark:bg-white/5 px-4 py-3 text-xs leading-5 text-indigo-800 dark:text-indigo-300">
              <Sparkles size={17} className="shrink-0 text-[#fa520f] dark:text-[#fa520f]" />
              Focus on capturing raw thoughts and attaching specs. The community will help iterate on the rest.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
