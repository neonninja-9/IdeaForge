"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Category, Tag } from "@prisma/client";

interface ExploreFiltersProps {
  categories: Category[];
  tags: Tag[];
}

export default function ExploreFilters({ categories, tags }: ExploreFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentDifficulty = searchParams.get("difficulty") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Always reset to page 1 if we had pagination, but we don't yet
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    router.push(pathname + "?" + createQueryString("q", q));
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="mb-10 bg-white border border-edge rounded-2xl p-6 shadow-sm">
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={currentQ}
            placeholder="Search ideas by title or problem..."
            aria-label="Search ideas"
            className="w-full pl-12 pr-4 py-3 bg-surface-alt border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 focus:border-vivid transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-fg text-fg-on-dark font-medium rounded-xl hover:bg-vivid transition-colors whitespace-nowrap"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          aria-label="Toggle filters"
          aria-expanded={isFiltersOpen}
          className="md:hidden px-4 py-3 bg-surface-alt border border-edge text-fg font-medium rounded-xl flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </form>

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300 ${isFiltersOpen ? "block" : "hidden md:grid"}`}>
        <select
          value={currentCategory}
          onChange={(e) => router.push(pathname + "?" + createQueryString("category", e.target.value))}
          aria-label="Filter by category"
          className="w-full px-4 py-2.5 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={currentTag}
          onChange={(e) => router.push(pathname + "?" + createQueryString("tag", e.target.value))}
          aria-label="Filter by tag"
          className="w-full px-4 py-2.5 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug}>{t.name}</option>
          ))}
        </select>

        <select
          value={currentDifficulty}
          onChange={(e) => router.push(pathname + "?" + createQueryString("difficulty", e.target.value))}
          aria-label="Filter by difficulty"
          className="w-full px-4 py-2.5 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
        >
          <option value="">Any Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={currentSort}
          onChange={(e) => router.push(pathname + "?" + createQueryString("sort", e.target.value))}
          aria-label="Sort ideas"
          className="w-full px-4 py-2.5 bg-surface border border-edge rounded-xl focus:outline-none focus:ring-2 focus:ring-vivid/50 appearance-none"
        >
          <option value="newest">Newest First</option>
          <option value="top">Top Voted</option>
          <option value="discussed">Most Discussed</option>
        </select>
      </div>

      {(currentQ || currentCategory || currentTag || currentDifficulty || currentSort !== "newest") && (
        <div className="mt-6 pt-4 border-t border-edge flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-fg-muted hover:text-fg transition-colors flex items-center gap-2"
          >
            Clear all filters
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
