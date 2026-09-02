/**
 * AI Service
 * ----------
 * Business logic for AI integrations using Gemini.
 */

import Category from "../../models/category.js";
import Tag from "../../models/tag.js";
import Idea from "../../models/idea.js";
import AppError from "../utils/AppError.js";
import { cleanAiDescription, cleanStructuredIdea } from "../utils/aiTextCleaner.js";

const CATEGORY_LIMIT = 30;
const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-lite-latest", "gemini-3-flash-preview"];
const GEMINI_MODEL = GEMINI_MODELS[0];

/**
 * Executes a Gemini generateContent request with automatic fallback across available models.
 */
async function callGeminiCascade(payload, apiKey) {
    for (const model of GEMINI_MODELS) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(6000)
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else if (response.status === 429 || response.status === 404 || response.status === 503) {
                console.warn(`[AI Service] Model ${model} returned ${response.status}. Cascading to next model...`);
            } else {
                console.error(`[AI Service] Model ${model} error:`, await response.text());
            }
        } catch (e) {
            console.warn(`[AI Service] Model ${model} request failed: ${e.message || e}`);
        }
    }
    return null;
}

const aiService = {
    /**
     * General text generation using Gemini with multi-model cascade.
     */
    async generateAiResponse(promptText, focus = "") {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (GEMINI_API_KEY) {
            const systemInstruction = `You are an expert AI assistant for IdeaForge. Help users refine, articulate, and shape high-impact project ideas.
CRITICAL INSTRUCTION: When asked to refine, rewrite, or expand a problem statement, solution, or description, provide ONLY the direct refined content in 2-3 concise, high-impact sentences. Do NOT include introductory phrases (e.g., 'Here is a refined version:'), conversational pleasantries, markdown titles/headers, or surrounding quotation marks.`;
            const userMessage = `${promptText}${focus}`;

            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ parts: [{ text: userMessage }] }],
                generationConfig: {
                    maxOutputTokens: 350,
                    temperature: 0.2,
                    topP: 0.85
                }
            };

            const data = await callGeminiCascade(payload, GEMINI_API_KEY);
            if (data) {
                const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (rawResponse) {
                    return cleanAiDescription(rawResponse);
                }
            }
        }

        // Fast, intelligent fallback if all models are exhausted
        const inputMatch = promptText.match(/(?:Problem|Solution|Description):\s*["“]?([\s\S]*?)["”]?\s*$/i);
        const fallbackText = inputMatch ? inputMatch[1].trim() : promptText;
        return cleanAiDescription(fallbackText);
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
            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 80,
                }
            };

            const data = await callGeminiCascade(payload, GEMINI_API_KEY);
            if (data) {
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
                            return generalCategory?._id || null;
                        }
                    }
                }

                // If it returned a slug
                const matchedCategory = categories.find(c => c.slug === aiResult.toLowerCase());
                if (matchedCategory) {
                    return matchedCategory._id;
                }
            }
        } catch (e) {
            console.error("Gemini Classification failed:", e.message || e);
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
  "problem": "A clear description of the problem this solves (2-3 sentences)",
  "solution": "How this project solves the problem (2-3 sentences)",
  "impact": "The potential impact or value created",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "suggestedTechStack": "A recommended tech stack string (e.g. 'React, Node, MongoDB')"
}`;

        try {
            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ parts: [{ text: rawText }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                    responseMimeType: "application/json"
                }
            };

            const data = await callGeminiCascade(payload, GEMINI_API_KEY);
            if (data) {
                let aiResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                try {
                    const parsed = cleanStructuredIdea(JSON.parse(aiResult));

                    try {
                        const catRes = await aiService.categorizeIdea(
                            parsed.title,
                            parsed.problem,
                            parsed.solution,
                            parsed.impact || ""
                        );
                        parsed.categoryId = catRes.categoryId;
                        parsed.tagIds = catRes.tagIds;
                    } catch (e) {
                        console.error("Failed to categorize within structureIdea", e);
                    }

                    return parsed;
                } catch (parseError) {
                    console.error("Failed to parse AI structure JSON:", aiResult);
                }
            }
        } catch (e) {
            console.error("Gemini Structure failed:", e.message || e);
        }

        // Fallback lightweight structure so the user is never blocked
        return {
            title: rawText.slice(0, 45).trim() || "New Project Idea",
            problem: rawText.trim(),
            solution: "A digital solution and automated workflow to resolve this problem.",
            impact: "Improves efficiency and user outcomes.",
            difficulty: "Beginner",
            suggestedTechStack: "React, Node.js, MongoDB"
        };
    },

    /**
     * Auto-categorizes an idea based on its title, problem, and solution.
     */
    async categorizeIdea(title, problem, solution, impact) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            return { categoryId: null, difficulty: "Beginner", tagIds: [] };
        }

        const categories = await Category.find({}).lean();
        const tags = await Tag.find({}).lean();
        const categoryListText = categories.map(c => `- ${c.name} (${c.slug})`).join("\n");
        const canCreateCategories = categories.length < CATEGORY_LIMIT;

        const systemInstruction = `You are an expert startup AI Classifier.
