import ProjectCanvas from "../../models/projectCanvas.js";
import AppError from "../utils/AppError.js";

const projectController = {
    /** GET /api/v1/projects/canvas */
    async getCanvas(req, res, next) {
        try {
            const canvas = await ProjectCanvas.findOne({ user: req.user.id }).lean();
            return res.status(200).json({
                status: "success",
                data: {
                    notes: canvas?.notes || {},
                    updatedAt: canvas?.updatedAt || null,
                },
            });
        } catch (err) {
            next(err);
        }
    },

    /** PUT /api/v1/projects/canvas */
    async saveCanvas(req, res, next) {
        try {
            const { notes } = req.body;
            if (!notes || typeof notes !== "object" || Array.isArray(notes)) {
                throw new AppError("notes must be an object of canvas entries", 400);
            }

            const sanitizedNotes = Object.fromEntries(
                Object.entries(notes)
                    .filter(([key, value]) => typeof key === "string" && typeof value === "string")
                    .map(([key, value]) => [key.trim().slice(0, 80), value.trim().slice(0, 5000)])
                    .filter(([key]) => key.length > 0)
            );

            const canvas = await ProjectCanvas.findOneAndUpdate(
                { user: req.user.id },
                { user: req.user.id, notes: sanitizedNotes },
                { new: true, upsert: true, runValidators: true }
            ).lean();

            return res.status(200).json({
                status: "success",
                data: { notes: canvas.notes, updatedAt: canvas.updatedAt },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default projectController;
