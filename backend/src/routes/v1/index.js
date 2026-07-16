/**
 * V1 Router Aggregator
 * --------------------
 * Mounts all v1 sub-routers under a single router.
 * This is imported by server.js and mounted at /api/v1.
 *
 * To add a new resource (e.g. ideas), create its route file and
 * mount it here:
 *   import ideaRoutes from "./idea.routes.js";
 *   router.use("/ideas", ideaRoutes);
 */

import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;
