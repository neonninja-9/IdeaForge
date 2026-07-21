import { Router } from "express";
import aiController from "../../controllers/ai.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();
router.post("/assist", authenticate, aiController.assist);

export default router;
