import morgan from "morgan";
import logger from "../config/logger.js";

// Stream morgan logs to Winston
const stream = {
  write: (message) => {
    // Morgan outputs a string with a newline at the end; trim it.
    logger.info(message.trim());
  },
};

// Morgan format string
const format =
  ":remote-addr - :method :url :status :res[content-length] - :response-time ms";

// Middleware for logging successful responses
export const morganSuccessHandler = morgan(format, {
  stream,
  skip: (req, res) => res.statusCode >= 400,
});

// Middleware for logging error responses
export const morganErrorHandler = morgan(format, {
  stream,
  skip: (req, res) => res.statusCode < 400,
});
