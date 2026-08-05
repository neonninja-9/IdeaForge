import { body } from "express-validator";

export const commentRules = [
    body("ideaId")
        .notEmpty().withMessage("ideaId is required")
        .isMongoId().withMessage("ideaId must be a valid MongoDB ObjectId"),
    body("text")
        .notEmpty().withMessage("comment text is required")
        .trim()
        .isLength({ min: 1, max: 1000 }).withMessage("Comment text must be between 1 and 1000 characters"),
];
