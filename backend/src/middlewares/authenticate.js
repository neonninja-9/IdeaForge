/**
 * Authenticate Middleware
 * ----------------------
 * Protects routes by verifying the JWT access token from the
 * `Authorization: Bearer <token>` header.
 *
 * On success: attaches `req.user = { id, email, role }` (from token payload)
 *             and calls next().
 * On failure: responds with 401 Unauthorized.
 */

import jwt from "jsonwebtoken";
import tokenConfig from "../config/token.config.js";
import { getOrCreateDevUser, isDevAuthEnabled } from "../utils/devUser.js";

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const isDev = isDevAuthEnabled();

  // 1 — If a Bearer token is provided, try to verify it
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    if (token && token !== "dev-access-token") {
      try {
        const decoded = jwt.verify(token, tokenConfig.access.secret);

        // Attach user object for downstream handlers
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };

        return next();
      } catch (err) {
        if (!isDev) {
          const message =
            err.name === "TokenExpiredError"
              ? "Access token has expired"
              : "Invalid access token";

          return res.status(401).json({
            status: "fail",
            message,
          });
        }
      }
    }
  }

  // 2 — In development environment, automatically authenticate as dev user
  if (isDev) {
    const devUser = await getOrCreateDevUser();
    req.user = {
      id: (devUser._id || devUser.id || "").toString(),
      email: devUser.email,
      role: devUser.role || "admin",
    };
    return next();
  }

  // 3 — In production without a token, reject
  return res.status(401).json({
    status: "fail",
    message: "Authentication required — no token provided",
  });
}

export default authenticate;
