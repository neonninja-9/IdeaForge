import Link from "next/link";
import type { Category, Idea } from "@prisma/client";

type SimilarIdea = Idea & {
  category: Category;
  _count: { votes: number };
};

export default function SimilarIdeaCard({ idea }: { idea: SimilarIdea }) {
  return (
    <Link href={`/ideas/${idea.id}`} className="block group">
      <div className="bg-white border border-edge rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-vivid transition-all duration-300">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-bold text-sm text-fg group-hover:text-vivid transition-colors line-clamp-2 leading-snug">
            {idea.title}
          </h3>
          <div className="flex items-center gap-1 text-vivid bg-vivid/10 px-2 py-1 rounded-md text-xs font-bold shrink-0">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {idea._count.votes}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs mt-3">
          <span className="text-fg-muted font-medium bg-surface-alt px-2 py-1 rounded-md">
            {idea.category.name}
          </span>
          <span className="text-fg-muted">
            {idea.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}
