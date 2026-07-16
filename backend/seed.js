/**
 * Seed Script
 * -----------
 * Populates the database with initial categories and tags
 * from the README specification.
 *
 * Usage:  node --env-file=.env seed.js
 */

import connectDB from "./db.js";
import Category from "./models/category.js";
import Tag from "./models/tag.js";

const categories = [
    { name: "Agriculture", slug: "agriculture", icon: "🌾" },
    { name: "Education", slug: "education", icon: "📚" },
    { name: "Healthcare", slug: "healthcare", icon: "🏥" },
    { name: "Environment", slug: "environment", icon: "🌍" },
    { name: "Finance", slug: "finance", icon: "💰" },
    { name: "Smart Cities", slug: "smart-cities", icon: "🏙️" },
    { name: "Transportation", slug: "transportation", icon: "🚀" },
    { name: "Cybersecurity", slug: "cybersecurity", icon: "🔒" },
    { name: "Social Impact", slug: "social-impact", icon: "🤝" },
    { name: "AI & Machine Learning", slug: "ai-ml", icon: "🤖" },
    { name: "Developer Tools", slug: "devtools", icon: "🛠️" },
    { name: "SaaS", slug: "saas", icon: "☁️" },
    { name: "Web3 / Crypto", slug: "web3", icon: "⛓️" },
    { name: "E-Commerce", slug: "e-commerce", icon: "🛒" },
    { name: "Entertainment", slug: "entertainment", icon: "🎮" },
];

const tags = [
    { name: "AI", slug: "ai" },
    { name: "Machine Learning", slug: "machine-learning" },
    { name: "IoT", slug: "iot" },
    { name: "Web Development", slug: "web-development" },
    { name: "Mobile App", slug: "mobile-app" },
    { name: "Blockchain", slug: "blockchain" },
    { name: "Data Science", slug: "data-science" },
    { name: "Computer Vision", slug: "computer-vision" },
    { name: "NLP", slug: "nlp" },
    { name: "Cloud Computing", slug: "cloud-computing" },
    { name: "DevOps", slug: "devops" },
    { name: "API", slug: "api" },
    { name: "Database", slug: "database" },
    { name: "Security", slug: "security" },
    { name: "React", slug: "react" },
    { name: "Node.js", slug: "nodejs" },
    { name: "Python", slug: "python" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Open Source", slug: "open-source" },
    { name: "Automation", slug: "automation" },
];

async function seed() {
    try {
        await connectDB();
        console.log("✅ Database connected");

        // Upsert categories
        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { slug: cat.slug },
                cat,
                { upsert: true, new: true }
            );
        }
        console.log(`✅ Seeded ${categories.length} categories`);

        // Upsert tags
        for (const tag of tags) {
            await Tag.findOneAndUpdate(
                { slug: tag.slug },
                tag,
                { upsert: true, new: true }
            );
        }
        console.log(`✅ Seeded ${tags.length} tags`);

        console.log("\n🎉 Seed complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
}

seed();
