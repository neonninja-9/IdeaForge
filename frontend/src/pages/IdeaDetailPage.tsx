/**
 * IdeaDetailPage
 * --------------
 * Full detail view of a single idea with comments, voting, and tech stack.
 * Fetches real data from the API.
 */

import { useState, useEffect, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ideaService from "../services/ideaService";
import commentService from "../services/commentService";
import voteService from "../services/voteService";
import type { Idea, Comment } from "../types/idea.types";
import PageSkeleton from "../components/PageSkeleton";

export default function IdeaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Voting state
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [voting, setVoting] = useState(false);

  // Comment form
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      ideaService.getIdeaById(id),
      commentService.getComments(id),
    ])
      .then(([ideaRes, commentsRes]) => {
        setIdea(ideaRes.data.idea);
        setHasVoted(ideaRes.data.idea.hasVoted || false);
        setVoteCount(ideaRes.data.idea.voteCount);
        setComments(commentsRes.data.comments);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleVote() {
    if (!user) return navigate("/login");
    if (!id || voting) return;

    setVoting(true);
    try {
      const res = await voteService.toggleVote(id);
      setHasVoted(res.data.voted);
      setVoteCount(res.data.voteCount);
    } catch (err) {
      console.error(err);
    } finally {
      setVoting(false);
    }
  }

  async function handleCommentSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!user) return navigate("/login");
    if (!id || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await commentService.addComment(id, commentText.trim());
      setComments(prev => [...prev, res.data.comment]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(c => (c.id || c._id) !== commentId));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-alt"><PageSkeleton variant="detail" /></div>
    );
  }

  if (error || !idea) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt gap-4">
        <p className="text-lg text-fg-mid">{error || "Idea not found"}</p>
        <Link to="/explore" className="text-vivid hover:text-vivid-hover text-sm font-semibold">← Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-alt">
      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-fg-muted uppercase tracking-wider mb-8">
          <Link to="/explore" className="hover:text-vivid transition-colors">Explore</Link>
          <span>›</span>
          <span className="hover:text-vivid transition-colors">{idea.category?.name}</span>
          <span>›</span>
          <span className="text-fg-mid">{idea.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ── Left Column ── */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header */}
            <header className="space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1 bg-vivid/10 text-vivid font-bold uppercase tracking-widest rounded-full text-xs">
                  {idea.category?.name}
                </span>
                <span className="text-fg-muted">
                  {new Date(idea.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-fg">
                {idea.title}
              </h1>

              <div className="flex items-center justify-between py-4 border-y border-edge/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vivid/10 flex items-center justify-center text-vivid font-bold text-sm">
                    {idea.author?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-fg text-sm">{idea.author?.username}</div>
                    <div className="text-xs text-fg-muted uppercase tracking-wider">Author</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  idea.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                  idea.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {idea.difficulty}
                </span>
              </div>
            </header>

            {/* Content Body */}
            <article className="space-y-8 text-base text-fg-mid leading-relaxed">
              {/* The Problem */}
              <section>
                <h2 className="text-lg font-bold text-fg mb-3 flex items-center gap-2">
                  <span className="text-red-500">⚡</span> The Problem
                </h2>
                <p className="whitespace-pre-wrap">{idea.problem}</p>
              </section>

              {/* Proposed Solution */}
              <section>
                <h2 className="text-lg font-bold text-fg mb-3 flex items-center gap-2">
                  <span className="text-green-500">💡</span> Proposed Solution
                </h2>
                <p className="whitespace-pre-wrap">{idea.solution}</p>
              </section>

              {/* Impact */}
              {idea.impact && (
                <section>
                  <h2 className="text-lg font-bold text-fg mb-3 flex items-center gap-2">
                    <span className="text-blue-500">🎯</span> Expected Impact
                  </h2>
                  <p className="whitespace-pre-wrap">{idea.impact}</p>
                </section>
              )}

              {/* Tech Stack */}
              {idea.suggestedTechStack && (
                <section className="p-5 rounded-xl bg-vivid/5 border border-vivid/20">
                  <h2 className="text-sm font-bold text-vivid mb-2 uppercase tracking-wider">🛠️ Suggested Tech Stack</h2>
                  <p className="text-sm text-fg-mid">{idea.suggestedTechStack}</p>
                </section>
              )}
            </article>

            {/* Comments Section */}
            <section className="border-t border-edge pt-10">
              <h2 className="text-lg font-bold text-fg mb-6">
                Discussion ({comments.length})
              </h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-vivid/10 flex-shrink-0 flex items-center justify-center text-vivid font-bold text-xs">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        placeholder="Share your thoughts, suggest improvements, or discuss implementation..."
                        className="w-full px-4 py-3 bg-surface-alt border border-edge rounded-xl text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-vivid/30 focus:border-vivid transition-all resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={submittingComment || !commentText.trim()}
                          className="bg-fg text-white text-xs font-semibold uppercase tracking-widest py-2 px-6 rounded-full hover:bg-vivid transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {submittingComment ? "Posting..." : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 rounded-xl bg-surface-alt border border-edge text-center">
                  <p className="text-sm text-fg-mid">
                    <Link to="/login" className="text-vivid font-semibold hover:text-vivid-hover">Sign in</Link> to join the discussion.
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-fg-muted text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id || comment._id} className="flex gap-3 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-surface-alt flex-shrink-0 flex items-center justify-center text-fg-mid font-bold text-xs">
                        {comment.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-fg">{comment.user?.username}</span>
                          <span className="text-xs text-fg-muted">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {user && comment.user?._id === user.id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id || comment._id)}
                              className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-fg-mid">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Vote Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-edge p-6 sticky top-24">
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-fg mb-1">{voteCount}</div>
                <p className="text-xs text-fg-muted uppercase tracking-wider">Upvotes</p>
              </div>
              <button
                onClick={handleVote}
                disabled={voting}
                className={`w-full py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                  hasVoted
                    ? "bg-vivid text-white hover:bg-vivid-hover"
                    : "bg-surface-alt border border-edge text-fg hover:border-vivid hover:text-vivid"
                }`}
              >
                {voting ? "..." : hasVoted ? "★ Upvoted" : "↑ Upvote"}
              </button>

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-edge">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-mid mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map(tag => (
                      <span key={tag._id} className="text-xs font-medium text-fg-mid bg-surface-alt px-3 py-1 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-edge space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-fg-muted">Comments</span>
                  <span className="font-semibold text-fg">{comments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fg-muted">Difficulty</span>
                  <span className={`font-semibold ${
                    idea.difficulty === "Beginner" ? "text-green-600" :
                    idea.difficulty === "Intermediate" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {idea.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fg-muted">Posted</span>
                  <span className="font-semibold text-fg">
                    {new Date(idea.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
