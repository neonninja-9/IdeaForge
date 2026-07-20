import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import type { Idea } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton";

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
      .getDashboard()
      .then((response) => setIdeas(response.data.ideas))
      .catch(console.error)
      .finally(() => setLoadingIdeas(false));
  }, [user]);

  if (isLoading || !user) {
    return <div className="min-h-[calc(100vh-4rem)] bg-surface-alt"><PageSkeleton variant="profile" /></div>;
  }

  const totalVotes = ideas.reduce((sum, idea) => sum + (idea.voteCount || 0), 0);
  const initial = user.username.slice(0, 1).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-surface-alt py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-edge bg-white p-6 sm:p-9 shadow-sm">
          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-vivid/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-vivid text-2xl font-black text-white shadow-lg shadow-vivid/20">{initial}</div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-vivid">Your profile</p>
                <h1 className="text-2xl font-black tracking-tight text-fg sm:text-3xl">{user.username}</h1>
                <p className="mt-1 text-sm text-fg-mid">{user.email}</p>
              </div>
            </div>
            <Link to="/submit" className="inline-flex min-h-11 items-center justify-center rounded-full bg-fg px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-vivid">Submit an idea</Link>
          </div>
          <dl className="relative mt-8 grid grid-cols-3 border-t border-edge pt-6">
            <div><dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">Ideas</dt><dd className="mt-1 text-2xl font-black text-fg">{loadingIdeas ? "—" : ideas.length}</dd></div>
            <div className="border-x border-edge px-5 sm:px-8"><dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">Votes earned</dt><dd className="mt-1 text-2xl font-black text-fg">{loadingIdeas ? "—" : totalVotes}</dd></div>
            <div className="pl-5 sm:pl-8"><dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">Member since</dt><dd className="mt-2 text-sm font-semibold text-fg">{new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</dd></div>
          </dl>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4"><div><h2 className="text-xl font-black tracking-tight text-fg">Your ideas</h2><p className="mt-1 text-sm text-fg-mid">Everything you have shared with the community.</p></div><Link to="/dashboard" className="text-xs font-semibold uppercase tracking-[0.12em] text-vivid hover:text-vivid-hover">Dashboard →</Link></div>
          {loadingIdeas ? <div className="grid gap-4 sm:grid-cols-2"><div className="h-44 animate-pulse rounded-2xl bg-edge/60" /><div className="h-44 animate-pulse rounded-2xl bg-edge/60" /></div> : ideas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-edge bg-white p-10 text-center"><p className="text-lg font-bold text-fg">Your first idea starts here.</p><p className="mt-2 text-sm text-fg-mid">Share a problem you care about and turn it into a project.</p><Link to="/submit" className="mt-5 inline-block text-sm font-semibold text-vivid hover:text-vivid-hover">Create an idea →</Link></div>
          ) : <div className="grid gap-4 sm:grid-cols-2">{ideas.map((idea) => <Link key={idea.id || idea._id} to={`/idea/${idea.id || idea._id}`} className="group rounded-2xl border border-edge bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-vivid/40 hover:shadow-md"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-vivid">{idea.category?.name || "Uncategorized"}</p><h3 className="mt-2 font-bold text-fg group-hover:text-vivid">{idea.title}</h3><div className="mt-4 flex gap-4 text-xs text-fg-muted"><span>↑ {idea.voteCount || 0} votes</span><span>{idea.commentCount || 0} comments</span></div></Link>)}</div>}
        </section>
      </div>
    </main>
  );
}
