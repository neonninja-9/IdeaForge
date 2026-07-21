import { Router } from "express";
import projectController from "../../controllers/project.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();
router.get("/canvas", authenticate, projectController.getCanvas);
router.put("/canvas", authenticate, projectController.saveCanvas);

export default router;
