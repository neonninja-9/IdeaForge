import { body } from "express-validator";

export const createIdeaRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("problem")
    .trim()
    .notEmpty()
    .withMessage("Problem description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Problem description must be between 20 and 2000 characters"),

  body("solution")
    .trim()
    .notEmpty()
    .withMessage("Solution description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Solution description must be between 20 and 2000 characters"),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Difficulty must be Beginner, Intermediate, or Advanced"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("tags")
    .isArray({ min: 1 })
    .withMessage("At least one tag is required"),

  body("tags.*")
    .isMongoId()
    .withMessage("Invalid tag ID format"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
];

export const updateIdeaRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("problem")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Problem description must be between 20 and 2000 characters"),

  body("solution")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Solution description must be between 20 and 2000 characters"),

  body("difficulty")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Difficulty must be Beginner, Intermediate, or Advanced"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid tag ID format"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
];
