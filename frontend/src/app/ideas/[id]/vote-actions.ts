"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleVote(ideaId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be logged in to vote.");
  }

  const userId = session.user.id;

  const existingVote = await prisma.vote.findUnique({
    where: {
      ideaId_userId: {
        userId,
        ideaId,
      },
    },
  });

  if (existingVote) {
    await prisma.vote.delete({
      where: {
        ideaId_userId: {
          userId,
          ideaId,
        },
      },
    });
  } else {
    await prisma.vote.create({
      data: {
        userId,
        ideaId,
      },
    });
  }

  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/explore");
}
