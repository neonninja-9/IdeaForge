import mongoose from "mongoose";
import User from "../../models/user.js";

let cachedDevUser = null;

const FALLBACK_DEV_USER = {
  _id: "000000000000000000000001",
  id: "000000000000000000000001",
  username: "developer",
  email: "dev@ideaforge.local",
  role: "admin",
  createdAt: new Date().toISOString(),
};

/**
 * Get or automatically create a persistent Developer User document in MongoDB.
 * Ensures a valid MongoDB ObjectId is available for relations (author, user, comments, votes, projects, etc.).
 */
export async function getOrCreateDevUser() {
  if (cachedDevUser) {
    return cachedDevUser;
  }

  // If MongoDB is not actively connected (e.g. offline dev / pending URI), return fallback instantly
  if (mongoose.connection.readyState !== 1) {
    return FALLBACK_DEV_USER;
  }

  try {
    // 1. Try finding developer user
    let user = await User.findOne({ email: "dev@ideaforge.local" });
    if (!user) {
      // 2. Try finding any existing user in DB
      user = await User.findOne();
    }
    if (!user) {
      // 3. Create default dev user
      user = await User.create({
        username: "developer",
        email: "dev@ideaforge.local",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyzA7B9C1D2E3F4G5H6I7J8K9L",
        role: "admin",
        preferences: {
          productUpdates: true,
          weeklyReflection: false,
        },
      });
    }

    cachedDevUser = user;
    return user;
  } catch (err) {
    return FALLBACK_DEV_USER;
  }
}

/**
 * Helper to check whether dev auth bypass should be active.
 */
export function isDevAuthEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.DISABLE_AUTH === "true";
}
