"use server";

import { auth } from "@/auth";
import { updateIdeaSchema } from "@/lib/schemas";
import { updateIdea, deleteIdea } from "@/lib/ideas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editIdeaAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to edit an idea." };
  }

  const rawData = {
    id: formData.get("id"),
    title: formData.get("title"),
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    impact: formData.get("impact"),
    difficulty: formData.get("difficulty"),
    categoryId: formData.get("categoryId"),
    tags: formData.getAll("tags"),
  };

  const parsed = updateIdeaSchema.safeParse(rawData);

  if (!parsed.success) {
    return { 
      error: "Please check the form for errors.", 
      fields: parsed.error.flatten().fieldErrors,
      data: rawData
    };
  }

  try {
    await updateIdea(parsed.data.id!, parsed.data, session.user.id);
  } catch (error) {
    console.error(error);
    return { error: "Failed to update idea. It might not exist or you might not be the author.", data: rawData };
  }

  revalidatePath(`/ideas/${parsed.data.id}`);
  redirect(`/ideas/${parsed.data.id}`);
}

export async function deleteIdeaAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteIdea(id, session.user.id);
  } catch (error) {
    console.error("Delete failed", error);
    throw new Error("Failed to delete idea");
  }

  revalidatePath("/explore");
  revalidatePath("/dashboard");
  redirect("/explore");
}
