/**
 * Wallet Routes
 * -------------
 * GET /api/v1/wallet          → get wallet balance
 * GET /api/v1/wallet/history  → paginated transaction history
 */

import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import walletController from "../../controllers/wallet.controller.js";

const router = Router();

router.get("/", authenticate, walletController.getWallet);
router.get("/history", authenticate, walletController.getTransactions);

export default router;
