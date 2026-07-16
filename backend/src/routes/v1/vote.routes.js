import { Router } from "express";
import voteController from "../../controllers/vote.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post("/toggle", authenticate, voteController.toggle);

export default router;
