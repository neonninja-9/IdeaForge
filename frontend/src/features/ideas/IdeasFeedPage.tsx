import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FolderSearch, LayoutGrid as GridIcon, List as ListIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ideaService from "../../services/ideaService";
import categoryService from "../../services/categoryService";
import { getCategoryIcon } from "../../utils/categoryIcons";
import PageSkeleton from "../../components/PageSkeleton/PageSkeleton";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const LIMIT = 12;

export default function IdeasFeedPage() {
  const { } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";

  // Filters
  const [search, setSearch] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty);
    if (sort !== "newest") params.set("sort", sort);
    setSearchParams(params, { replace: true });
  }, [search, selectedCategory, selectedDifficulty, sort, setSearchParams]);

  // Categories query
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const categories = categoriesResponse?.data?.categories || [];

  // Ideas infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["ideas", { search, selectedCategory, selectedDifficulty, sort }],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      ideaService.getIdeas({
        q: search || undefined,
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        sort,
        limit: LIMIT,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const currentCount = allPages.reduce((sum, page) => sum + page.data.ideas.length, 0);
      return currentCount < lastPage.data.total ? allPages.length + 1 : undefined;
    },
  });

  const ideas = data?.pages.flatMap((page: any) => page.data.ideas) || [];

  // Infinite scroll observer
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-transparent">
      {/* Header/Filters section exactly as it was */}
      <div className="bg-[#0C0A09] pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#A16207]/20 blur-[120px] rounded-full opacity-50" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Discover Ideas</h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Explore problems worth solving and raw concepts submitted by builders around the world.</p>
          
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <FolderSearch className="w-5 h-5 text-slate-400 group-focus-within:text-[#A16207] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search problems, technologies, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A16207]/50 focus:border-[#A16207] transition-all"
            />
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-12 relative z-20 pb-24">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1C1917] p-2 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-white/10 mb-8">
          <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar px-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "" 
                  ? "bg-[#A16207] text-white shadow-md shadow-[#A16207]/20" 
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug 
                    ? "bg-[#A16207] text-white shadow-md shadow-[#A16207]/20" 
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {/* Sort & Difficulty */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300 pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#A16207]/50 transition-all cursor-pointer shadow-sm"
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
                  className="appearance-none bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300 pl-4 pr-10 py-2.5 rounded-full border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#A16207]/50 transition-all cursor-pointer shadow-sm"
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
            <div className="hidden sm:flex bg-white dark:bg-[#1C1917] border border-slate-200 dark:border-white/10 rounded-xl p-1 shadow-sm shrink-0">
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
        {status === "pending" ? (
          <PageSkeleton variant="feed" />
        ) : status === "error" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">{(error as Error).message}</p>
          </div>
        ) : ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-[#1C1917] rounded-3xl border border-slate-200 dark:border-white/5 transition-colors duration-500">
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
              className="px-6 py-3 bg-[#A16207] text-white rounded-full text-sm font-semibold shadow-lg shadow-[#A16207]/20 hover:bg-[#e0450d] transition"
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
                  className={`group relative bg-white dark:bg-[#1C1917] rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 border border-slate-100 dark:border-white/5 hover:border-[#A16207]/30 flex ${viewMode === "list" ? "flex-col sm:flex-row gap-6 items-start" : "flex-col"}`}
                >
                  <div className={`flex-1 ${viewMode === "list" ? "min-w-0" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {(() => {
                          const Icon = getCategoryIcon(idea.category?.slug);
                          return <Icon className="w-3.5 h-3.5 text-[#A16207]" />;
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
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#A16207] transition-colors line-clamp-2">
                      {idea.title}
                    </h3>
                    
                    <p className={`text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 ${viewMode === "grid" ? "line-clamp-3" : "line-clamp-2"}`}>
                      {idea.problem}
                    </p>

                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {idea.tags.slice(0, viewMode === "list" ? 5 : 3).map((tag: any) => (
                          <span key={tag._id} className="flex items-center text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-full transition-colors border border-transparent dark:border-white/5">
                            <span className="text-[#A16207]/70 mr-0.5">#</span>{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center justify-between pt-5 border-t border-slate-100 dark:border-white/5 ${viewMode === "list" ? "sm:w-48 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0 sm:flex-col sm:items-end sm:justify-center sm:h-full gap-4" : "w-full mt-auto"}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A16207] to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {idea.author?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{idea.author?.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5 hover:text-[#A16207] transition-colors">
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

            {/* Invisible observer element at the bottom */}
            <div ref={ref} className="h-10 mt-8" />
            
            {isFetchingNextPage && (
              <div className="mt-8 flex justify-center">
                <div className="px-8 py-3 bg-white dark:bg-[#1C1917] border border-slate-200 dark:border-white/10 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-[#A16207]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Loading more...
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
