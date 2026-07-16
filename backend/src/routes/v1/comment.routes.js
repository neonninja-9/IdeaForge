import { Router } from "express";
import commentController from "../../controllers/comment.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.get("/", commentController.list);
router.post("/", authenticate, commentController.create);
router.delete("/:id", authenticate, commentController.delete);

export default router;
