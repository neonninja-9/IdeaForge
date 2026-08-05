import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import type { Idea } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton/PageSkeleton";

export default function UserProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
  }, [isLoading, navigate, user]);

  useEffect(() => {
    if (!user) return;
    ideaService
      .getMyIdeas()
      .then((response) => setIdeas(response.data.ideas))
      .catch(console.error)
      .finally(() => setLoadingIdeas(false));
  }, [user]);

  if (isLoading || !user) {
    return <div className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent"><PageSkeleton variant="profile" /></div>;
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + (idea.voteCount || 0), 0);
  const initial = user.username.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[var(--background)] dark:bg-transparent py-7 sm:py-10 transition-colors duration-500">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 xl:px-12">
        <section className="relative overflow-hidden rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-6 shadow-sm dark:shadow-none sm:p-9 transition-colors">
          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-indigo-100/70 dark:bg-indigo-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-black text-white shadow-lg shadow-indigo-200 dark:shadow-none">{initial}</div>
              <div>
                <p className="mb-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">YOUR PROFILE</p>
                <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{user.username}</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/settings" className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 transition hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-white" aria-label="Open settings">
                <Settings size={18} />
              </Link>
              <Link to="/submit" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-200 dark:shadow-none transition-colors hover:bg-indigo-700">
                Submit an idea
              </Link>
            </div>
          </div>
          <dl className="relative mt-8 grid grid-cols-3 border-t border-slate-100 dark:border-white/5 pt-6">
            <div>
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">IDEAS</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loadingIdeas ? "—" : ideas.length}</dd>
            </div>
            <div className="border-x border-slate-100 dark:border-white/5 px-5 sm:px-8">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">VOTES EARNED</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{loadingIdeas ? "—" : totalVotes}</dd>
            </div>
            <div className="pl-5 sm:pl-8">
              <dt className="text-[10px] font-semibold tracking-[0.16em] text-slate-400 dark:text-slate-500">MEMBER SINCE</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">Your ideas</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Everything you have shared with the community.</p>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Dashboard &rarr;</Link>
          </div>
          {loadingIdeas ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-44 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
              <div className="h-44 animate-pulse rounded-3xl bg-slate-200 dark:bg-white/5" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-indigo-200 dark:border-indigo-500/20 bg-white dark:bg-[#120F17] p-10 text-center">
              <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">Your first idea starts here.</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Share a problem you care about and turn it into a project.</p>
              <Link to="/submit" className="mt-5 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Create an idea &rarr;</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {ideas.map((idea) => (
                <Link
                  key={idea.id || idea._id}
                  to={`/idea/${idea.id || idea._id}`}
                  className="group rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-[#120F17] p-5 shadow-sm dark:shadow-none transition-all hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md"
                >
                  <p className="text-[10px] font-bold tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{idea.category?.name || "Uncategorized"}</p>
                  <h3 className="mt-2 font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{idea.title}</h3>
                  <div className="mt-4 flex gap-4 text-xs text-slate-400 dark:text-slate-500">
                    <span>↑ {idea.voteCount || 0} votes</span>
                    <span>{idea.commentCount || 0} comments</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
