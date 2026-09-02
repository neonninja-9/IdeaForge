import mongoose from "mongoose";
import Idea from "./models/idea.js";
import Tag from "./models/tag.js";
import Category from "./models/category.js";
import User from "./models/user.js"; // required for populate
import Comment from "./models/comment.js";
import elasticsearchService from "./src/services/elasticsearch.service.js";
import aiService from "./src/services/ai.service.js";

async function syncAdvanced() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Re-create the index with new mapping
    await elasticsearchService.dropIndex();
    await elasticsearchService.createIndex();

    // Fetch all ideas
    const ideas = await Idea.find().populate("tags").populate("category").populate("author");
    console.log(`Found ${ideas.length} ideas to process.`);

    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      console.log(`Processing [${i + 1}/${ideas.length}] Idea: ${idea._id}`);

      // Generate embedding if missing or invalid
      if (!idea.embedding || !Array.isArray(idea.embedding) || idea.embedding.length !== 1536) {
        console.log(`Generating embedding for Idea: ${idea._id}...`);
        const textToEmbed = `${idea.title}. ${idea.problem}`;
        const embedding = await aiService.generateQueryEmbedding(textToEmbed);
        
        if (embedding) {
          idea.embedding = embedding;
          // Temporarily disable save hooks to avoid infinite loops
          await Idea.updateOne({ _id: idea._id }, { $set: { embedding } });
        } else {
          console.error(`Failed to generate embedding for Idea: ${idea._id}`);
        }
      }

      await elasticsearchService.indexIdea(idea);
    }

    console.log("Sync complete! Elasticsearch index is ready with advanced mappings and embeddings.");
    process.exit(0);
  } catch (error) {
    console.error("Advanced sync failed:", error);
    process.exit(1);
  }
}

syncAdvanced();
