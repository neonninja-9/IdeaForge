import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
    },
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

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
