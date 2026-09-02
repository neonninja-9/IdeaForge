/**
 * Idea Routes — v1
 * ----------------
 * Route table:
 *   GET    /             → list ideas (public, with filters)
 *   GET    /my           → get authenticated user's ideas
 *   GET    /dashboard    → get dashboard stats + ideas
 *   GET    /:id          → get single idea (public, optionally auth for vote status)
 *   POST   /             → create idea (auth required)
 *   PATCH  /:id          → update own idea (auth required)
 *   DELETE /:id          → delete own idea (auth required)
 */

import { Router } from "express";
import ideaController from "../../controllers/idea.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validate from "../../middlewares/validate.js";
import { createIdeaRules, updateIdeaRules } from "../../validators/idea.validator.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";

const router = Router();

// ─── Public routes ─────────────────────────────────────────────

router.get("/search", ideaController.search);
router.get("/", ideaController.list);

// ─── Protected routes ──────────────────────────────────────────

router.get("/my", authenticate, ideaController.getMyIdeas);
router.get("/dashboard", authenticate, ideaController.dashboard);

// This must come after /my and /dashboard so they aren't treated as :id
router.get("/:id", validateObjectId("id"), optionalAuth, ideaController.getById);

router.post("/", authenticate, createIdeaRules, validate, ideaController.create);
router.patch("/:id", authenticate, validateObjectId("id"), updateIdeaRules, validate, ideaController.update);
router.delete("/:id", authenticate, validateObjectId("id"), ideaController.delete);

/**
 * Optional auth — doesn't reject if no token, but attaches req.user if present.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    // Reuse the authenticate middleware but swallow errors
    authenticate(req, res, (err) => {
        // If auth fails, just continue without user
        if (err) return next();
        next();
    });
}

export default router;
