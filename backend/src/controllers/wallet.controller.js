/**
 * Wallet Controller
 * -----------------
 * HTTP layer for wallet endpoints.
 */

import creditService from "../services/credit.service.js";

const walletController = {
    /**
     * GET /api/v1/wallet
     * Returns the authenticated user's wallet balance.
     */
    async getWallet(req, res, next) {
        try {
            const wallet = await creditService.getWallet(req.user.id);
            return res.status(200).json({
                status: "success",
                data: { wallet },
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * GET /api/v1/wallet/history
     * Returns paginated transaction history.
     * Query params: page, limit
     */
    async getTransactions(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await creditService.getTransactions(req.user.id, { page, limit });
            return res.status(200).json({
                status: "success",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};

export default walletController;
