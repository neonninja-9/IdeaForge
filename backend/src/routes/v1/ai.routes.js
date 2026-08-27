import { Router } from "express";
import aiController from "../../controllers/ai.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.post("/assist", aiController.assist);
router.post("/structure-idea", aiController.structureIdea);
router.post("/categorize", aiController.categorizeIdea);
router.get("/conversations", aiController.getConversations);
router.post("/conversations", aiController.createConversation);
router.get("/conversations/:id/messages", aiController.getMessages);
router.post("/conversations/:id/messages", aiController.postMessage);

export default router;
