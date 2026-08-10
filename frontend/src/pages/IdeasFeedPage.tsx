/**
 * IdeasFeedPage (Explore)
 * -----------------------
 * Browse, search, and filter all ideas from the community.
 * Fetches real data from the API.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import categoryService from "../services/categoryService";
import type { Idea, Category } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";

export default function IdeasFeedPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasLoadedIdeas, setHasLoadedIdeas] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [total, setTotal] = useState(0);
  const hasLoadedIdeasRef = useRef(false);

  // Filters
  const [search, setSearch] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const controller = new AbortController();
    categoryService
      .getCategories({ signal: controller.signal })
      .then((res) => setCategories(res.data.categories))
      .catch((err) => {
        if ((err as Error).name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadIdeas = async () => {
      setLoadError("");
      if (hasLoadedIdeasRef.current) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await ideaService.getIdeas(
          {
            q: search || undefined,
            category: selectedCategory || undefined,
            difficulty: selectedDifficulty || undefined,
            sort,
            limit: 24,
          },
          { signal: controller.signal }
        );
        setIdeas(res.data.ideas);
        setTotal(res.data.total);
        hasLoadedIdeasRef.current = true;
        setHasLoadedIdeas(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setLoadError("Unable to load ideas. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    loadIdeas();
    return () => controller.abort();
  }, [search, selectedCategory, selectedDifficulty, sort]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(queryFromUrl);
  useEffect(() => {
    setSearch(queryFromUrl);
    setSearchInput(queryFromUrl);
  }, [queryFromUrl]);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent transition-colors duration-500">
      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10 xl:px-12">
        <header className="mb-8">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">COMMUNITY IDEAS</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Explore what people are building.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">Find a promising thread, add your perspective, or turn one into your next experiment.</p>
        </header>

        <section className="mb-10 rounded-[26px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-sm dark:shadow-none sm:p-6 transition-colors">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <svg aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                aria-label="Search ideas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full min-h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-[#fcfcfd] dark:bg-[#1a1625] py-2.5 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30"
                placeholder="Search ideas..."
              />
            </div>

            {/* Category Dropdown */}
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 md:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              aria-label="Filter by difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 md:w-40"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Dropdown */}
            <select
              aria-label="Sort ideas by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="min-h-12 w-full cursor-pointer rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1625] px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 md:ml-auto md:w-40"
            >
              <option value="newest">Newest</option>
              <option value="top">Most Voted</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {total} idea{total !== 1 ? "s" : ""} found
            {refreshing && <span className="ml-2 text-indigo-500 dark:text-indigo-400">Updating...</span>}
          </p>
          {loadError && hasLoadedIdeas && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">{loadError}</p>
          )}
        </section>

        {/* Ideas Grid */}
        {loadError && !hasLoadedIdeas ? (
          <div className="rounded-[28px] border border-red-100 dark:border-red-500/20 bg-white dark:bg-[#120F17] p-10 text-center text-sm text-red-600 dark:text-red-400 shadow-sm dark:shadow-none">
            {loadError}
          </div>
        ) : loading || !hasLoadedIdeas ? (
          <PageSkeleton variant="feed" />
        ) : ideas.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-indigo-200 dark:border-indigo-500/20 bg-white dark:bg-[#120F17] p-16 text-center shadow-sm dark:shadow-none">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-heading mb-2 text-xl font-bold text-slate-900 dark:text-white">No ideas found</h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {search || selectedCategory || selectedDifficulty
                ? "Try adjusting your filters or search query."
                : "Be the first to share a project idea with the community!"}
            </p>
            {user && (
              <Link
                to="/submit"
                className="inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Submit an Idea
              </Link>
            )}
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${refreshing ? "opacity-60" : "opacity-100"}`}>
            {ideas.map((idea) => (
              <Link
                key={idea.id || idea._id}
                to={`/idea/${idea.id || idea._id}`}
                className="group flex flex-col rounded-[24px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-lg"
              >
                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                    {idea.category?.name || "Uncategorized"}
                  </span>
                  <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                  {idea.title}
                </h3>

                {/* Problem excerpt */}
                <p className="mb-4 flex-grow text-sm leading-6 text-slate-500 dark:text-slate-400 line-clamp-3">
                  {idea.problem}
                </p>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {idea.tags.slice(0, 3).map((tag) => (
                      <span key={tag._id} className="rounded-full bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {tag.name}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">+{idea.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Footer: Author, Votes, Comments, Difficulty */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4 text-xs text-slate-400 dark:text-slate-500">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{idea.author?.username}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      {idea.voteCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {idea.commentCount}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      idea.difficulty === "Beginner" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      idea.difficulty === "Intermediate" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}>
                      {idea.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
