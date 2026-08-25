import { useEffect, useState } from "react";
import { Heart, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import favoriteService from "../services/favoriteService";
import type { Idea } from "../types/idea.types";

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
                className="rounded-[28px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none transition hover:-translate-y-0.5 hover:border-rose-200 dark:hover:border-rose-500/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
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
          <section className="mt-9 rounded-[30px] border border-dashed border-rose-200 dark:border-rose-500/20 bg-white dark:bg-[#120F17] px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400">
              <Heart size={25} />
            </span>
            <h2 className="font-heading mt-5 text-xl font-bold text-slate-900 dark:text-white">No favorites yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Open an idea and use the heart button to save it here.</p>
            <Link to="/explore" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">
              <Lightbulb size={17} /> Explore ideas
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
