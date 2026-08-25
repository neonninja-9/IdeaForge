import { Router } from "express";
import projectController from "../../controllers/project.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validate from "../../middlewares/validate.js";
import { projectCanvasRules } from "../../validators/project.validator.js";

const router = Router();
router.get("/canvas", authenticate, projectController.getCanvas);
router.put("/canvas", authenticate, projectCanvasRules, validate, projectController.saveCanvas);

export default router;
