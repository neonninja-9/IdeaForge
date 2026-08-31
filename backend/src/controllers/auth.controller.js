/**
 * Auth Controller
 * ---------------
 * HTTP layer — the ONLY place that reads `req` and writes `res`.
 * Each method:
 *   1. Extracts validated/sanitized data from the request
 *   2. Delegates to authService (business logic)
 *   3. Transforms the result via user.transformer
 *   4. Sends the HTTP response (with appropriate status code & cookies)
 *
 * Errors thrown by the service bubble up to the global error handler
 * via `next(err)`.
 */

import mongoose from "mongoose";
import authService from "../services/auth.service.js";
import tokenConfig from "../config/token.config.js";
import { toAuthResponse, toPublicUser } from "../transformers/user.transformer.js";
import { getOrCreateDevUser, isDevAuthEnabled } from "../utils/devUser.js";

const authController = {
  /**
   * POST /api/v1/auth/register
   *
   * Creates a new user account, sets the refresh token cookie, and
   * returns the public user object + access token.
   */
  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const { user, accessToken, refreshToken } = await authService.register({
        username,
        email,
        password,
      });

      // Set refresh token as httpOnly cookie
      res.cookie(
        tokenConfig.refresh.cookie.name,
        refreshToken,
        tokenConfig.refresh.cookie
      );

      return res.status(201).json(toAuthResponse({ user, accessToken }));
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/login
   *
   * Authenticates credentials, sets the refresh token cookie, and
   * returns the public user object + access token.
   */
  async login(req, res, next) {
    try {
      const { identifier, password } = req.body;

      const { user, accessToken, refreshToken } = await authService.login({
        identifier,
        password,
      });

      // Set refresh token as httpOnly cookie
      res.cookie(
        tokenConfig.refresh.cookie.name,
        refreshToken,
        tokenConfig.refresh.cookie
      );

      return res.status(200).json(toAuthResponse({ user, accessToken }));
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/refresh
   *
   * Reads the refresh token from the httpOnly cookie, validates it,
   * and returns a fresh access token.
   */
  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.[tokenConfig.refresh.cookie.name];

      if (!refreshToken) {
        if (isDevAuthEnabled()) {
          const devUser = await getOrCreateDevUser();
          return res.status(200).json({
            status: "success",
            data: {
              accessToken: "dev-access-token",
              user: toPublicUser(devUser),
            },
          });
        }

        return res.status(401).json({
          status: "fail",
          message: "No refresh token provided",
        });
      }

      const { accessToken, user } = await authService.refreshAccessToken(refreshToken);

      return res.status(200).json({
        status: "success",
        data: {
          accessToken,
          user: toPublicUser(user),
        },
      });
    } catch (err) {
      if (isDevAuthEnabled()) {
        const devUser = await getOrCreateDevUser();
        return res.status(200).json({
          status: "success",
          data: {
            accessToken: "dev-access-token",
            user: toPublicUser(devUser),
          },
        });
      }
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/logout
   *
   * Clears the refresh token cookie. The client should also discard
   * the access token from memory.
   */
  async logout(_req, res) {
    res.clearCookie(tokenConfig.refresh.cookie.name, {
      httpOnly: tokenConfig.refresh.cookie.httpOnly,
      secure: tokenConfig.refresh.cookie.secure,
      sameSite: tokenConfig.refresh.cookie.sameSite,
      path: tokenConfig.refresh.cookie.path,
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  },

  /**
   * GET /api/v1/auth/me
   *
   * Returns the authenticated user's profile.
   * Requires the `authenticate` middleware to have run first.
   */
  async getMe(req, res, next) {
    try {
      let user = null;
      if (req.user?.id && mongoose.connection.readyState === 1) {
        try {
          user = await authService.getProfile(req.user.id);
        } catch {
          if (isDevAuthEnabled()) {
            user = await getOrCreateDevUser();
          }
        }
      } else if (isDevAuthEnabled()) {
        user = await getOrCreateDevUser();
      }

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: { user: toPublicUser(user) },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
