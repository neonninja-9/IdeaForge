/**
 * Idea Controller
 * ---------------
 * HTTP layer for idea endpoints.
 */

import ideaService from "../services/idea.service.js";

const ideaController = {
    /**
     * GET /api/v1/ideas
     * Query params: q, category, tag, difficulty, sort, page, limit
     */
    async list(req, res, next) {
        try {
            const { q, category, tag, difficulty, sort, page, limit } = req.query;
            const result = await ideaService.list({
                q,
                category,
                tag,
                difficulty,
                sort,
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
            });

            return res.status(200).json({
                status: "success",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/ideas/:id
     */
    async getById(req, res, next) {
        try {
            const userId = req.user?.id || null;
            const idea = await ideaService.getById(req.params.id, userId);

            return res.status(200).json({
                status: "success",
                data: { idea },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * POST /api/v1/ideas
     */
    async create(req, res, next) {
        try {
            const { title, problem, solution, impact, difficulty, category, tags, suggestedTechStack, status } = req.body;

            const idea = await ideaService.create({
                title,
                problem,
                solution,
                impact,
                difficulty,
                category,
                tags,
                suggestedTechStack,
                status,
                author: req.user.id,
            });

            return res.status(201).json({
                status: "success",
                data: { idea },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * PATCH /api/v1/ideas/:id
     */
    async update(req, res, next) {
        try {
            // Pick only allowed fields
            const { title, problem, solution, impact, difficulty, category, tags, suggestedTechStack, status } = req.body;
            
            // Basic body validation
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ status: "fail", message: "No data provided to update" });
            }

            const data = {};
            if (title !== undefined) data.title = title;
            if (problem !== undefined) data.problem = problem;
            if (solution !== undefined) data.solution = solution;
            if (impact !== undefined) data.impact = impact;
            if (difficulty !== undefined) data.difficulty = difficulty;
            if (category !== undefined) data.category = category;
            if (tags !== undefined) data.tags = tags;
            if (suggestedTechStack !== undefined) data.suggestedTechStack = suggestedTechStack;
            if (status !== undefined) data.status = status;

            const idea = await ideaService.update(req.params.id, req.user.id, data);

            return res.status(200).json({
                status: "success",
                data: { idea },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * DELETE /api/v1/ideas/:id
     */
    async delete(req, res, next) {
        try {
            await ideaService.delete(req.params.id, req.user.id);

            return res.status(200).json({
                status: "success",
                message: "Idea deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/ideas/my
     * Get ideas created by the authenticated user with optional pagination.
     */
    async getMyIdeas(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const result = await ideaService.getByAuthor(req.user.id, { page, limit });

            return res.status(200).json({
                status: "success",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/ideas/dashboard
     * Get dashboard stats for the authenticated user.
     */
    async dashboard(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;

            const stats = await ideaService.getDashboardStats(req.user.id);
            const userIdeas = await ideaService.getByAuthor(req.user.id, { page, limit });

            return res.status(200).json({
                status: "success",
                data: {
                    stats,
                    ideas: userIdeas.ideas,
                    total: userIdeas.total,
                    page: userIdeas.page,
                    totalPages: userIdeas.totalPages,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default ideaController;
