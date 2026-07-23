import AiConversation from "../../models/aiConversation.js";
import AiMessage from "../../models/aiMessage.js";
import AppError from "../utils/AppError.js";

async function generateAiResponse(promptText, focus = "") {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
        try {
            const systemInstruction = `You are a helpful AI assistant for IdeaForge. Help the user shape their ideas. Keep responses insightful yet concise.`;
            const userMessage = `${promptText}${focus}`;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: { text: systemInstruction } },
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
            }
        } catch (e) {
            console.error("Gemini API call failed:", e);
        }
    }
    return `A useful next move${focus} is to narrow “${promptText}” into one specific user, one recurring moment, and one measurable outcome. Turn that into a lightweight experiment before expanding the solution.`;
}

const aiController = {
    /** POST /api/v1/ai/assist */
    async assist(req, res, next) {
        try {
            const { message, context } = req.body;
            if (typeof message !== "string" || !message.trim()) {
                throw new AppError("message is required", 400);
            }
            const promptText = message.trim().slice(0, 4000);
            const focus = typeof context?.ideaTitle === "string" && context.ideaTitle.trim()
                ? ` for “${context.ideaTitle.trim().slice(0, 120)}”`
                : "";

            const responseText = await generateAiResponse(promptText, focus);
            const provider = process.env.GEMINI_API_KEY ? "gemini" : "built-in";

            return res.status(200).json({ status: "success", data: { message: responseText, provider } });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/v1/ai/conversations */
    async getConversations(req, res, next) {
        try {
            const conversations = await AiConversation.find({ user: req.user.id })
                .sort({ updatedAt: -1 })
                .lean();

            return res.status(200).json({
                status: "success",
                data: { conversations },
            });
        } catch (err) {
            next(err);
        }
    },

    /** POST /api/v1/ai/conversations */
    async createConversation(req, res, next) {
        try {
            const { title } = req.body;
            const conversation = await AiConversation.create({
                user: req.user.id,
                title: title && title.trim() ? title.trim() : "New Conversation",
            });

            const initialMessage = await AiMessage.create({
                conversation: conversation._id,
                role: "assistant",
                text: "I’m here to help you shape an early thought into a more useful, testable idea. What are you exploring?",
            });

            return res.status(201).json({
                status: "success",
                data: { conversation, initialMessage },
            });
        } catch (err) {
            next(err);
        }
    },

    /** GET /api/v1/ai/conversations/:id/messages */
    async getMessages(req, res, next) {
        try {
            const { id } = req.params;
            const conversation = await AiConversation.findOne({ _id: id, user: req.user.id });
            if (!conversation) {
                throw new AppError("Conversation not found", 404);
            }

            const messages = await AiMessage.find({ conversation: id })
                .sort({ createdAt: 1 })
                .lean();

            return res.status(200).json({
                status: "success",
                data: { messages },
            });
        } catch (err) {
            next(err);
        }
    },

    /** POST /api/v1/ai/conversations/:id/messages */
    async postMessage(req, res, next) {
        try {
            const { id } = req.params;
            const { text } = req.body;

            if (typeof text !== "string" || !text.trim()) {
                throw new AppError("Message text is required", 400);
            }

            const conversation = await AiConversation.findOne({ _id: id, user: req.user.id });
            if (!conversation) {
                throw new AppError("Conversation not found", 404);
            }

            const userMsg = await AiMessage.create({
                conversation: id,
                role: "user",
                text: text.trim(),
            });

            if (conversation.title === "New Conversation") {
                const autoTitle = text.trim().slice(0, 30) + (text.trim().length > 30 ? "..." : "");
                conversation.title = autoTitle;
                await conversation.save();
            }

            const aiText = await generateAiResponse(text.trim());

            const assistantMsg = await AiMessage.create({
                conversation: id,
                role: "assistant",
                text: aiText,
            });

            return res.status(201).json({
                status: "success",
                data: {
                    userMessage: userMsg,
                    assistantMessage: assistantMsg,
                },
            });
        } catch (err) {
            next(err);
        }
    },
};

export default aiController;
