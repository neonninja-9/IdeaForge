import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FolderSearch } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import categoryService from "../../services/categoryService";
import type { Idea, Category } from "../../types/idea.types";
import { getCategoryIcon } from "../../utils/categoryIcons";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";

export default function IdeasFeedPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const hasLoadedIdeasRef = useRef(false);

  // Filters
  const [search, setSearch] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  const fetchIdeas = async (pageNum: number, isLoadMore = false) => {
    setLoadError("");
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await ideaService.getIdeas({
        q: search || undefined,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        sort,
        limit: LIMIT,
        page: pageNum,
      });
      if (isLoadMore) {
        setIdeas((prev) => {
          // Prevent duplicates by checking id
          const newIdeas = res.data.ideas.filter(
            (newIdea) => !prev.some((p) => (p.id || p._id) === (newIdea.id || newIdea._id))
          );
          return [...prev, ...newIdeas];
        });
      } else {
        setIdeas(res.data.ideas);
      }
      setTotal(res.data.total);
      hasLoadedIdeasRef.current = true;
    } catch (err) {
      console.error(err);
      setLoadError("Unable to load ideas. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchIdeas(1, false);
    
    // Update URL
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
    if (sort !== "newest") params.set("sort", sort);
    setSearchParams(params, { replace: true });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory, selectedDifficulty, sort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchIdeas(nextPage, true);
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Icons
  const GridIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  );
  
  const ListIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
  );

  return (
    <div className="min-h-[calc(100vh-76px)] bg-slate-50 dark:bg-[#090a0c] transition-colors duration-500">
      
      {/* Hero / Header */}
      <div className="bg-white dark:bg-[#120F17] border-b border-slate-200 dark:border-white/5 py-12 px-5 sm:px-8 xl:px-12 transition-colors duration-500">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Discover <span className="text-[#fa520f]">Ideas</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">
                Explore a curated list of project ideas, find your next inspiration, or collaborate with others.
              </p>
            </div>
            {user && (
              <Link to="/submit" className="shrink-0 inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#fa520f] text-white font-medium transition hover:bg-[#e0450d] hover:shadow-lg hover:shadow-[#fa520f]/20">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Post an Idea
              </Link>
            )}
          </div>
          
          {/* Main Search Bar */}
          <div className="relative max-w-3xl">
            <svg aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-14 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1a1625] py-3 pl-12 pr-12 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fa520f]/50 focus:border-transparent transition-all shadow-sm"
              placeholder="Search by keywords, tech stack, or problem..."
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 xl:px-12">
        {/* Filters & Tools */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          
          {/* Categories Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!selectedCategory ? "bg-gradient-to-r from-[#fa520f] to-[#ff8105] text-white shadow-lg shadow-[#fa520f]/20 border border-transparent" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/10 shadow-sm"}`}
            >
              All
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id || cat._id}
                onClick={() => setSelectedCategory(cat.id || cat._id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === (cat.id || cat._id) ? "bg-gradient-to-r from-[#fa520f] to-[#ff8105] text-white shadow-lg shadow-[#fa520f]/20 border border-transparent" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/10 shadow-sm"}`}
              >
                {(() => {
                  const Icon = getCategoryIcon(cat.slug);
                  return <Icon className={`w-4 h-4 ${selectedCategory === (cat.id || cat._id) ? "opacity-100" : "opacity-70"}`} />;
                })()}
                {cat.name}
              </button>
            ))}
            {categories.length > 6 && (
              <div className="relative">
                <select
                  value={selectedCategory && !categories.slice(0, 6).some(c => (c.id || c._id) === selectedCategory) ? selectedCategory : ""}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none pl-5 pr-10 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fa520f]/50 ${selectedCategory && !categories.slice(0, 6).some(c => (c.id || c._id) === selectedCategory) ? "bg-gradient-to-r from-[#fa520f] to-[#ff8105] text-white shadow-lg shadow-[#fa520f]/20 border border-transparent" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/10 shadow-sm"}`}
                >
                  <option value="" disabled>More...</option>
                  {categories.slice(6).map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                  ))}
                </select>
                <svg className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${selectedCategory && !categories.slice(0, 6).some(c => (c.id || c._id) === selectedCategory) ? "text-white" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {/* Sort & Difficulty */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300 pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#fa520f]/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="top">Top Rated</option>
                  <option value="discussed">Most Discussed</option>
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="appearance-none bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300 pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#fa520f]/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="">Any Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* View Toggles */}
            <div className="hidden sm:flex bg-white dark:bg-[#120F17] border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-sm shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && page === 1 ? (
          <PageSkeleton variant="feed" />
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">{loadError}</p>
            <button onClick={() => fetchIdeas(1)} className="mt-6 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">Try Again</button>
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-[#120F17] rounded-3xl border border-slate-200 dark:border-white/5 transition-colors duration-500">
            <FolderSearch className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No ideas found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">We couldn't find any ideas matching your current filters. Try adjusting them or clear your search.</p>
            <button
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setSelectedCategory("");
                setSelectedDifficulty("");
              }}
              className="px-6 py-3 bg-[#fa520f] text-white rounded-full text-sm font-semibold shadow-lg shadow-[#fa520f]/20 hover:bg-[#e0450d] transition"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {ideas.map((idea) => (
                <Link
                  key={idea.id || idea._id}
                  to={`/idea/${idea.id || idea._id}`}
                  className={`group relative bg-white dark:bg-[#120F17] rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 border border-slate-100 dark:border-white/5 hover:border-[#fa520f]/30 flex ${viewMode === "list" ? "flex-col sm:flex-row gap-6 items-start" : "flex-col"}`}
                >
                  <div className={`flex-1 ${viewMode === "list" ? "min-w-0" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {(() => {
                          const Icon = getCategoryIcon(idea.category?.slug);
                          return <Icon className="w-3.5 h-3.5 text-[#fa520f]" />;
                        })()}
                        {idea.category?.name || "Uncategorized"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        idea.difficulty === "Beginner" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                        idea.difficulty === "Intermediate" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {idea.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#fa520f] transition-colors line-clamp-2">
                      {idea.title}
                    </h3>
                    
                    <p className={`text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"}`}>
                      {idea.problem}
                    </p>

                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {idea.tags.slice(0, viewMode === "list" ? 5 : 3).map((tag) => (
                          <span key={tag._id} className="flex items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-full transition-colors border border-transparent dark:border-white/5">
                            <span className="text-[#fa520f]/70 mr-0.5">#</span>{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center justify-between pt-5 border-t border-slate-100 dark:border-white/5 ${viewMode === "list" ? "sm:w-48 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0 sm:flex-col sm:items-end sm:justify-center sm:h-full gap-4" : "w-full mt-auto"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#fa520f] to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {idea.author?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{idea.author?.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5 hover:text-[#fa520f] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        <span className="text-xs font-semibold">{idea.voteCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <span className="text-xs font-semibold">{idea.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {ideas.length < total && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white dark:bg-[#120F17] border border-slate-200 dark:border-white/10 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-[#fa520f]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Loading...
                    </>
                  ) : (
                    "Load More Ideas"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
