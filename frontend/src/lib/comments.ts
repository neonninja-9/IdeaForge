import { prisma } from "./prisma";

export async function getCommentsForIdea(ideaId: string) {
  return prisma.comment.findMany({
    where: { ideaId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { name: true, id: true }
      }
    }
  });
}

export async function addComment(ideaId: string, userId: string, text: string) {
  return prisma.comment.create({
    data: {
      text,
      ideaId,
      userId
    }
  });
}

export async function deleteComment(id: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) {
    throw new Error("Unauthorized or not found");
  }

  return prisma.comment.delete({
    where: { id }
  });
}
