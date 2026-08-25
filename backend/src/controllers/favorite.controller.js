import Favorite from "../../models/favorite.js";
import AppError from "../utils/AppError.js";

/**
 * Get all favorited idea IDs or populated idea objects for the current user
 * GET /api/v1/favorites
 * Query param: populate=true
 */
export const getFavorites = async (req, res, next) => {
    try {
        const { populate } = req.query;
        if (populate === "true") {
            const favorites = await Favorite.find({ user: req.user.id })
                .populate({
                    path: "idea",
                    populate: [
                        { path: "author", select: "username" },
                        { path: "category", select: "name slug icon" },
                        { path: "tags", select: "name slug" },
                    ],
                })
                .sort({ createdAt: -1 })
                .lean();

            const Vote = (await import("../../models/vote.js")).default;
            const Comment = (await import("../../models/comment.js")).default;

            const validFavorites = favorites.filter(f => f.idea);
            const ideaIds = validFavorites.map(f => f.idea._id);

            const [voteCounts, commentCounts] = await Promise.all([
                Vote.aggregate([
                    { $match: { idea: { $in: ideaIds } } },
                    { $group: { _id: "$idea", count: { $sum: 1 } } },
                ]),
                Comment.aggregate([
                    { $match: { idea: { $in: ideaIds } } },
                    { $group: { _id: "$idea", count: { $sum: 1 } } },
                ]),
            ]);

            const voteMap = Object.fromEntries(voteCounts.map(v => [v._id.toString(), v.count]));
            const commentMap = Object.fromEntries(commentCounts.map(c => [c._id.toString(), c.count]));

            const ideas = validFavorites.map(f => ({
                ...f.idea,
                id: f.idea._id.toString(),
                voteCount: voteMap[f.idea._id.toString()] || 0,
                commentCount: commentMap[f.idea._id.toString()] || 0,
            }));

            return res.status(200).json({
                status: "success",
                data: {
                    favorites: ideaIds,
                    ideas,
                },
            });
        }

        const favorites = await Favorite.find({ user: req.user.id }).select("idea");
        const ideaIds = favorites.map(f => f.idea);
        
        return res.status(200).json({
            status: "success",
            data: {
                favorites: ideaIds,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add an idea to favorites
 * POST /api/v1/favorites/:ideaId
 */
export const addFavorite = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        
        const existing = await Favorite.findOne({ idea: ideaId, user: req.user.id });
        if (existing) {
            return res.status(200).json({
                status: "success",
                data: { favorite: existing },
            });
        }
        
        const favorite = await Favorite.create({
            idea: ideaId,
            user: req.user.id,
        });

        res.status(201).json({
            status: "success",
            data: {
                favorite,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove an idea from favorites
 * DELETE /api/v1/favorites/:ideaId
 */
export const removeFavorite = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        
        await Favorite.findOneAndDelete({
            idea: ideaId,
            user: req.user.id,
        });

        res.status(200).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};
