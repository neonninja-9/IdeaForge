import AppError from "../utils/AppError.js";

/**
 * Deterministic assistant fallback. Replace this with a configured model provider
 * when AI credentials are available; the frontend contract stays the same.
 */
const aiController = {
    /** POST /api/v1/ai/assist */
    async assist(req, res, next) {
        try {
            const { message, context } = req.body;
            if (typeof message !== "string" || !message.trim()) {
                throw new AppError("message is required", 400);
            }
            const prompt = message.trim().slice(0, 4000);
            const focus = typeof context?.ideaTitle === "string" && context.ideaTitle.trim()
                ? ` for “${context.ideaTitle.trim().slice(0, 120)}”`
                : "";
            const response = `A useful next move${focus} is to narrow “${prompt}” into one specific user, one recurring moment, and one measurable outcome. Turn that into a lightweight experiment before expanding the solution.`;
            return res.status(200).json({ status: "success", data: { message: response, provider: "built-in" } });
        } catch (err) {
            next(err);
        }
    },
};

export default aiController;
