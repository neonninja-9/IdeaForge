/**
 * Auth Routes — v1
 * ----------------
 * Wires up validation chains, middleware, and controller methods
 * for all authentication endpoints under /api/v1/auth.
 *
 * Route table:
 *   POST   /register   → registerRules + validate → controller.register
 *   POST   /login      → loginRules + validate    → controller.login
 *   POST   /refresh    → (no body validation)     → controller.refresh
 *   POST   /logout     → (no body validation)     → controller.logout
 *   GET    /me         → authenticate             → controller.getMe
 */

import { Router } from "express";
import authController from "../../controllers/auth.controller.js";
import { registerRules, loginRules } from "../../validators/auth.validator.js";
import validate from "../../middlewares/validate.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

// ─── Public routes ─────────────────────────────────────────────

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// ─── Protected routes ──────────────────────────────────────────

router.get("/me", authenticate, authController.getMe);

export default router;
