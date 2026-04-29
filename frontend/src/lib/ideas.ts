import { prisma } from "./prisma";
import { ideaSchema } from "./schemas";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export async function getIdeaById(id: string, userId?: string) {
  return prisma.idea.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, id: true },
      },
      category: true,
      tags: {
        include: { tag: true }
      },
      _count: {
        select: { votes: true, comments: true }
      },
      ...(userId ? { votes: { where: { userId } } } : {})
    }
  });
}

export async function getIdeas(params: {
  q?: string;
  category?: string;
  tag?: string;
  difficulty?: string;
  sort?: "newest" | "top" | "discussed";
}) {
  const whereClause: Prisma.IdeaWhereInput = {};

  if (params.q) {
    whereClause.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { problem: { contains: params.q, mode: "insensitive" } },
      { solution: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.category) {
    whereClause.category = { slug: params.category };
  }

  if (params.tag) {
    whereClause.tags = {
      some: {
        tag: { slug: params.tag }
      }
    };
  }

  if (params.difficulty) {
    whereClause.difficulty = params.difficulty;
  }

  let orderBy: Prisma.IdeaOrderByWithRelationInput | Prisma.IdeaOrderByWithRelationInput[] = { createdAt: "desc" };
  if (params.sort === "top") {
    orderBy = { votes: { _count: "desc" } };
  } else if (params.sort === "discussed") {
    orderBy = { comments: { _count: "desc" } };
  }

  return prisma.idea.findMany({
    where: whereClause,
    orderBy,
    include: {
      author: { select: { name: true, id: true } },
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { votes: true, comments: true } }
    }
  });
}

export async function createIdea(data: z.infer<typeof ideaSchema>, authorId: string, suggestedTechStack?: string) {
  // Assume tags are array of tag IDs
  return prisma.idea.create({
    data: {
      title: data.title,
      problem: data.problem,
      solution: data.solution,
      impact: data.impact,
      difficulty: data.difficulty,
      suggestedTechStack,
      authorId,
      categoryId: data.categoryId,
      tags: {
        create: data.tags.map(tagId => ({
          tagId
        }))
      }
    }
  });
}

export async function updateIdea(id: string, data: Partial<z.infer<typeof ideaSchema>>, authorId: string) {
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea || idea.authorId !== authorId) {
    throw new Error("Unauthorized or not found");
  }

  const updateData: Prisma.IdeaUpdateInput = {
    title: data.title,
    problem: data.problem,
    solution: data.solution,
    impact: data.impact,
    difficulty: data.difficulty,
  };

  if (data.categoryId) {
    updateData.category = { connect: { id: data.categoryId } };
  }

  if (data.tags) {
    // Delete existing tags and recreate them
    await prisma.ideaTag.deleteMany({ where: { ideaId: id } });
    updateData.tags = {
      create: data.tags.map(tagId => ({ tagId }))
    };
  }

  return prisma.idea.update({
    where: { id },
    data: updateData
  });
}

export async function deleteIdea(id: string, authorId: string) {
  // Prisma will throw if not found, we ensure author matches before deleting
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea || idea.authorId !== authorId) {
    throw new Error("Unauthorized or not found");
  }

  return prisma.idea.delete({
    where: { id }
  });
}

export async function getSimilarIdeas(ideaId: string, limit = 3) {
  const currentIdea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { tags: true }
  });

  if (!currentIdea) return [];

  const tagIds = currentIdea.tags.map(t => t.tagId);

  // Find ideas in same category or with overlapping tags
  const similarIdeas = await prisma.idea.findMany({
    where: {
      id: { not: ideaId },
      OR: [
        { categoryId: currentIdea.categoryId },
        {
          tags: {
            some: {
              tagId: { in: tagIds }
            }
          }
        }
      ]
    },
    include: {
      category: true,
      _count: { select: { votes: true } }
    },
    take: limit,
    // order by most votes
    orderBy: {
      votes: {
        _count: "desc"
      }
    }
  });

  return similarIdeas;
}
