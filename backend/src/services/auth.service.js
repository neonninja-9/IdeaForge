/**
 * Auth Service
 * ------------
 * Pure business logic for authentication flows.
 * This layer sits between controllers and repositories:
 *   Controller → Service → Repository
 *
 * Responsibilities:
 *   - Password hashing & comparison (bcrypt)
 *   - JWT signing & verification
 *   - Orchestrating repository calls
 *   - Throwing AppError for known failure cases
 *
 * This layer does NOT touch `req` / `res` — it receives
 * plain data and returns plain data (or throws).
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import tokenConfig from "../config/token.config.js";
import AppError from "../utils/AppError.js";

const SALT_ROUNDS = 12;

// ─── Token helpers (private) ───────────────────────────────────

/**
 * Sign a short-lived access token.
 * @param   {{ id: string, email: string, role: string }} payload
 * @returns {string}
 */
function signAccessToken(payload) {
  return jwt.sign(payload, tokenConfig.access.secret, {
    expiresIn: tokenConfig.access.expiresIn,
  });
}

/**
 * Sign a longer-lived refresh token (contains only user id).
 * @param   {{ id: string }} payload
 * @returns {string}
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, tokenConfig.refresh.secret, {
    expiresIn: tokenConfig.refresh.expiresIn,
  });
}

// ─── Public service methods ────────────────────────────────────

const authService = {
  /**
   * Register a new user.
   *
   * Flow:
   *   1. Check uniqueness of email AND username (→ 409 Conflict)
   *   2. Hash password with bcrypt
   *   3. Persist user via repository
   *   4. Sign access + refresh tokens
   *
   * @param   {{ username: string, email: string, password: string }} input
   * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
   * @throws  {AppError} 409 if email or username already exists
   */
  async register({ username, email, password }) {
    // 1 — Uniqueness checks
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw new AppError("A user with this email already exists", 409);
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw new AppError("This username is already taken", 409);
    }

    // 2 — Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3 — Create user
    const user = await userRepository.create({ username, email, passwordHash });

    // 4 — Sign tokens
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    return { user, accessToken, refreshToken };
  },

  /**
   * Authenticate an existing user.
   *
   * Flow:
   *   1. Find user by email (→ 401 if not found)
   *   2. Compare password against stored hash (→ 401 if mismatch)
   *   3. Sign access + refresh tokens
   *
   * @param   {{ identifier: string, password: string }} input
   * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
   * @throws  {AppError} 401 on invalid credentials
   */
  async login({ identifier, password }) {
    // 1 — Lookup user
    let user;
    if (identifier.includes("@")) {
      user = await userRepository.findByEmail(identifier);
    } else {
      user = await userRepository.findByUsername(identifier);
    }

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // 2 — Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // 3 — Sign tokens
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ id: user._id.toString() });

    return { user, accessToken, refreshToken };
  },

  /**
   * Issue a new access token from a valid refresh token.
   *
   * Flow:
   *   1. Verify refresh token JWT (→ 401 if invalid/expired)
   *   2. Look up user to confirm they still exist (→ 401 if deleted)
   *   3. Sign a fresh access token
   *
   * @param   {string} refreshToken
   * @returns {Promise<{ accessToken: string, user: object }>}
   * @throws  {AppError} 401 on invalid/expired token or deleted user
   */
  async refreshAccessToken(refreshToken) {
    // 1 — Verify
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, tokenConfig.refresh.secret);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    // 2 — Confirm user still exists
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError("User belonging to this token no longer exists", 401);
    }

    // 3 — Issue new access token
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);

    return { accessToken, user };
  },

  /**
   * Fetch a user's profile by ID.
   *
   * @param   {string} userId
   * @returns {Promise<object>}
   * @throws  {AppError} 404 if user not found
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
};

export default authService;
