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
        trim: true,
        maxlength: 2000,
        default: "",
    },
    solution: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: "",
    },
    impact: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
    },
    suggestedTechStack: {
        type: String,
        trim: true,
    },
    techStack: [{
        type: String,
    }],
    estimatedTime: {
        type: String,
    },
    embedding: {
        type: [Number],
        index: "2dsphere", // or just keep it simple if you don't use geospatial
    },
    workflow: {
        type: String,
        default: "",
    },
    architecture: {
        type: String,
        default: "",
    },
    roadmap: [{
        phase: String,
        tasks: [String]
    }],
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "published",
        index: true,
    },
    attachments: [{
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, default: "image" },
        size: { type: Number, default: 0 },
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
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
