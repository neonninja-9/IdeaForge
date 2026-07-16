import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Prevent a user from voting on the same idea twice
voteSchema.index({ idea: 1, user: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
