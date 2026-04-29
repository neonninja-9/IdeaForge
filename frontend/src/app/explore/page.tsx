import { getIdeas } from "@/lib/ideas";
import { getAllCategories } from "@/lib/categories";
import { getAllTags } from "@/lib/tags";
import { exploreSearchSchema } from "@/lib/schemas";
import IdeaCard from "@/components/IdeaCard";
import ExploreFilters from "@/components/ExploreFilters";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const parsedParams = exploreSearchSchema.safeParse(params);
  
  const queryParams = parsedParams.success ? parsedParams.data : {};
  
  const [ideas, categories, tags] = await Promise.all([
    getIdeas(queryParams),
    getAllCategories(),
    getAllTags()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Explore Ideas</h1>
        <p className="text-lg text-fg-mid max-w-2xl">
          Discover real-world problems and innovative project ideas submitted by the community. 
          Find your next building block here.
        </p>
      </div>

      <ExploreFilters categories={categories} tags={tags} />

      {ideas.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-edge rounded-3xl bg-surface-alt">
          <h2 className="text-xl font-bold mb-2">No ideas found matching your criteria</h2>
          <p className="text-fg-mid mb-6">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
