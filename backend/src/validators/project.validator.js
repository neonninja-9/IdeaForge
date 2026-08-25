import { body } from "express-validator";

export const projectCanvasRules = [
    body("notes")
        .notEmpty().withMessage("notes must be provided")
        .isObject().withMessage("notes must be an object of canvas entries")
        .custom((value) => {
            if (Array.isArray(value)) {
                throw new Error("notes must be an object, not an array");
            }
            return true;
        }),
];
