/**
 * Idea Routes — v1
 * ----------------
 * Route table:
 *   GET    /             → list ideas (public, with filters)
 *   GET    /my           → get authenticated user's ideas
 *   GET    /dashboard    → get dashboard stats + ideas
 *   GET    /:id          → get single idea (public, optionally auth for vote status)
 *   POST   /             → create idea (auth required)
 *   DELETE /:id          → delete own idea (auth required)
 */

import { Router } from "express";
import ideaController from "../../controllers/idea.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

// ─── Public routes ─────────────────────────────────────────────

router.get("/", ideaController.list);

// ─── Protected routes ──────────────────────────────────────────

router.get("/my", authenticate, ideaController.getMyIdeas);
router.get("/dashboard", authenticate, ideaController.dashboard);

// This must come after /my and /dashboard so they aren't treated as :id
router.get("/:id", optionalAuth, ideaController.getById);

router.post("/", authenticate, ideaController.create);
router.delete("/:id", authenticate, ideaController.delete);

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
