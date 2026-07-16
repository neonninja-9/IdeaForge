/**
 * DashboardPage
 * -------------
 * Authenticated user's personal dashboard.
 * Fetches real data from the API: stats, user's ideas.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import type { Idea } from "../types/idea.types";

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ ideasCount: 0, totalVotes: 0, totalComments: 0 });
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    ideaService
      .getDashboard()
      .then((res) => {
        setStats(res.data.stats);
        setIdeas(res.data.ideas);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 animate-spin text-vivid" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-fg-mid text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* ── Top Nav ── */}
      <nav className="bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-edge shadow-sm">
        <div className="flex justify-between items-center px-6 sm:px-8 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black tracking-tighter text-fg">IdeaForge</Link>
            <div className="hidden md:flex gap-6">
              <Link to="/explore" className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-vivid transition-colors py-5">Explore</Link>
              <Link to="/submit" className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-vivid transition-colors py-5">Submit Idea</Link>
              <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-[0.15em] text-vivid border-b-2 border-vivid py-5">Dashboard</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/submit"
              className="bg-fg hover:bg-vivid text-white text-xs font-semibold uppercase tracking-widest py-2 px-5 rounded-full transition-all duration-300"
            >
              Submit Idea
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-fg-mid hover:text-red-500 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-8 pt-24 pb-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-fg">Dashboard</h1>
          <p className="text-fg-mid mt-1">Welcome back, {user?.username}</p>
        </header>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Ideas Submitted */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-edge p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-fg-mid">Ideas Submitted</span>
              <div className="bg-surface-alt p-2 rounded-full text-vivid">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-fg">{stats.ideasCount}</span>
          </div>

          {/* Total Upvotes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-edge p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-fg-mid">Upvotes Received</span>
              <div className="bg-surface-alt p-2 rounded-full text-vivid">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-fg">{stats.totalVotes}</span>
          </div>

          {/* Total Comments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-edge p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-fg-mid">Total Comments</span>
              <div className="bg-surface-alt p-2 rounded-full text-vivid">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-fg">{stats.totalComments}</span>
          </div>
        </section>

        {/* Your Ideas */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold text-fg">Your Ideas</h2>
            <Link
              to="/submit"
              className="text-xs font-semibold uppercase tracking-wider text-vivid hover:text-vivid-hover transition-colors flex items-center gap-1"
            >
              Submit new →
            </Link>
          </div>

          {ideas.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-edge border-dashed p-12 text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-fg mb-2">No ideas yet</h3>
              <p className="text-fg-mid text-sm mb-6 max-w-md mx-auto">
                You haven't submitted any ideas yet. Share a real-world problem and your proposed solution with the community!
              </p>
              <Link
                to="/submit"
                className="inline-block bg-fg hover:bg-vivid text-white text-xs font-semibold uppercase tracking-widest py-3 px-8 rounded-full transition-all duration-300"
              >
                Submit Your First Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <Link
                  key={idea.id || idea._id}
                  to={`/idea/${idea.id || idea._id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-edge p-6 hover:border-vivid/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-vivid bg-vivid/10 px-3 py-1 rounded-full">
                      {idea.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-xs text-fg-muted">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-fg group-hover:text-vivid transition-colors mb-2 line-clamp-1">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-fg-mid line-clamp-2 mb-4">
                    {idea.problem}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-fg-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                      {idea.voteCount} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {idea.commentCount} comments
                    </span>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      idea.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                      idea.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {idea.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
