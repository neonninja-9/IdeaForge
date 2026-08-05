import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

/**
 * Middleware to validate MongoDB ObjectIds in URL parameters
 * Prevents Mongoose CastErrors when querying by malformed IDs.
 */
export const validateObjectId = (paramName = "id") => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (id && !mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError(`Invalid ${paramName}: ${id}`, 400));
        }
        next();
    };
};
