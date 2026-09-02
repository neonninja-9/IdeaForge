/**
 * Idea Controller
 * ---------------
 * HTTP layer for idea endpoints.
 */

import ideaService from "../services/idea.service.js";
import elasticsearchService from "../services/elasticsearch.service.js";

const ideaController = {
    /**
     * GET /api/v1/ideas/search?q=...
     */
    async search(req, res, next) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(200).json({ status: "success", data: [] });
            }
            const results = await elasticsearchService.searchIdeas(q);
            return res.status(200).json({
                status: "success",
                data: results,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/ideas/tags/suggest?q=...
     */
    async suggestTags(req, res, next) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(200).json({ status: "success", data: [] });
            }
            const results = await elasticsearchService.suggestTags(q);
            return res.status(200).json({
                status: "success",
                data: results,
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/ideas
     * Query params: q, category, tag, difficulty, sort, page, limit
     */
    async list(req, res, next) {
        try {
            const { q, category, tag, difficulty, sort, page, limit } = req.query;
            
            console.log("ES Search Params:", { q, category, difficulty, sort, page, limit });
            
            // Route through Elasticsearch for unified live grid features
            const result = await elasticsearchService.searchIdeas({
                q: q || "",
                category: category || "",
                difficulty: difficulty || "",
                sort: sort || "newest",
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 20,
            });
            console.log(`ES Search returned ${result.total} results`);

            // Map ES results to include necessary pseudo-populated fields for the frontend
            const mappedIdeas = result.ideas.map(esIdea => ({
                id: esIdea.id,
                _id: esIdea.id,
                title: esIdea.title,
                problem: esIdea.problem,
                difficulty: esIdea.difficulty,
                upvotes: esIdea.upvotes,
                commentCount: esIdea.commentCount,
                createdAt: esIdea.createdAt,
                category: { slug: esIdea.category, name: esIdea.category },
                author: { username: esIdea.authorUsername },
                tags: esIdea.tags?.map(t => ({ name: t })) || []
            }));

            return res.status(200).json({
                status: "success",
                data: {
                    ideas: mappedIdeas,
                    total: result.total,
                    page: result.page,
                    totalPages: result.totalPages
                },
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
            const { title, problem, solution, impact, difficulty, category, tags, suggestedTechStack, status, attachments } = req.body;

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
                attachments: Array.isArray(attachments) ? attachments : [],
                author: req.user.id,
            });

            // Fetch the fully populated idea to index in Elasticsearch
            const populatedIdea = await ideaService.getById(idea._id);
            if (populatedIdea) {
                // Fire and forget ES indexing
                elasticsearchService.indexIdea(populatedIdea).catch(err => {
                    console.error("Failed to index new idea to ES:", err.message);
                });
            }

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
            const { title, problem, solution, impact, difficulty, category, tags, suggestedTechStack, status, attachments } = req.body;
            
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
            if (attachments !== undefined) data.attachments = Array.isArray(attachments) ? attachments : [];

            const idea = await ideaService.update(req.params.id, req.user.id, data);

            // Fetch the fully populated idea to update in Elasticsearch
            const populatedIdea = await ideaService.getById(idea._id);
            if (populatedIdea) {
                // Fire and forget ES indexing
                elasticsearchService.indexIdea(populatedIdea).catch(err => {
                    console.error("Failed to update idea in ES:", err.message);
                });
            }

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

            // Fire and forget ES deletion
            elasticsearchService.deleteIdea(req.params.id).catch(err => {
                console.error("Failed to delete idea from ES:", err.message);
            });

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
