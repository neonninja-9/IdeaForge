import User from "../../models/user.js";
import AppError from "../utils/AppError.js";
import { toPublicUser } from "../transformers/user.transformer.js";

const allowedPreferenceKeys = ["productUpdates", "weeklyReflection"];

const userController = {
    /** PATCH /api/v1/users/me */
    async updateMe(req, res, next) {
        try {
            const updates = {};
            if (typeof req.body.username === "string") updates.username = req.body.username.trim();
            if (typeof req.body.email === "string") updates.email = req.body.email.trim().toLowerCase();
            if (!Object.keys(updates).length) throw new AppError("Provide a username or email to update", 400);

            if (updates.username && (updates.username.length < 2 || updates.username.length > 50)) {
                throw new AppError("Username must be between 2 and 50 characters", 400);
            }
            if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
                throw new AppError("Provide a valid email address", 400);
            }

            const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
            if (!user) throw new AppError("User not found", 404);
            return res.status(200).json({ status: "success", data: { user: toPublicUser(user) } });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/v1/users/me/preferences */
    async getPreferences(req, res, next) {
        try {
            const user = await User.findById(req.user.id).select("preferences").lean();
            if (!user) throw new AppError("User not found", 404);
            return res.status(200).json({ status: "success", data: { preferences: user.preferences } });
        } catch (err) {
            next(err);
        }
    },

    /** PUT /api/v1/users/me/preferences */
    async updatePreferences(req, res, next) {
        try {
            const input = req.body.preferences;
            if (!input || typeof input !== "object" || Array.isArray(input)) {
                throw new AppError("preferences must be an object", 400);
            }
            const preferences = {};
            for (const key of allowedPreferenceKeys) {
                if (typeof input[key] === "boolean") preferences[key] = input[key];
            }
            if (!Object.keys(preferences).length) throw new AppError("Provide at least one valid preference", 400);

            const user = await User.findByIdAndUpdate(req.user.id, { $set: { preferences } }, { new: true });
            if (!user) throw new AppError("User not found", 404);
            return res.status(200).json({ status: "success", data: { preferences: user.preferences } });
        } catch (err) {
            next(err);
        }
    },
};

export default userController;
