"use client";

import { useOptimistic, useTransition } from "react";
import { toggleVote } from "@/app/ideas/[id]/vote-actions";

export default function VoteButton({
  ideaId,
  initialVotes,
  initialHasVoted,
  isLoggedIn,
}: {
  ideaId: string;
  initialVotes: number;
  initialHasVoted: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, addOptimisticState] = useOptimistic(
    { votes: initialVotes, hasVoted: initialHasVoted },
    (state) => ({
      votes: state.hasVoted ? state.votes - 1 : state.votes + 1,
      hasVoted: !state.hasVoted,
    })
  );

  const handleVote = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to vote.");
      return;
    }

    startTransition(async () => {
      addOptimisticState(undefined);
      try {
        await toggleVote(ideaId);
      } catch {
        alert("Failed to record vote.");
      }
    });
  };

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={`flex flex-row md:flex-col items-center gap-2 p-4 rounded-2xl md:min-w-[100px] transition-colors border ${
        optimisticState.hasVoted 
          ? "bg-vivid/10 border-vivid/30 text-vivid" 
          : "bg-surface-alt border-transparent hover:border-edge text-fg"
      }`}
      aria-label={optimisticState.hasVoted ? "Remove vote" : "Upvote"}
    >
      <div className={`w-12 h-12 flex items-center justify-center bg-white border rounded-full transition-colors ${
        optimisticState.hasVoted 
          ? "border-vivid text-vivid" 
          : "border-edge text-fg-muted hover:text-vivid hover:border-vivid"
      }`}>
        <svg 
          className="w-6 h-6" 
          fill={optimisticState.hasVoted ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>
      <span className="text-xl font-bold">{optimisticState.votes}</span>
      <span className={`text-xs uppercase tracking-wider font-semibold ${optimisticState.hasVoted ? "text-vivid/80" : "text-fg-muted"}`}>
        Votes
      </span>
    </button>
  );
}
