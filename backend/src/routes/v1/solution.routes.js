import express from "express";
import solutionController from "../../controllers/solution.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = express.Router();

router.get("/ideas/:ideaId/solutions", solutionController.list);
router.post("/ideas/:ideaId/solutions", authenticate, solutionController.create);
router.post("/solutions/:solutionId/vote", authenticate, solutionController.toggleVote);

export default router;
