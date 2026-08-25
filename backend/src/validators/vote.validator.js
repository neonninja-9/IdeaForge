import { body } from "express-validator";

export const voteRules = [
    body("ideaId")
        .notEmpty().withMessage("ideaId is required")
        .isMongoId().withMessage("ideaId must be a valid MongoDB ObjectId"),
];
