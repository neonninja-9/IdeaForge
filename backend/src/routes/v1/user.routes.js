import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();
router.patch("/me", authenticate, userController.updateMe);
router.get("/me/preferences", authenticate, userController.getPreferences);
router.put("/me/preferences", authenticate, userController.updatePreferences);

export default router;
