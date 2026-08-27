import connectDB from "./db.js";
import aiService from "./src/services/ai.service.js";
import Category from "./models/category.js";

async function test() {
    await connectDB();
    console.log("Testing AI Classifier...");

    const title = "Smart Stethoscope App";
    const problem = "Doctors in rural areas don't have access to cardiologists to analyze heart sounds quickly.";
    
    console.log("Sending prompt to Gemini...");
    const categoryId = await aiService.classifyCategory(title, problem);
    
    if (categoryId) {
        const cat = await Category.findById(categoryId);
        console.log("AI classified this problem as:", cat.name, `(${cat.slug})`, cat.icon);
    } else {
        console.log("AI returned no category (or fallback general not found).");
    }
    
    process.exit(0);
}

test();
