import { body } from "express-validator";

export const updateProfileRules = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Username must be between 2 and 50 characters"),
    body("email")
        .optional()
        .trim()
        .toLowerCase()
        .isEmail().withMessage("Provide a valid email address"),
    body().custom((value) => {
        if (!value.username && !value.email) {
            throw new Error("Provide a username or email to update");
        }
        return true;
    }),
];

export const updatePreferencesRules = [
    body("preferences")
        .notEmpty().withMessage("preferences must be provided")
        .isObject().withMessage("preferences must be an object")
        .custom((value) => {
            if (Array.isArray(value)) {
                throw new Error("preferences must be an object, not an array");
            }
            return true;
        }),
];
