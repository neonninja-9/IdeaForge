"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function postCommentAction(ideaId: string, prevState: unknown, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to comment." };
  }

  const text = formData.get("text");
  const parsed = commentSchema.safeParse({ text, ideaId });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.comment.create({
      data: {
        text: parsed.data.text,
        ideaId,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Failed to post comment:", error);
    return { error: "Failed to post comment. Please try again later." };
  }

  revalidatePath(`/ideas/${ideaId}`);
  return { success: true };
}
