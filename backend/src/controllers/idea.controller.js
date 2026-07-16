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
            const { title, problem, solution, impact, difficulty, category, tags, suggestedTechStack } = req.body;

            const idea = await ideaService.create({
                title,
                problem,
                solution,
                impact,
                difficulty,
                category,
                tags,
                suggestedTechStack,
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
     * Get ideas created by the authenticated user.
     */
    async getMyIdeas(req, res, next) {
        try {
            const ideas = await ideaService.getByAuthor(req.user.id);

            return res.status(200).json({
                status: "success",
                data: { ideas },
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
            const stats = await ideaService.getDashboardStats(req.user.id);
            const ideas = await ideaService.getByAuthor(req.user.id);

            return res.status(200).json({
                status: "success",
                data: { stats, ideas },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default ideaController;
