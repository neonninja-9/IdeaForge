/**
 * IdeasFeedPage (Explore)
 * -----------------------
 * Browse, search, and filter all ideas from the community.
 * Fetches real data from the API.
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import categoryService from "../services/categoryService";
import type { Idea, Category } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton";

export default function IdeasFeedPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ideaService.getIdeas({
        q: search || undefined,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        sort,
      });
      setIdeas(res.data.ideas);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedDifficulty, sort]);

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data.categories)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-alt">
      {/* ── Main Content ── */}
      <main className="py-10 sm:py-14 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <section className="mb-10 p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-edge">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-alt border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/30 focus:border-vivid/50 text-sm transition-all text-fg placeholder:text-fg-muted"
                placeholder="Search ideas..."
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-2.5 bg-white border border-edge rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vivid/30 text-fg cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full md:w-40 px-4 py-2.5 bg-white border border-edge rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vivid/30 text-fg cursor-pointer"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-40 ml-auto px-4 py-2.5 bg-white border border-edge rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-vivid/30 text-fg cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="top">Most Voted</option>
              <option value="discussed">Most Discussed</option>
            </select>
          </div>
          <p className="text-xs text-fg-muted">{total} idea{total !== 1 ? "s" : ""} found</p>
        </section>

        {/* Ideas Grid */}
        {loading ? (
          <PageSkeleton variant="feed" />
        ) : ideas.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-edge border-dashed p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-fg mb-2">No ideas found</h3>
            <p className="text-fg-mid text-sm mb-6 max-w-md mx-auto">
              {search || selectedCategory || selectedDifficulty
                ? "Try adjusting your filters or search query."
                : "Be the first to share a project idea with the community!"}
            </p>
            {user && (
              <Link
                to="/submit"
                className="inline-block bg-fg hover:bg-vivid text-white text-xs font-semibold uppercase tracking-widest py-3 px-8 rounded-full transition-all duration-300"
              >
                Submit an Idea
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <Link
                key={idea.id || idea._id}
                to={`/idea/${idea.id || idea._id}`}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-edge p-6 hover:border-vivid/40 hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-vivid bg-vivid/10 px-3 py-1 rounded-full">
                    {idea.category?.name || "Uncategorized"}
                  </span>
                  <span className="text-[10px] text-fg-muted ml-auto">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-fg group-hover:text-vivid transition-colors mb-2 line-clamp-2">
                  {idea.title}
                </h3>

                {/* Problem excerpt */}
                <p className="text-sm text-fg-mid line-clamp-3 mb-4 flex-grow">
                  {idea.problem}
                </p>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {idea.tags.slice(0, 3).map((tag) => (
                      <span key={tag._id} className="text-[10px] font-medium text-fg-mid bg-surface-alt px-2 py-0.5 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                    {idea.tags.length > 3 && (
                      <span className="text-[10px] font-medium text-fg-muted">+{idea.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Footer: Author, Votes, Comments, Difficulty */}
                <div className="flex items-center justify-between pt-4 border-t border-edge/50 text-xs text-fg-muted">
                  <span className="font-medium text-fg-mid">{idea.author?.username}</span>
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
                      idea.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                      idea.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
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
