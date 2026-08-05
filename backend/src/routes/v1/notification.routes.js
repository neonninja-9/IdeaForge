import { Router } from "express";
import notificationController from "../../controllers/notification.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import { validateObjectId } from "../../middlewares/validateObjectId.js";

const router = Router();

router.use(authenticate);

router.get("/", notificationController.list);
router.patch("/:id/read", validateObjectId("id"), notificationController.markRead);

export default router;
