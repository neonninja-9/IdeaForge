import { z } from "zod";

// --- Auth Schemas ---
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Idea Schemas ---
export const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  problem: z.string().min(20, "Problem description must be at least 20 characters").max(2000),
  solution: z.string().min(20, "Solution description must be at least 20 characters").max(2000),
  impact: z.string().max(500).optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required").max(5, "Maximum 5 tags allowed"),
});

export const updateIdeaSchema = ideaSchema.partial().extend({
  id: z.string(),
});

// --- Comment Schemas ---
export const commentSchema = z.object({
  text: z.string().min(3, "Comment must be at least 3 characters").max(1000),
  ideaId: z.string().min(1),
});

// --- Voting Schemas ---
export const voteSchema = z.object({
  ideaId: z.string().min(1),
});

// --- Search Query Parameters Schemas ---
export const exploreSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  sort: z.enum(["newest", "top", "discussed"]).default("newest"),
});
