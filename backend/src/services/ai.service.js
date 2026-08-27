/**
 * AI Service
 * ----------
 * Business logic for AI integrations using Gemini.
 */

import Category from "../../models/category.js";
import AppError from "../utils/AppError.js";

const CATEGORY_LIMIT = 30;

const aiService = {
    /**
     * General text generation using Gemini.
     */
    async generateAiResponse(promptText, focus = "") {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (GEMINI_API_KEY) {
            try {
                const systemInstruction = `You are a helpful AI assistant for IdeaForge. Help the user shape their ideas. Keep responses insightful yet concise.`;
                const userMessage = `${promptText}${focus}`;
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
                } else {
                    console.error("Gemini API Error:", await response.text());
                }
            } catch (e) {
                console.error("Gemini API call failed:", e);
            }
        }
        return `A useful next move${focus} is to narrow “${promptText}” into one specific user, one recurring moment, and one measurable outcome. Turn that into a lightweight experiment before expanding the solution.`;
    },

    /**
     * Classifies a problem/idea into an existing category, or creates a new one if appropriate.
     */
    async classifyCategory(title, problem) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        const categories = await Category.find({}).lean();
        // Check if "general" exists, if not we will use an existing one or create it later.
        let generalCategory = categories.find(c => c.slug === "general");
        
        if (!GEMINI_API_KEY) {
            return generalCategory?._id || null;
        }

        const canCreateNew = categories.length < CATEGORY_LIMIT;
        const categoryListText = categories.map(c => `- ${c.name} (${c.slug})`).join("\n");
        
        const systemInstruction = `You are an expert AI Classifier for a project idea platform. 
Your task is to classify the user's idea based on its Title and Problem description into exactly ONE category.
Existing categories:
${categoryListText}

${canCreateNew ? 
"If NONE of the existing categories match well, you can create a new one. To do so, respond with exactly:\nCREATE_NEW: [Category Name]|[category-slug]|[emoji]" : 
"You MUST choose from the existing categories above. If none match well, respond with exactly: general"}`;

        const promptText = `Title: ${title}\nProblem: ${problem}\n\nRespond with ONLY the slug of the existing category, OR the CREATE_NEW format. No other text.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: { text: systemInstruction } },
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: {
                        temperature: 0.1, // Low temp for deterministic classification
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const aiResult = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
                
                if (!aiResult) return generalCategory?._id || null;

                if (aiResult.startsWith("CREATE_NEW:") && canCreateNew) {
                    const parts = aiResult.replace("CREATE_NEW:", "").trim().split("|");
                    if (parts.length >= 2) {
                        const name = parts[0].trim();
                        const slug = parts[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
                        const icon = (parts[2] || "📌").trim();
                        
                        try {
                            const newCat = await Category.create({ name, slug, icon });
                            return newCat._id;
                        } catch (err) {
                            console.error("Failed to create new category from AI:", err);
                            // Fallback to general
                            return generalCategory?._id || null;
                        }
                    }
                }

                // If it returned a slug
                const matchedCategory = categories.find(c => c.slug === aiResult.toLowerCase());
                if (matchedCategory) {
                    return matchedCategory._id;
                }
            } else {
                console.error("Gemini Classification Error:", await response.text());
            }
        } catch (e) {
            console.error("Gemini Classification failed:", e);
        }

        return generalCategory?._id || null;
    }
};

export default aiService;
