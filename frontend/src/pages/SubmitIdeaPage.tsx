/**
 * SubmitIdeaPage
 * --------------
 * Functional form for submitting new ideas to the platform.
 * Fetches categories and tags from the API, auto-generates tech stack suggestions.
 */

import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import categoryService from "../services/categoryService";
import tagService from "../services/tagService";
import type { Category, Tag } from "../types/idea.types";

function generateTechStack(tagNames: string[], difficulty: string): string {
  const lower = tagNames.map(t => t.toLowerCase());
  let frontend = "HTML/CSS/JS";
  let backend = "Node.js + Express";
  let database = "MongoDB";

  if (lower.some(t => ["web development", "react", "typescript"].includes(t))) frontend = "React + TypeScript";
  if (lower.some(t => ["mobile app"].includes(t))) frontend = "React Native or Flutter";
  if (lower.some(t => ["ai", "machine learning", "data science", "computer vision", "nlp"].includes(t))) backend = "Python (FastAPI)";
  if (lower.some(t => ["blockchain"].includes(t))) backend = "Solidity + Hardhat";
  if (lower.some(t => ["cloud computing", "devops"].includes(t))) database = "PostgreSQL + Redis";

  if (difficulty === "Beginner") {
    return `Beginner-friendly: ${frontend}, Firebase`;
  }
  return `Frontend: ${frontend} | Backend: ${backend} | Database: ${database}`;
}

interface FormErrors {
  title?: string;
  problem?: string;
  solution?: string;
  category?: string;
  tags?: string;
  difficulty?: string;
}

export default function SubmitIdeaPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

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

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    Promise.all([
      categoryService.getCategories(),
      tagService.getTags(),
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.data.categories);
      setAllTags(tagRes.data.tags);
    }).catch(console.error);
  }, []);

  // Compute tech stack suggestion
  const selectedTagNames = allTags.filter(t => selectedTags.includes(t.id || t._id)).map(t => t.name);
  const techStack = selectedTagNames.length > 0 && difficulty ? generateTechStack(selectedTagNames, difficulty) : "";

  function toggleTag(tagId: string) {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : prev.length < 5 ? [...prev, tagId] : prev
    );
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!title.trim() || title.trim().length < 5) e.title = "Title must be at least 5 characters";
    if (!problem.trim() || problem.trim().length < 20) e.problem = "Describe the problem (at least 20 characters)";
    if (!solution.trim() || solution.trim().length < 20) e.solution = "Describe the solution (at least 20 characters)";
    if (!selectedCategory) e.category = "Select a category";
    if (selectedTags.length === 0) e.tags = "Select at least one tag";
    if (!difficulty) e.difficulty = "Select a difficulty level";
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setServerError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await ideaService.createIdea({
        title: title.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        impact: impact.trim() || undefined,
        difficulty: difficulty as "Beginner" | "Intermediate" | "Advanced",
        category: selectedCategory,
        tags: selectedTags,
        suggestedTechStack: techStack || undefined,
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      setServerError(error.message || "Failed to submit idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <svg className="w-8 h-8 animate-spin text-vivid" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ── Top Nav ── */}
      <header className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-edge shadow-sm">
        <div className="flex justify-between items-center px-6 sm:px-8 h-16 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-black tracking-tighter text-fg">IdeaForge</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/explore" className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-vivid transition-colors">Explore</Link>
            <Link to="/submit" className="text-xs font-semibold uppercase tracking-[0.15em] text-vivid border-b-2 border-vivid py-5">Submit Idea</Link>
            <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-vivid transition-colors">Dashboard</Link>
          </div>
          <Link to="/dashboard" className="text-xs font-semibold text-fg-mid hover:text-vivid transition-colors">{user?.username}</Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-3xl font-black tracking-tight text-fg mb-3">Submit Your Idea</h1>
          <p className="text-fg-mid text-base">Share a real-world problem and your proposed solution with the community</p>
        </div>

        <div className="w-full max-w-[720px] bg-white/90 backdrop-blur-xl rounded-2xl border border-edge shadow-lg p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-vivid/10 rounded-full blur-[80px] pointer-events-none" />

          {serverError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-2">Idea Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-Based Crop Disease Detection"
                className={`w-full px-5 py-3.5 bg-surface-alt border rounded-xl text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all ${errors.title ? "border-red-400 focus:ring-red-300" : "border-edge focus:ring-vivid/30 focus:border-vivid"}`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-2">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-5 py-3.5 bg-surface-alt border rounded-xl text-sm text-fg focus:outline-none focus:ring-2 transition-all cursor-pointer ${errors.category ? "border-red-400 focus:ring-red-300" : "border-edge focus:ring-vivid/30 focus:border-vivid"}`}
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            </div>

            {/* Problem */}
            <div>
              <label htmlFor="problem" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-2">The Problem</label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={4}
                placeholder="Describe the real-world problem this idea solves..."
                className={`w-full px-5 py-3.5 bg-surface-alt border rounded-xl text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all resize-none ${errors.problem ? "border-red-400 focus:ring-red-300" : "border-edge focus:ring-vivid/30 focus:border-vivid"}`}
              />
              {errors.problem && <p className="mt-1 text-xs text-red-500">{errors.problem}</p>}
            </div>

            {/* Solution */}
            <div>
              <label htmlFor="solution" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-2">Proposed Solution</label>
              <textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                rows={4}
                placeholder="Describe your proposed approach or concept..."
                className={`w-full px-5 py-3.5 bg-surface-alt border rounded-xl text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 transition-all resize-none ${errors.solution ? "border-red-400 focus:ring-red-300" : "border-edge focus:ring-vivid/30 focus:border-vivid"}`}
              />
              {errors.solution && <p className="mt-1 text-xs text-red-500">{errors.solution}</p>}
            </div>

            {/* Impact */}
            <div>
              <label htmlFor="impact" className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-2">Expected Impact <span className="text-fg-muted">(optional)</span></label>
              <textarea
                id="impact"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                rows={2}
                placeholder="What impact could this project have?"
                className="w-full px-5 py-3.5 bg-surface-alt border border-edge rounded-xl text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-vivid/30 focus:border-vivid transition-all resize-none"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-3">Difficulty Level</label>
              <div className="flex gap-3">
                {["Beginner", "Intermediate", "Advanced"].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      difficulty === level
                        ? level === "Beginner" ? "bg-green-50 border-green-400 text-green-700" :
                          level === "Intermediate" ? "bg-yellow-50 border-yellow-400 text-yellow-700" :
                          "bg-red-50 border-red-400 text-red-700"
                        : "bg-surface-alt border-edge text-fg-mid hover:border-vivid/30"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {errors.difficulty && <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-3">Tags <span className="text-fg-muted">(select up to 5)</span></label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag.id || tag._id);
                  return (
                    <button
                      key={tag.id || tag._id}
                      type="button"
                      onClick={() => toggleTag(tag.id || tag._id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-vivid/10 border-vivid text-vivid"
                          : "bg-surface-alt border-edge text-fg-mid hover:border-vivid/30"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
              {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags}</p>}
            </div>

            {/* Tech Stack Suggestion */}
            {techStack && (
              <div className="p-4 rounded-xl bg-vivid/5 border border-vivid/20">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-vivid mb-2">💡 Suggested Tech Stack</p>
                <p className="text-sm text-fg-mid">{techStack}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full overflow-hidden min-h-12 rounded-xl bg-fg text-white text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_40px_rgba(108,60,224,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit Idea"}
              </span>
              <span className="absolute inset-0 bg-vivid translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
