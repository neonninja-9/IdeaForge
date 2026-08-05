import Notification from "../../models/notification.js";
import AppError from "../utils/AppError.js";

const notificationController = {
    /** GET /api/v1/notifications */
    async list(req, res, next) {
        try {
            const notifications = await Notification.find({ recipient: req.user.id })
                .sort({ createdAt: -1 })
                .limit(50)
                .populate("actor", "username avatarUrl")
                .populate("idea", "title")
                .lean();

            return res.status(200).json({
                status: "success",
                data: { notifications },
            });
        } catch (err) {
            next(err);
        }
    },

    /** PATCH /api/v1/notifications/:id/read */
    async markRead(req, res, next) {
        try {
            const notification = await Notification.findOneAndUpdate(
                { _id: req.params.id, recipient: req.user.id },
                { read: true },
                { new: true }
            );

            if (!notification) {
                throw new AppError("Notification not found", 404);
            }

            return res.status(200).json({
                status: "success",
                data: { notification },
            });
        } catch (err) {
            next(err);
        }
    }
};

export default notificationController;
