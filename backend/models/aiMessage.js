import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AiConversation",
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const AiMessage = mongoose.model("AiMessage", aiMessageSchema);

export default AiMessage;
