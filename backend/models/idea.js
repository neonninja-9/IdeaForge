import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    problem: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    solution: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
    },
    impact: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },
    suggestedTechStack: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "published",
        index: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    }],
}, {
    timestamps: true,
});

// Text index for search
ideaSchema.index({ title: "text", problem: "text", solution: "text" });

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;
