import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import categoryService from "../../services/categoryService";
import tagService from "../../services/tagService";
import type { Category, Tag, Attachment } from "../../types/idea.types";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import AttachmentUploader from "../../components/AttachmentUploader/AttachmentUploader";

interface FormErrors { title?: string; problem?: string; solution?: string; category?: string; tags?: string; difficulty?: string; }

export default function EditIdeaPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(true);
  const [ideaLoading, setIdeaLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [impact, setImpact] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [ideaStatus, setIdeaStatus] = useState<"draft" | "published">("published");
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/login"); }, [user, authLoading, navigate]);
  
  useEffect(() => {
    Promise.all([categoryService.getCategories(), tagService.getTags()])
      .then(([categoryResponse, tagResponse]) => { setCategories(categoryResponse.data.categories); setAllTags(tagResponse.data.tags); })
      .catch(console.error)
      .finally(() => setReferenceLoading(false));
  }, []);

  useEffect(() => {
    if (!id) return;
    ideaService.getIdeaById(id).then((res) => {
      const idea = res.data.idea;
      setTitle(idea.title);
      setProblem(idea.problem);
      setSolution(idea.solution);
      setImpact(idea.impact || "");
      setDifficulty(idea.difficulty);
      setSelectedCategory(idea.category?.id || (idea.category as any)?._id || "");
      setSelectedTags(idea.tags?.map((t) => t.id || (t as any)._id) || []);
      setAttachments(idea.attachments || []);
      setIdeaStatus(idea.status || "published");
    }).catch(() => {
      setServerError("Failed to load idea.");
    }).finally(() => setIdeaLoading(false));
  }, [id]);

  function toggleTag(tagId: string) { setSelectedTags((current) => current.includes(tagId) ? current.filter((id) => id !== tagId) : current.length < 5 ? [...current, tagId] : current); }
  
  function validate(): FormErrors {
    const next: FormErrors = {};
    if (title.trim().length < 3) next.title = "Give your idea a title of at least 3 characters.";
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
      if (id) {
        await ideaService.updateIdea(id, {
          title: title.trim(),
          problem: problem.trim(),
          solution: solution.trim(),
          impact: impact.trim() || undefined,
          difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced",
          category: selectedCategory || undefined,
          tags: selectedTags,
          status: ideaStatus,
          attachments,
        });
        navigate(`/idea/${id}`);
      }
    } catch (error) { setServerError(error instanceof Error ? error.message : "We couldn't update your idea. Please try again."); }
    finally { setIsSubmitting(false); }
  }

  async function handlePublishDraft(event: FormEvent) {
    event.preventDefault(); setServerError("");
    const nextErrors = validate(); setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    setIsSubmitting(true);
    try {
      if (id) {
        await ideaService.updateIdea(id, {
          title: title.trim(),
          problem: problem.trim(),
          solution: solution.trim(),
          impact: impact.trim() || undefined,
          difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced",
          category: selectedCategory || undefined,
          tags: selectedTags,
          status: "published",
          attachments,
        });
        navigate(`/idea/${id}`);
      }
    } catch (error) { setServerError(error instanceof Error ? error.message : "We couldn't publish your idea. Please try again."); }
    finally { setIsSubmitting(false); }
  }

  if (authLoading || referenceLoading || ideaLoading) return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500"><PageSkeleton variant="form" /></div>;

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft size={18} /> Back
          </button>
          {ideaStatus === "draft" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-300/30">
              Draft
            </span>
          )}
        </div>
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-[#fa520f] dark:text-[#fa520f]">EDIT IDEA</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Refine your thought.</h1>
        </div>

        <div className="grid gap-8 xl:grid-cols-1 max-w-3xl">
          <form onSubmit={handleSubmit} noValidate className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.32)] dark:shadow-none sm:p-8 transition-colors duration-500">
            {serverError && <div className="mb-6 rounded-2xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">{serverError}</div>}
            <div className="mt-7 space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name your idea</span>
                <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give this thought a working title" className={`w-full rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-3.5 text-base text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.title ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                {errors.title && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.title}</span>}
              </label>

              <label className="block">
                <span className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Describe your idea <span className="font-normal text-slate-400 dark:text-slate-500">{problem.length} characters</span>
                </span>
                <textarea value={problem} onChange={(event) => setProblem(event.target.value)} rows={7} placeholder="Describe the problem..." className={`w-full resize-none rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.problem ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                {errors.problem && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.problem}</span>}
              </label>

              {/* Attachments Section */}
              <AttachmentUploader
                attachments={attachments}
                onChange={setAttachments}
                maxFiles={5}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">A possible first solution</span>
                <textarea value={solution} onChange={(event) => setSolution(event.target.value)} rows={4} placeholder="How could this become useful?" className={`w-full resize-none rounded-2xl border bg-white dark:bg-[#1a1625] px-4 py-4 text-base leading-7 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10 ${errors.solution ? "border-rose-300 dark:border-rose-500/50" : "border-slate-200 dark:border-white/10"}`} />
                {errors.solution && <span className="mt-1.5 block text-xs text-rose-600 dark:text-rose-400">{errors.solution}</span>}
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</span>
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
                  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Starting point</span>
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
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Focus areas</span>
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

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">The impact you hope for <span className="font-normal text-slate-400 dark:text-slate-500">optional</span></span>
                <textarea value={impact} onChange={(event) => setImpact(event.target.value)} rows={2} placeholder="What would a better future look like?" className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-4 py-3 text-sm leading-6 text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#fa520f] dark:focus:border-[#fa520f]/50 focus:ring-4 focus:ring-[#fff8e0] dark:focus:ring-[#fff8e0]0/10" />
              </label>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-white/10 pt-6 sm:flex-row sm:justify-end">
              {ideaStatus === "draft" && (
                <button type="button" onClick={handlePublishDraft} disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-60">Publish now</button>
              )}
              <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#fa520f] px-5 text-sm font-semibold text-white shadow-lg shadow-[#fa520f1a] dark:shadow-none transition hover:-translate-y-0.5 hover:bg-[#cc3a05] disabled:opacity-60">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />}{isSubmitting ? "Updating idea..." : "Save changes"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
