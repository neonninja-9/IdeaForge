import { Router } from "express";
import commentController from "../../controllers/comment.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validate from "../../middlewares/validate.js";
import { commentRules } from "../../validators/comment.validator.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";

const router = Router();

router.get("/", commentController.list);
router.post("/", authenticate, commentRules, validate, commentController.create);
router.delete("/:id", authenticate, validateObjectId("id"), commentController.delete);

export default router;
