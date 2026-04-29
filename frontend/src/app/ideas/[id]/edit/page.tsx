import { getAllCategories } from "@/lib/categories";
import { getAllTags } from "@/lib/tags";
import { getIdeaById } from "@/lib/ideas";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditIdeaForm from "./EditIdeaForm";

export default async function EditIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const idea = await getIdeaById(id);

  if (!idea) {
    notFound();
  }

  if (idea.authorId !== session.user.id) {
    redirect(`/ideas/${id}`); // Unauthorized to edit, just redirect to detail view
  }

  const [categories, tags] = await Promise.all([
    getAllCategories(),
    getAllTags()
  ]);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-10 py-10 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Edit Your Idea</h1>
        <p className="text-fg-mid">Update the details of your project idea.</p>
      </div>

      <EditIdeaForm categories={categories} tags={tags} idea={idea} />
    </div>
  );
}
