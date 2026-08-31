/**
 * AI Service
 * ----------
 * Business logic for AI integrations using Gemini.
 */

import Category from "../../models/category.js";
import Tag from "../../models/tag.js";
import Idea from "../../models/idea.js";
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
    },

    /**
     * Takes raw text and returns a structured JSON Idea object.
     */
    async structureIdea(rawText) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            throw new AppError("GEMINI_API_KEY is missing", 500);
        }

        const systemInstruction = `You are a world-class startup idea structurer. Your job is to take raw, unstructured thoughts from a user and transform them into a clear, compelling project idea structure.

You MUST respond with valid JSON ONLY. No markdown formatting, no backticks, just the raw JSON object.

The JSON MUST match this exact schema:
{
  "title": "A catchy, concise title (max 50 chars)",
  "problem": "A clear description of the problem this solves",
  "solution": "How this project solves the problem",
  "impact": "The potential impact or value created",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "suggestedTechStack": "A recommended tech stack string (e.g. 'React, Node, MongoDB')"
}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: { parts: { text: systemInstruction } },
                    contents: [{ parts: [{ text: rawText }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json"
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let aiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                
                try {
                    const parsed = JSON.parse(aiResult);
                    return parsed;
                } catch (parseError) {
                    console.error("Failed to parse AI structure JSON:", aiResult);
                    throw new AppError("AI returned invalid structure", 500);
                }
            } else {
                console.error("Gemini Structure Error:", await response.text());
                throw new AppError("Failed to structure idea with AI", 500);
            }
        } catch (e) {
            console.error("Gemini Structure failed:", e);
            throw new AppError("AI Service error", 500);
        }
    },

    /**
     * Auto-categorizes an idea based on its title, problem, and solution.
     */
    async categorizeIdea(title, problem, solution, impact) {
        try {
            const response = await fetch("http://localhost:8000/api/category/classify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title || "Untitled",
                    description: `${problem}\n\nSolution: ${solution}\n\nImpact: ${impact}`
                })
            });

            if (!response.ok) {
                console.error("AI Engine Categorize Error:", await response.text());
                throw new AppError("Failed to categorize idea with AI engine", 500);
            }

            const data = await response.json();
            
            const categories = await Category.find({}).lean();
            const tags = await Tag.find({}).lean();
            const canCreateCategories = categories.length < CATEGORY_LIMIT;

            let finalCategoryId = null;
            if (data.category) {
                let matchedCategory = categories.find(c => c.name.toLowerCase() === data.category.toLowerCase());
                if (matchedCategory) {
                    finalCategoryId = matchedCategory._id;
                } else if (canCreateCategories) {
                    const slug = data.category.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                    try {
                        const newCat = await Category.create({ name: data.category, slug, icon: "📌" });
                        finalCategoryId = newCat._id;
                    } catch (e) { console.error("Failed to create AI category", e); }
                }
            }
            if (!finalCategoryId) {
                const gen = categories.find(c => c.slug === "general");
                finalCategoryId = gen ? gen._id : null;
            }

            const finalTagIds = [];
            if (Array.isArray(data.tags)) {
                for (const t of data.tags) {
                    const tagName = t;
                    const slug = tagName.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                    let matchedTag = tags.find(existing => existing.slug === slug);
                    if (matchedTag) {
                        finalTagIds.push(matchedTag._id);
                    } else {
                        try {
                            const newTag = await Tag.create({ name: tagName, slug });
                            finalTagIds.push(newTag._id);
                        } catch (e) { console.error("Failed to create AI tag", e); }
                    }
                    if (finalTagIds.length >= 8) break;
                }
            }

            return {
                categoryId: finalCategoryId,
                difficulty: "Beginner", // Let user adjust or rely on background pipeline
                tagIds: finalTagIds
            };
        } catch (e) {
            console.error("AI Engine Categorize failed:", e);
            throw new AppError("AI Service error", 500);
        }
    },

    /**
     * Runs the heavy 4-phase AI pipeline in the background and saves it to the database.
     */
    async processIdeaBackground(ideaId, title, problem, solution, impact) {
        try {
            console.log(`[AI Engine] Starting background processing for Idea ${ideaId}...`);
            const response = await fetch("http://localhost:8000/api/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title || "Untitled",
                    description: `${problem}\n\nSolution: ${solution}\n\nImpact: ${impact}`
                })
            });

            if (!response.ok) {
                console.error("[AI Engine] Background process error:", await response.text());
                return;
            }

            const data = await response.json();
            
            await Idea.findByIdAndUpdate(ideaId, {
                techStack: data.techStack || [],
                estimatedTime: data.estimatedTime || "",
                difficulty: data.difficulty || "Beginner",
                embedding: data.embedding || [],
                roadmap: data.roadmap || []
            });
            console.log(`[AI Engine] Successfully enriched Idea ${ideaId} with full roadmap and embeddings.`);
        } catch (err) {
            console.error("[AI Engine] Background process failed:", err);
        }
    }
};

export default aiService;
