/**
 * User Transformer
 * ----------------
 * Shapes raw Mongoose documents into safe, consistent API responses.
 * Ensures sensitive fields like `passwordHash` never leak to clients,
 * and normalizes `_id` → `id` for a cleaner external contract.
 */

/**
 * Strip sensitive fields and normalize a user document for public consumption.
 * @param   {import("mongoose").Document} userDoc — raw Mongoose user document
 * @returns {{ id: string, username: string, email: string, role: string, createdAt: string }}
 */
export function toPublicUser(userDoc) {
  if (!userDoc) return null;
  return {
    id: (userDoc._id || userDoc.id || "").toString(),
    username: userDoc.username,
    email: userDoc.email,
    role: userDoc.role || "user",
    createdAt: userDoc.createdAt
      ? typeof userDoc.createdAt.toISOString === "function"
        ? userDoc.createdAt.toISOString()
        : userDoc.createdAt
      : new Date().toISOString(),
  };
}

/**
 * Build the standard auth response body (used by register & login).
 * @param   {{ user: import("mongoose").Document, accessToken: string }} payload
 * @returns {{ status: string, data: { user: object, accessToken: string } }}
 */
export function toAuthResponse({ user, accessToken }) {
  return {
    status: "success",
    data: {
      user: toPublicUser(user),
      accessToken,
    },
  };
}
