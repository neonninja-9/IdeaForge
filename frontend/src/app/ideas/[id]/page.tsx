import { getIdeaById, getSimilarIdeas } from "@/lib/ideas";
import { getCommentsForIdea } from "@/lib/comments";
import { auth } from "@/auth";
import Link from "next/link";
import DeleteIdeaButton from "@/components/DeleteIdeaButton";
import VoteButton from "@/components/VoteButton";
import CommentForm from "@/components/CommentForm";
import SimilarIdeaCard from "@/components/SimilarIdeaCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idea = await getIdeaById(id);

  if (!idea) {
    return { title: "Idea Not Found" };
  }

  return {
    title: idea.title,
    description: idea.problem.slice(0, 150) + "...",
  };
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const idea = await getIdeaById(id, session?.user?.id);

  if (!idea) {
    notFound();
  }

  const [comments, similarIdeas] = await Promise.all([
    getCommentsForIdea(id),
    getSimilarIdeas(id)
  ]);
  const isAuthor = session?.user?.id === idea.authorId;
  const hasVoted = idea.votes && idea.votes.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="flex justify-between items-center mb-8">
        <Link href="/explore" className="text-vivid hover:underline text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Explore
        </Link>
        
        {isAuthor && (
          <div className="flex items-center gap-3">
            <Link 
              href={`/ideas/${id}/edit`} 
              className="px-4 py-2 bg-surface-alt border border-edge text-fg font-semibold rounded-xl text-sm hover:border-vivid transition-colors"
            >
              Edit
            </Link>
            <DeleteIdeaButton id={id} />
          </div>
        )}
      </div>

      <div className="bg-white border border-edge rounded-3xl p-8 md:p-12 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-surface-alt text-fg-mid text-xs font-semibold uppercase tracking-wider rounded-full">
                {idea.category.name}
              </span>
              <span className="px-3 py-1 bg-surface-alt text-fg-mid text-xs font-semibold uppercase tracking-wider rounded-full">
                {idea.difficulty}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-fg mb-4">
              {idea.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-fg-muted">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-fg text-fg-on-dark flex items-center justify-center font-bold text-xs">
                  {idea.author.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="font-medium text-fg">{idea.author.name}</span>
              </div>
              <span>•</span>
              <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <VoteButton 
            ideaId={idea.id}
            initialVotes={idea._count.votes}
            initialHasVoted={hasVoted}
            isLoggedIn={!!session?.user}
          />
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-vivid">01.</span> The Problem
            </h2>
            <p className="text-fg-mid leading-relaxed whitespace-pre-wrap">{idea.problem}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-vivid">02.</span> Proposed Solution
            </h2>
            <p className="text-fg-mid leading-relaxed whitespace-pre-wrap">{idea.solution}</p>
          </section>

          {idea.impact && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-vivid">03.</span> Expected Impact
              </h2>
              <p className="text-fg-mid leading-relaxed whitespace-pre-wrap">{idea.impact}</p>
            </section>
          )}

          {idea.suggestedTechStack && (
            <section className="bg-surface-alt rounded-2xl p-6 border border-edge">
              <h2 className="text-lg font-bold mb-2">Suggested Tech Stack</h2>
              <p className="text-fg-mid">{idea.suggestedTechStack}</p>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {idea.tags.map((t) => (
                <span key={t.tag.id} className="px-3 py-1.5 bg-surface-alt border border-edge text-fg font-medium text-sm rounded-lg">
                  {t.tag.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Discussion ({idea._count.comments})</h2>
          
          {session?.user ? (
            <CommentForm ideaId={id} />
          ) : (
            <div className="mb-8 bg-surface-alt border border-edge rounded-2xl p-6 text-center text-fg-muted">
              <Link href="/login" className="text-vivid hover:underline font-semibold">Sign in</Link> to join the discussion.
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-edge rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-surface-alt text-fg flex items-center justify-center font-bold text-sm">
                    {comment.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{comment.user.name}</div>
                    <div className="text-xs text-fg-muted">{new Date(comment.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="text-fg-mid text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-fg-muted">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Similar Ideas</h2>
          {similarIdeas.length > 0 ? (
            <div className="space-y-4">
              {similarIdeas.map((simIdea) => (
                <SimilarIdeaCard key={simIdea.id} idea={simIdea} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-alt border border-edge rounded-2xl p-6 text-center">
               <p className="text-fg-muted text-sm">No similar ideas found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
