import mongoose from "mongoose";
import connectDB from "./db.js";
import Idea from "./models/idea.js";
import Tag from "./models/tag.js";
import Category from "./models/category.js";
import elasticsearchService from "./src/services/elasticsearch.service.js";

async function syncElasticsearch() {
    try {
        await connectDB();
        console.log("Connected to MongoDB for ES sync.");

        // Create index if it doesn't exist
        await elasticsearchService.createIndex();

        const ideas = await Idea.find({}).populate("tags category");
        console.log(`Found ${ideas.length} ideas. Indexing...`);

        for (const idea of ideas) {
            await elasticsearchService.indexIdea(idea);
        }

        console.log("✅ Elasticsearch sync complete!");
    } catch (error) {
        console.error("❌ Sync failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
        process.exit(0);
    }
}

syncElasticsearch();
