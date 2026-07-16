/**
 * Comment Controller
 * ------------------
 * HTTP layer for comment endpoints.
 */

import Comment from "../../models/comment.js";
import AppError from "../utils/AppError.js";

const commentController = {
    /**
     * GET /api/v1/comments?ideaId=x
     */
    async list(req, res, next) {
        try {
            const { ideaId } = req.query;
            if (!ideaId) {
                throw new AppError("ideaId query parameter is required", 400);
            }

            const comments = await Comment.find({ idea: ideaId })
                .sort({ createdAt: 1 })
                .populate("user", "username")
                .lean();

            return res.status(200).json({
                status: "success",
                data: {
                    comments: comments.map(c => ({
                        ...c,
                        id: c._id.toString(),
                    })),
                },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/comments
     * Body: { ideaId, text }
     */
    async create(req, res, next) {
        try {
            const { ideaId, text } = req.body;

            if (!ideaId || !text?.trim()) {
                throw new AppError("ideaId and text are required", 400);
            }

            const comment = await Comment.create({
                idea: ideaId,
                user: req.user.id,
                text: text.trim(),
            });

            // Populate user for the response
            await comment.populate("user", "username");

            return res.status(201).json({
                status: "success",
                data: {
                    comment: {
                        ...comment.toObject(),
                        id: comment._id.toString(),
                    },
                },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * DELETE /api/v1/comments/:id
     */
    async delete(req, res, next) {
        try {
            const comment = await Comment.findById(req.params.id);
            if (!comment) {
                throw new AppError("Comment not found", 404);
            }
            if (comment.user.toString() !== req.user.id) {
                throw new AppError("You can only delete your own comments", 403);
            }

            await Comment.findByIdAndDelete(req.params.id);

            return res.status(200).json({
                status: "success",
                message: "Comment deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    },
};

export default commentController;
