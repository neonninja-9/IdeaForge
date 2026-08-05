import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validate from "../../middlewares/validate.js";
import { updateProfileRules, updatePreferencesRules } from "../../validators/user.validator.js";

const router = Router();
router.patch("/me", authenticate, updateProfileRules, validate, userController.updateMe);
router.get("/me/preferences", authenticate, userController.getPreferences);
router.put("/me/preferences", authenticate, updatePreferencesRules, validate, userController.updatePreferences);

export default router;
