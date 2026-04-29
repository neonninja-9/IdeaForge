import { prisma } from "./prisma";

export async function toggleVote(ideaId: string, userId: string) {
  const existingVote = await prisma.vote.findUnique({
    where: {
      ideaId_userId: {
        ideaId,
        userId
      }
    }
  });

  if (existingVote) {
    await prisma.vote.delete({
      where: { id: existingVote.id }
    });
    return { voted: false };
  } else {
    await prisma.vote.create({
      data: { ideaId, userId }
    });
    return { voted: true };
  }
}

export async function hasUserVoted(ideaId: string, userId: string) {
  const vote = await prisma.vote.findUnique({
    where: {
      ideaId_userId: {
        ideaId,
        userId
      }
    }
  });
  return !!vote;
}
