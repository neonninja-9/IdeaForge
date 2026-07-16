/**
 * AppError
 * --------
 * Custom error class for operational errors (validation failures,
 * auth failures, not-found, etc.). Carries an HTTP statusCode so
 * the global error handler can respond appropriately.
 *
 * `isOperational` distinguishes expected errors from unexpected
 * programming bugs — only operational errors are sent to clients.
 */

class AppError extends Error {
  /**
   * @param {string}  message    — Human-readable error description
   * @param {number}  statusCode — HTTP status code (default 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture a clean stack trace excluding the constructor frame
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
