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

function authenticate(req, res, next) {
  // 1 — Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Authentication required — no token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  // 2 — Verify the JWT
  try {
    const decoded = jwt.verify(token, tokenConfig.access.secret);

    // Attach a lightweight user object for downstream handlers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
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

export default authenticate;
