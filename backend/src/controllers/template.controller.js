import Template from "../../models/template.js";

const templateController = {
    /** GET /api/v1/templates */
    async list(req, res, next) {
        try {
            const templates = await Template.find().sort({ createdAt: 1 }).lean();
            return res.status(200).json({
                status: "success",
                data: { templates },
            });
        } catch (err) {
            next(err);
        }
    }
};

export default templateController;
