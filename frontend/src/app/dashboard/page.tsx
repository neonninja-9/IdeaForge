import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IdeaCard from "@/components/IdeaCard";
import Link from "next/link";

export const metadata = {
  title: "Dashboard - IdeaForge",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch user's ideas
  const userIdeas = await prisma.idea.findMany({
    where: { authorId: userId },
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { votes: true, comments: true } },
      author: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch ideas the user has voted on
  const votedIdeasRaw = await prisma.vote.findMany({
    where: { userId },
    include: {
      idea: {
        include: {
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { votes: true, comments: true } },
          author: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const votedIdeas = votedIdeasRaw.map((v) => v.idea);

  const totalVotesReceived = userIdeas.reduce((sum, idea) => sum + idea._count.votes, 0);
  const totalCommentsReceived = userIdeas.reduce((sum, idea) => sum + idea._count.comments, 0);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-fg mb-3">
            Welcome back, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="text-fg-mid text-lg">Here&apos;s a summary of your activity on IdeaForge.</p>
        </div>
        <Link 
          href="/submit" 
          className="px-6 py-3 bg-vivid text-white font-bold rounded-xl hover:bg-vivid-dark transition-colors shrink-0"
        >
          Submit New Idea
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-edge rounded-3xl p-6 shadow-sm">
          <div className="text-fg-muted text-sm font-semibold uppercase tracking-wider mb-2">Ideas Submitted</div>
          <div className="text-4xl font-black text-fg">{userIdeas.length}</div>
        </div>
        <div className="bg-white border border-edge rounded-3xl p-6 shadow-sm">
          <div className="text-fg-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Votes Received</div>
          <div className="text-4xl font-black text-fg">{totalVotesReceived}</div>
        </div>
        <div className="bg-white border border-edge rounded-3xl p-6 shadow-sm">
          <div className="text-fg-muted text-sm font-semibold uppercase tracking-wider mb-2">Comments on Ideas</div>
          <div className="text-4xl font-black text-fg">{totalCommentsReceived}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold border-b border-edge pb-4">Your Ideas</h2>
          {userIdeas.length > 0 ? (
            <div className="space-y-6">
              {userIdeas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-alt border border-edge rounded-3xl p-12 text-center">
              <h3 className="text-xl font-bold mb-2">You haven&apos;t submitted any ideas yet</h3>
              <p className="text-fg-mid mb-6">Share your first project concept with the community.</p>
              <Link href="/submit" className="text-vivid font-semibold hover:underline">Get started →</Link>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-edge pb-4">Recently Voted</h2>
          {votedIdeas.length > 0 ? (
            <div className="space-y-6">
              {votedIdeas.map((idea) => (
                <div key={idea.id} className="bg-white border border-edge rounded-2xl p-5 shadow-sm">
                  <Link href={`/ideas/${idea.id}`} className="block group">
                    <h3 className="font-bold text-sm text-fg group-hover:text-vivid transition-colors mb-2 line-clamp-2">
                      {idea.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-fg-muted font-medium bg-surface-alt px-2 py-1 rounded-md">
                        {idea.category.name}
                      </span>
                      <span className="text-fg-muted font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3 text-vivid" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
                        </svg>
                        {idea._count.votes}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-alt border border-edge rounded-2xl p-6 text-center text-fg-muted text-sm">
              You haven&apos;t voted on any ideas recently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
