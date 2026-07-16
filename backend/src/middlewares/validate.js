/**
 * Validate Middleware
 * ------------------
 * Collects validation errors left by express-validator chains and returns
 * a structured 422 response if any exist. If there are no errors, the
 * request passes through to the next middleware/controller.
 *
 * Response shape on failure:
 * {
 *   "status": "fail",
 *   "errors": [
 *     { "field": "email", "message": "Must be a valid email address" },
 *     { "field": "password", "message": "Password is required" }
 *   ]
 * }
 */

import { validationResult } from "express-validator";

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(422).json({
      status: "fail",
      errors: formatted,
    });
  }

  next();
}

export default validate;
