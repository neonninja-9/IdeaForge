import SubmitIdeaForm from "@/components/SubmitIdeaForm";
import { getAllCategories } from "@/lib/categories";
import { getAllTags } from "@/lib/tags";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SubmitIdeaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [categories, tags] = await Promise.all([
    getAllCategories(),
    getAllTags()
  ]);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Submit a New Idea</h1>
        <p className="text-fg-mid">
          Share your real-world problem and let the community help you build the solution.
        </p>
      </div>

      <SubmitIdeaForm categories={categories} tags={tags} />
    </div>
  );
}
