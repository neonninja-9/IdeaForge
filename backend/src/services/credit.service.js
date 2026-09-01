/**
 * Credit Service (ForgeCoins Engine)
 * -----------------------------------
 * Core orchestration module for the demo currency system.
 * Handles crediting users for idea submissions, vote milestones,
 * and comment engagement.
 */

import Wallet from "../../models/wallet.js";
import Transaction from "../../models/transaction.js";
import Vote from "../../models/vote.js";

/** Reward amounts */
const REWARDS = {
    IDEA_SUBMIT: 50,
    COMMENT_RECEIVED: 5,
    VOTE_MILESTONES: [
        { threshold: 5, reward: 25 },
        { threshold: 25, reward: 100 },
        { threshold: 100, reward: 500 },
    ],
};

const creditService = {
    /**
     * Internal helper — atomically credit a user's wallet and log a transaction.
     * Returns the updated wallet.
     */
    async _credit(userId, amount, type, reason, ideaId = null) {
        // Upsert wallet: create if it doesn't exist, increment balance
        const wallet = await Wallet.findOneAndUpdate(
            { user: userId },
            {
                $inc: { balance: amount, lifetimeEarnings: amount > 0 ? amount : 0 },
                $setOnInsert: { user: userId },
            },
            { new: true, upsert: true }
        );

        await Transaction.create({
            user: userId,
            amount,
            type,
            reason,
            relatedIdea: ideaId,
            balanceAfter: wallet.balance,
        });

        return wallet;
    },

    /**
     * Award coins when a user publishes an idea.
     * Called from idea.service.js after successful create().
     */
    async creditForIdeaSubmit(userId, ideaId) {
        try {
            await this._credit(
                userId,
                REWARDS.IDEA_SUBMIT,
                "idea_submit",
                "Published a new idea",
                ideaId
            );
        } catch (err) {
            // Credit failures should never block the main flow
            console.error("[CreditService] Failed to credit for idea submit:", err.message);
        }
    },

    /**
     * Check if an idea has crossed any vote milestones and credit the author.
     * Idempotent: checks Transaction collection to prevent duplicate awards.
     * Called from vote.controller.js after a successful upvote.
     */
    async checkVoteMilestones(ideaId, ideaAuthorId) {
        try {
            const voteCount = await Vote.countDocuments({ idea: ideaId });

            for (const milestone of REWARDS.VOTE_MILESTONES) {
                if (voteCount >= milestone.threshold) {
                    const reason = `Idea reached ${milestone.threshold} votes`;

                    // Check if this milestone was already credited
                    const alreadyCredited = await Transaction.findOne({
                        user: ideaAuthorId,
                        type: "vote_milestone",
                        relatedIdea: ideaId,
                        reason,
                    });

                    if (!alreadyCredited) {
                        await this._credit(
                            ideaAuthorId,
                            milestone.reward,
                            "vote_milestone",
                            reason,
                            ideaId
                        );
                    }
                }
            }
        } catch (err) {
            console.error("[CreditService] Failed to check vote milestones:", err.message);
        }
    },

    /**
     * Award coins to the idea author when someone else comments on their idea.
     * Called from comment.controller.js after a comment is created.
     */
    async creditForComment(ideaAuthorId, ideaId) {
        try {
            await this._credit(
                ideaAuthorId,
                REWARDS.COMMENT_RECEIVED,
                "comment_received",
                "Someone commented on your idea",
                ideaId
            );
        } catch (err) {
            console.error("[CreditService] Failed to credit for comment:", err.message);
        }
    },

    /**
     * Get or create a user's wallet.
     */
    async getWallet(userId) {
        let wallet = await Wallet.findOne({ user: userId }).lean();
        if (!wallet) {
            wallet = await Wallet.create({ user: userId });
            wallet = wallet.toObject();
        }
        return {
            balance: wallet.balance,
            lifetimeEarnings: wallet.lifetimeEarnings,
        };
    },

    /**
     * Get paginated transaction history for a user.
     */
    async getTransactions(userId, { page = 1, limit = 20 } = {}) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("relatedIdea", "title")
                .lean(),
            Transaction.countDocuments({ user: userId }),
        ]);

        return {
            transactions: transactions.map((t) => ({
                id: t._id.toString(),
                amount: t.amount,
                type: t.type,
                reason: t.reason,
                relatedIdea: t.relatedIdea
                    ? { id: t.relatedIdea._id.toString(), title: t.relatedIdea.title }
                    : null,
                balanceAfter: t.balanceAfter,
                createdAt: t.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },
};

export default creditService;
