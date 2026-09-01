import express from "express";
import path from "path";
import connectDB from "./db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./src/config/logger.js";
import { morganSuccessHandler, morganErrorHandler } from "./src/middlewares/morgan.js";

// ─── Versioned Routers ────────────────────────────────────────
import v1Router from "./src/routes/v1/index.js";

const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(",") : true;

// ─── Global Middleware ─────────────────────────────────────────
app.use(morganSuccessHandler);
app.use(morganErrorHandler);
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// ─── Static Uploads ────────────────────────────────────────────
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// ─── Database Connection ───────────────────────────────────────
connectDB()
    .then(() => {
        logger.info("Database Connected");
    })
    .catch((error) => {
        logger.error(`Database connection failed: ${error.message}`);
    });

// ─── Health Check ──────────────────────────────────────────────
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to IdeaForge API",
    });
});

// ─── API v1 Routes ─────────────────────────────────────────────
app.use("/api/v1", v1Router);

// ─── Global Error Handler ──────────────────────────────────────
// Must be defined AFTER all routes (Express identifies error handlers
// by their 4-argument signature).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    // Operational errors thrown by our AppError class
    if (err.isOperational) {
        logger.warn(`[${req.method} ${req.originalUrl}] Operational error: ${err.message}`);
        return res.status(err.statusCode).json({
            status: "fail",
            message: err.message,
        });
    }

    // Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        logger.warn(`[${req.method} ${req.originalUrl}] Invalid ID format for field ${err.path}`);
        return res.status(400).json({
            status: "fail",
            message: `Invalid ID format for ${err.path}`,
        });
    }

    // Mongoose duplicate-key error (e.g. unique index violation)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        logger.warn(`[${req.method} ${req.originalUrl}] Duplicate key error: ${field}`);
        return res.status(409).json({
            status: "fail",
            message: `A record with this ${field} already exists`,
        });
    }

    // Unexpected errors — log full stack, send generic message
    logger.error(`[${req.method} ${req.originalUrl}] UNHANDLED ERROR:`, err);
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

// Only start the server if we're not running in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        logger.info(`Server is listening on port ${PORT}`);
    });
}

export default app;