/**
 * Tag Controller
 * --------------
 * HTTP layer for tag endpoints.
 */

import Tag from "../../models/tag.js";

const tagController = {
    /**
     * GET /api/v1/tags
     */
    async list(_req, res, next) {
        try {
            const tags = await Tag.find().sort({ name: 1 }).lean();

            return res.status(200).json({
                status: "success",
                data: {
                    tags: tags.map(t => ({
                        ...t,
                        id: t._id.toString(),
                    })),
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default tagController;
