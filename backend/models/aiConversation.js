import mongoose from "mongoose";

const aiConversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        default: "New Conversation",
        trim: true,
    },
}, {
    timestamps: true,
});

const AiConversation = mongoose.model("AiConversation", aiConversationSchema);

export default AiConversation;