Analyze the idea and respond with JSON containing exactly:
{
  "category": "The best matching category name",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]
}
Existing categories to choose from:
${categoryListText}
${canCreateCategories ? "If none fit well, you may suggest a new category name." : "You MUST choose an existing category name."}
Generate 5-8 technical tags relevant to the idea.`;

        const promptText = `Title: ${title}\nProblem: ${problem}\nSolution: ${solution}\nImpact: ${impact}`;

        try {
            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 250 }
            };

            const responseData = await callGeminiCascade(payload, GEMINI_API_KEY);
            if (!responseData) throw new Error("Gemini cascade failed");

            const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const data = JSON.parse(rawText);

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
            console.error("AI Engine Categorize failed:", e.message || e);
            const gen = categories.find(c => c.slug === "general");
            return {
                categoryId: gen ? gen._id : (categories[0]?._id || null),
                difficulty: "Beginner",
                tagIds: []
            };
        }
    },

    /**
     * Runs the heavy 4-phase AI pipeline in the background and saves it to the database.
     */
    async processIdeaBackground(ideaId, title, problem, solution, impact) {
        try {
            console.log(`[AI Engine] Starting background processing for Idea ${ideaId}...`);
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
            
            if (!GEMINI_API_KEY) {
                console.error("[AI Engine] GEMINI_API_KEY missing for background processing.");
                return;
            }

            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

            const promptText = `Title: ${title}\nProblem: ${problem}\nSolution: ${solution}\nImpact: ${impact}`;

            // Phase 2: Solution, Tech Stack, Estimated Time, Difficulty
            const solSystemInstruction = `You are a Principal Software Architect. Given the user's idea, propose a technical architecture.
Respond in JSON with exactly:
{
  "techStack": ["Array", "of", "Technologies"],
  "estimatedTime": "E.g., 4 - 6 weeks",
  "difficulty": "Beginner" or "Intermediate" or "Advanced"
}`;
            const solModel = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: solSystemInstruction, generationConfig: { responseMimeType: "application/json", temperature: 0.3, maxOutputTokens: 300 } });
            const solResult = await solModel.generateContent(promptText);
            const solData = JSON.parse(solResult.response.text());

            // Phase 3: Embeddings
            let embedding = [];
            if (OPENAI_API_KEY) {
                try {
                    const { OpenAI } = await import("openai");
                    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
                    const embResponse = await openai.embeddings.create({
                        model: "text-embedding-3-small",
                        input: `${title}. ${problem}`,
                        encoding_format: "float",
                    });
                    embedding = embResponse.data[0].embedding;
                } catch (embErr) {
                    console.error("[AI Engine] Embeddings failed:", embErr);
                }
            }

            // Phase 4: Roadmap
            const roadmapSystemInstruction = `You are a Technical Project Manager. Generate a 9-phase software engineering roadmap for this idea.
Respond in JSON with exactly:
{
  "roadmap": [
    {
      "phase": "Phase Name (e.g. Planning, Research, MVP)",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}`;
            const rmModel = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: roadmapSystemInstruction, generationConfig: { responseMimeType: "application/json", temperature: 0.3, maxOutputTokens: 600 } });
            const rmResult = await rmModel.generateContent(promptText);
            const rmData = JSON.parse(rmResult.response.text());

            await Idea.findByIdAndUpdate(ideaId, {
                techStack: solData.techStack || [],
                estimatedTime: solData.estimatedTime || "",
                difficulty: solData.difficulty || "Beginner",
                embedding: embedding,
                roadmap: rmData.roadmap || []
            });
            console.log(`[AI Engine] Successfully enriched Idea ${ideaId} with full roadmap and embeddings.`);
        } catch (err) {
            console.error("[AI Engine] Background process failed:", err);
        }
    },
    /**
     * Generates Workflow and Architecture using WORKFLOW_GEMINI_API_KEY
     */
    async generateWorkflowAndArchitecture(title, problem, solution) {
        const WORKFLOW_GEMINI_API_KEY = process.env.WORKFLOW_GEMINI_API_KEY;
        if (!WORKFLOW_GEMINI_API_KEY) {
            console.error("[AI Engine] WORKFLOW_GEMINI_API_KEY missing.");
            return { workflow: "Configuration missing. Could not generate workflow.", architecture: "Configuration missing. Could not generate architecture." };
        }

        const systemInstruction = `You are a Principal Software Architect. Given the user's idea, propose a workflow and an architecture design.
Respond in JSON with exactly:
{
  "workflow": "A markdown string describing the step-by-step user workflow",
  "architecture": "A markdown string describing the system architecture and components"
}`;
        const promptText = `Title: ${title}\nProblem: ${problem}\nSolution: ${solution}`;

        try {
            const payload = {
                system_instruction: { parts: { text: systemInstruction } },
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.3, maxOutputTokens: 1000 }
            };

            const responseData = await callGeminiCascade(payload, WORKFLOW_GEMINI_API_KEY);
            if (!responseData) throw new Error("Gemini cascade failed");

            const rawText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const data = JSON.parse(rawText);

            return {
                workflow: data.workflow || "Could not generate workflow.",
                architecture: data.architecture || "Could not generate architecture."
            };
        } catch (e) {
            console.error("Workflow & Architecture generation failed:", e.message || e);
            return { workflow: "Failed to generate workflow.", architecture: "Failed to generate architecture." };
        }
    },

    /**
     * Generate an embedding vector for a given search query (or idea text) using Gemini
     * @param {string} text 
     * @returns {Promise<Array<number>|null>}
     */
    async generateQueryEmbedding(text) {
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY || !text) return null;

        try {
            const { GoogleGenerativeAI } = await import("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
            
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error("[AI Engine] Query embedding failed:", error.message);
            return null;
        }
    }
};

export default aiService;
