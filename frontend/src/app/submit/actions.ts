"use server";

import { auth } from "@/auth";
import { ideaSchema } from "@/lib/schemas";
import { createIdea } from "@/lib/ideas";
import { redirect } from "next/navigation";
import { generateTechStack } from "@/lib/recommendations";
import { prisma } from "@/lib/prisma";

export async function submitIdeaAction(prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to submit an idea." };
  }

  const rawData = {
    title: formData.get("title"),
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    impact: formData.get("impact"),
    difficulty: formData.get("difficulty"),
    categoryId: formData.get("categoryId"),
    tags: formData.getAll("tags"),
  };

  const parsed = ideaSchema.safeParse(rawData);

  if (!parsed.success) {
    return { 
      error: "Please check the form for errors.", 
      fields: parsed.error.flatten().fieldErrors,
      data: rawData
    };
  }

  // Fetch tag names
  const dbTags = await prisma.tag.findMany({
    where: { id: { in: parsed.data.tags } },
    select: { name: true }
  });
  const tagNames = dbTags.map(t => t.name);

  // Auto-generate suggestedTechStack if we want it
  const generatedStack = generateTechStack(tagNames, parsed.data.difficulty);

  let newIdeaId: string;
  try {
    const newIdea = await createIdea(parsed.data, session.user.id, generatedStack);
    newIdeaId = newIdea.id;
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit idea. Please try again.", data: rawData };
  }

  redirect(`/ideas/${newIdeaId}`);
}
