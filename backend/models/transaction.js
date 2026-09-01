import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: [
            "idea_submit",
            "vote_milestone",
            "comment_received",
            "featured",
            "manual_adjustment",
        ],
    },
    reason: {
        type: String,
        required: true,
    },
    relatedIdea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        default: null,
    },
    balanceAfter: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

// Index for fast lookups: duplicate prevention for milestones
transactionSchema.index({ user: 1, type: 1, relatedIdea: 1, reason: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
