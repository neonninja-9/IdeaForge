/**
 * Category Controller
 * -------------------
 * HTTP layer for category endpoints.
 */

import Category from "../../models/category.js";

const categoryController = {
    /**
     * GET /api/v1/categories
     */
    async list(_req, res, next) {
        try {
            const categories = await Category.find().sort({ name: 1 }).lean();

            return res.status(200).json({
                status: "success",
                data: {
                    categories: categories.map(c => ({
                        ...c,
                        id: c._id.toString(),
                    })),
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default categoryController;
