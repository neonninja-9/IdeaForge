/**
 * Auth Validators
 * ---------------
 * Declarative validation & sanitization chains built with express-validator.
 * Each export is an array of middleware that validates/sanitizes specific
 * request fields before the controller ever sees them.
 *
 * These chains do NOT send responses — they only attach validation errors
 * to the request. The `validate` middleware (see middlewares/validate.js)
 * collects and formats those errors into a 422 response.
 */

import { body } from "express-validator";

/**
 * POST /api/v1/auth/register
 *
 * Validates:
 *   - username : 3-30 chars, alphanumeric + underscores only, trimmed
 *   - email    : valid email format, normalized (lowercase, Gmail dot-removal)
 *   - password : min 8 chars, at least one uppercase letter, at least one digit
 */
export const registerRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username may only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit"),
];

/**
 * POST /api/v1/auth/login
 *
 * Validates:
 *   - email    : not empty, valid format, normalized
 *   - password : not empty (we don't enforce strength rules on login)
 */
export const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];
