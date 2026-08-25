/**
 * Vote Controller
 * ---------------
 * HTTP layer for vote endpoints.
 */

import Vote from "../../models/vote.js";
import AppError from "../utils/AppError.js";

const voteController = {
    /**
     * POST /api/v1/votes/toggle
     * Body: { ideaId }
     * Toggles the vote: if user already voted, removes it; otherwise adds it.
     */
    async toggle(req, res, next) {
        try {
            const { ideaId } = req.body;

            if (!ideaId) {
                throw new AppError("ideaId is required", 400);
            }

            const existing = await Vote.findOne({
                idea: ideaId,
                user: req.user.id,
            });

            if (existing) {
                await Vote.findByIdAndDelete(existing._id);
                const newCount = await Vote.countDocuments({ idea: ideaId });
                return res.status(200).json({
                    status: "success",
                    data: { voted: false, voteCount: newCount },
                });
            }

            await Vote.create({ idea: ideaId, user: req.user.id });
            const newCount = await Vote.countDocuments({ idea: ideaId });

            // Generate notification for idea owner
            const Idea = (await import("../../models/idea.js")).default;
            const idea = await Idea.findById(ideaId).lean();
            if (idea && idea.author.toString() !== req.user.id) {
                const Notification = (await import("../../models/notification.js")).default;
                await Notification.create({
                    recipient: idea.author,
                    actor: req.user.id,
                    type: "vote",
                    idea: idea._id
                });
            }

            return res.status(201).json({
                status: "success",
                data: { voted: true, voteCount: newCount },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default voteController;
