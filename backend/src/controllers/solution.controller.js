import AlternativeSolution from "../../models/alternativeSolution.js";
import AppError from "../utils/AppError.js";
import Idea from "../../models/idea.js";
import Notification from "../../models/notification.js";

const solutionController = {
    /**
     * GET /api/v1/ideas/:ideaId/solutions
     */
    async list(req, res, next) {
        try {
            const { ideaId } = req.params;
            if (!ideaId) {
                throw new AppError("ideaId is required", 400);
            }

            const solutions = await AlternativeSolution.find({ idea: ideaId })
                .sort({ upvotes: -1, createdAt: -1 })
                .populate("author", "username avatar")
                .lean();

            return res.status(200).json({
                status: "success",
                data: {
                    solutions: solutions.map(s => ({
                        ...s,
                        id: s._id.toString(),
                    })),
                },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/ideas/:ideaId/solutions
     */
    async create(req, res, next) {
        try {
            const { ideaId } = req.params;
            const { title, description, techStack } = req.body;

            if (!ideaId) {
                throw new AppError("ideaId is required", 400);
            }
            if (!title?.trim() || !description?.trim()) {
                throw new AppError("Title and description are required", 400);
            }

            const solution = await AlternativeSolution.create({
                idea: ideaId,
                author: req.user.id,
                title: title.trim(),
                description: description.trim(),
                techStack: techStack?.trim() || "",
            });

            // Generate notification for idea owner
            const ideaObj = await Idea.findById(ideaId).lean();
            if (ideaObj && ideaObj.author.toString() !== req.user.id) {
                await Notification.create({
                    recipient: ideaObj.author,
                    actor: req.user.id,
                    type: "solution",
                    idea: ideaObj._id
                });
            }

            await solution.populate("author", "username avatar");

            return res.status(201).json({
                status: "success",
                data: {
                    solution: {
                        ...solution.toObject(),
                        id: solution._id.toString(),
                    },
                },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/solutions/:solutionId/vote
     */
    async toggleVote(req, res, next) {
        try {
            const { solutionId } = req.params;
            const userId = req.user.id;

            const solution = await AlternativeSolution.findById(solutionId);
            if (!solution) {
                throw new AppError("Solution not found", 404);
            }

            const index = solution.upvotedBy.indexOf(userId);
            let voted = false;

            if (index === -1) {
                solution.upvotedBy.push(userId);
                solution.upvotes += 1;
                voted = true;
                
                // Notify author of solution if it's someone else
                if (solution.author.toString() !== userId) {
                    await Notification.create({
                        recipient: solution.author,
                        actor: userId,
                        type: "upvote",
                        idea: solution.idea
                    });
                }
            } else {
                solution.upvotedBy.splice(index, 1);
                solution.upvotes = Math.max(0, solution.upvotes - 1);
                voted = false;
            }

            await solution.save();

            return res.status(200).json({
                status: "success",
                data: {
                    voted,
                    upvotes: solution.upvotes,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default solutionController;
