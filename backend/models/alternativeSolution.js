import mongoose from "mongoose";

const alternativeSolutionSchema = new mongoose.Schema({
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    techStack: {
        type: String,
        trim: true,
        maxlength: 500
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

export default mongoose.model("AlternativeSolution", alternativeSolutionSchema);
