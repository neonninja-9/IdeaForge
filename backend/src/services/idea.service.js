/**
 * Idea Service
 * ------------
 * Business logic for idea CRUD operations.
 */

import Idea from "../../models/idea.js";
import Vote from "../../models/vote.js";
import Comment from "../../models/comment.js";
import Category from "../../models/category.js";
import Tag from "../../models/tag.js";
import AppError from "../utils/AppError.js";


const ideaService = {
    /**
     * List ideas with optional filtering, search, and sorting.
     */
    async list({ q, category, tag, difficulty, sort = "newest", page = 1, limit = 20 }) {
        // Only show published ideas in public listings
        const filter = { status: "published" };

        if (q) {
            filter.$text = { $search: q };
        }

        if (category) {
            filter.category = category;
        }

        if (tag) {
            filter.tags = tag;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        let sortOption = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        // "top" and "discussed" require aggregation, handled below

        const skip = (page - 1) * limit;

        const [ideas, total] = await Promise.all([
            Idea.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .populate("author", "username")
                .populate("category", "name slug icon")
                .populate("tags", "name slug")
                .lean(),
            Idea.countDocuments(filter),
        ]);

        // Attach vote and comment counts
        const ideaIds = ideas.map(i => i._id);
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

        let enriched = ideas.map(idea => ({
            ...idea,
            id: idea._id.toString(),
            voteCount: voteMap[idea._id.toString()] || 0,
            commentCount: commentMap[idea._id.toString()] || 0,
        }));

        // Sort by votes or comments if requested
        if (sort === "top") {
            enriched.sort((a, b) => b.voteCount - a.voteCount);
        } else if (sort === "discussed") {
            enriched.sort((a, b) => b.commentCount - a.commentCount);
        }

        return {
            ideas: enriched,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },

    /**
     * Get a single idea by ID with full details.
     */
    async getById(ideaId, userId = null) {
        const idea = await Idea.findById(ideaId)
            .populate("author", "username")
            .populate("category", "name slug icon")
            .populate("tags", "name slug")
            .lean();

        if (!idea) {
            throw new AppError("Idea not found", 404);
        }

        const [voteCount, commentCount, userVote] = await Promise.all([
            Vote.countDocuments({ idea: ideaId }),
            Comment.countDocuments({ idea: ideaId }),
            userId ? Vote.findOne({ idea: ideaId, user: userId }) : null,
        ]);

        return {
            ...idea,
            id: idea._id.toString(),
            voteCount,
            commentCount,
            hasVoted: !!userVote,
        };
    },

    /**
     * Create a new idea.
     */
    async create(data) {
        // If no category was provided (e.g. AI categorization was skipped on the frontend),
        // fall back to the "general" category instead of calling the AI classifier again.
        // The frontend's /ai/categorize endpoint handles the primary AI categorization
        // with tags + difficulty included, so we don't override that here.
        if (!data.category) {
            const general = await Category.findOne({ slug: "general" }).lean();
            if (general) {
                data.category = general._id;
            }
        }

        const idea = await Idea.create(data);
        return idea;
    },

    /**
     * Update an existing idea (only by its author).
     */
    async update(ideaId, userId, data) {
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            throw new AppError("Idea not found", 404);
        }
        if (idea.author.toString() !== userId) {
            throw new AppError("You can only edit your own ideas", 403);
        }

        if (data.category) {
            const cat = await Category.findById(data.category);
            if (!cat) throw new AppError("Invalid category", 400);
        }
        if (data.tags && data.tags.length > 0) {
            const tags = await Tag.find({ _id: { $in: data.tags } });
            if (tags.length !== data.tags.length) throw new AppError("One or more tags are invalid", 400);
        }

        // Build update object, including status if provided
        const updateData = { ...data };

        const updated = await Idea.findByIdAndUpdate(ideaId, updateData, { new: true, runValidators: true })
            .populate("author", "username")
            .populate("category", "name slug icon")
            .populate("tags", "name slug")
            .lean();

        return updated;
    },

    /**
     * Delete an idea (only by its author).
     */
    async delete(ideaId, userId) {
        const idea = await Idea.findById(ideaId);
        if (!idea) {
            throw new AppError("Idea not found", 404);
        }
        if (idea.author.toString() !== userId) {
            throw new AppError("You can only delete your own ideas", 403);
        }

        // Clean up related votes and comments
        await Promise.all([
            Vote.deleteMany({ idea: ideaId }),
            Comment.deleteMany({ idea: ideaId }),
            Idea.findByIdAndDelete(ideaId),
        ]);

        return { deleted: true };
    },

    /**
     * Get ideas created by a specific user with pagination.
     */
    async getByAuthor(userId, { page = 1, limit = 20 } = {}) {
        const skip = (page - 1) * limit;

        const [ideas, total] = await Promise.all([
            Idea.find({ author: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category", "name slug icon")
                .populate("tags", "name slug")
                .lean(),
            Idea.countDocuments({ author: userId }),
        ]);

        const ideaIds = ideas.map(i => i._id);
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

        const enriched = ideas.map(idea => ({
            ...idea,
            id: idea._id.toString(),
            voteCount: voteMap[idea._id.toString()] || 0,
            commentCount: commentMap[idea._id.toString()] || 0,
        }));

        return {
            ideas: enriched,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },

    /**
     * Get dashboard stats for a user.
     */
    async getDashboardStats(userId) {
        const userIdeas = await Idea.find({ author: userId }).select("_id").lean();
        const ideaIds = userIdeas.map(i => i._id);

        const [ideasCount, totalVotes, totalComments] = await Promise.all([
            ideaIds.length,
            Vote.countDocuments({ idea: { $in: ideaIds } }),
            Comment.countDocuments({ idea: { $in: ideaIds } }),
        ]);

        return { ideasCount, totalVotes, totalComments };
    },
};

export default ideaService;
