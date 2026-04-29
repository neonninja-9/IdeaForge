import { prisma } from "./prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug }
  });
}
