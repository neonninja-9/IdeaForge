/**
 * V1 Router Aggregator
 * --------------------
 * Mounts all v1 sub-routers under a single router.
 * This is imported by server.js and mounted at /api/v1.
 */

import { Router } from "express";
import authRoutes from "./auth.routes.js";
import ideaRoutes from "./idea.routes.js";
import categoryRoutes from "./category.routes.js";
import tagRoutes from "./tag.routes.js";
import commentRoutes from "./comment.routes.js";
import voteRoutes from "./vote.routes.js";
import projectRoutes from "./project.routes.js";
import userRoutes from "./user.routes.js";
import aiRoutes from "./ai.routes.js";
import favoriteRoutes from "./favorite.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/ideas", ideaRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);
router.use("/comments", commentRoutes);
router.use("/votes", voteRoutes);
router.use("/projects", projectRoutes);
router.use("/users", userRoutes);
router.use("/ai", aiRoutes);
router.use("/favorites", favoriteRoutes);

export default router;
