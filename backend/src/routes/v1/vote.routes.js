import { Router } from "express";
import voteController from "../../controllers/vote.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validate from "../../middlewares/validate.js";
import { voteRules } from "../../validators/vote.validator.js";

const router = Router();

router.post("/toggle", authenticate, voteRules, validate, voteController.toggle);

export default router;
