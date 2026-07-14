import { Link } from "react-router-dom";
import type { Category, Idea, IdeaTag, Tag, User } from "@prisma/client";

export type IdeaWithRelations = Idea & {
  author: Pick<User, "id" | "name">;
  category: Category;
  tags: Array<IdeaTag & { tag: Tag }>;
  _count: { votes: number; comments: number };
};

export default function IdeaCard({ idea }: { idea: IdeaWithRelations }) {
  return (
    <div className="bg-white border border-edge rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-surface-alt text-fg-mid text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            {idea.category.name}
          </span>
          <Link to={`/ideas/${idea.id}`}>
            <h2 className="text-xl font-bold text-fg hover:text-vivid transition-colors line-clamp-2">
              {idea.title}
            </h2>
          </Link>
        </div>
        <div className="flex items-center gap-1 text-vivid bg-vivid/10 px-3 py-1.5 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {idea._count.votes}
        </div>
      </div>

      <p className="text-fg-mid line-clamp-3 mb-6 text-sm leading-relaxed">
        {idea.problem}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {idea.tags.map((t) => (
          <span key={t.tag.id} className="px-2.5 py-1 bg-surface-alt border border-edge text-fg-mid text-xs rounded-md">
            {t.tag.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-fg-muted pt-4 border-t border-edge">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-fg text-fg-on-dark flex items-center justify-center font-bold text-[10px]">
              {idea.author.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="font-medium text-fg">{idea.author.name}</span>
          </div>
          <span>•</span>
          <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-vivid transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {idea._count.comments}
        </div>
      </div>
    </div>
  );
}
