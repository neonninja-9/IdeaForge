import { useEffect, useState } from "react";
import { Heart, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import favoriteService from "../../services/favoriteService";
import type { Idea } from "../../types/idea.types";

export default function FavoritesPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoriteService.getFavorites({ populate: true })
      .then((res) => {
        setIdeas(res.data.ideas || []);
      })
      .catch((err) => {
        console.error("Failed to load favorites:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent px-5 py-7 sm:px-8 sm:py-10 xl:px-12 transition-colors duration-500">
      <main className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">FAVORITES</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Ideas worth returning to.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">Keep promising ideas in one dedicated place, separate from community exploration.</p>
        </header>

        {loading ? (
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <div className="h-52 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
            <div className="h-52 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
          </div>
        ) : ideas.length ? (
          <section className="mt-9 grid gap-5 md:grid-cols-2">
            {ideas.map((idea) => (
              <Link
                key={idea.id || idea._id}
                to={`/idea/${idea.id || idea._id}`}
                className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#1C1917] p-6 shadow-sm dark:shadow-none transition hover:-translate-y-0.5 hover:border-rose-200 dark:hover:border-rose-500/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FEF3C7] dark:bg-white/5 px-3 py-1 text-xs font-semibold text-[#A16207] dark:text-[#A16207]">
                    {idea.category?.name || "Uncategorized"}
                  </span>
                  <Heart size={18} className="fill-rose-500 text-rose-500" />
                </div>
                <h2 className="font-heading mt-6 text-xl font-bold text-slate-900 dark:text-white">{idea.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{idea.problem}</p>
                <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">{idea.voteCount || 0} votes · {idea.commentCount || 0} comments</p>
              </Link>
            ))}
          </section>
        ) : (
          <section className="mt-9 rounded-[30px] border border-dashed border-rose-200 dark:border-rose-500/20 bg-white dark:bg-[#1C1917] px-6 py-20 text-center flex flex-col items-center justify-center">
            {/* Custom SVG Illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
              <circle cx="60" cy="60" r="40" fill="url(#heartGlow)" fillOpacity="0.2" />
              <path d="M60 40C60 40 50 30 40 30C30 30 24 38 24 48C24 64 60 84 60 84C60 84 96 64 96 48C96 38 90 30 80 30C70 30 60 40 60 40Z" stroke="currentColor" className="text-rose-200 dark:text-rose-500/20" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 48C60 48 53 41 46 41C39 41 35 46.5 35 53.5C35 64.5 60 78.5 60 78.5C60 78.5 85 64.5 85 53.5C85 46.5 81 41 74 41C67 41 60 48 60 48Z" fill="#f43f5e" />
              <defs>
                <radialGradient id="heartGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(40)">
                  <stop stopColor="#f43f5e" />
                  <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            <h2 className="font-heading mt-5 text-xl font-bold text-slate-900 dark:text-white">No favorites yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Open an idea and use the heart button to save it here.</p>
            <Link to="/explore" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#A16207] px-4 text-sm font-semibold text-white hover:bg-[#854D0E]">
              <Lightbulb size={17} /> Explore ideas
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
