import express from "express";
import connectDB from "./db.js";
import User from "./models/user.js";
import Idea from "./models/idea.js";
import cors from "cors";
import 'dotenv/config';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

try {
    await connectDB();
    console.log("Database Connected");
} catch (error) {
    console.error(error);
}

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to IdeaForge API"
    });
});

// --- Auth Routes ---
app.post("/api/auth/login", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});
app.post("/api/auth/register", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});

// --- Idea Routes ---
app.get("/api/ideas", async (req, res) => {
    try {
        const ideas = await Idea.find();
        res.status(200).json({
            message: "success",
            data: ideas
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal Server error",
        });
    }
});
app.post("/api/ideas", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});
app.get("/api/ideas/:id", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});

// --- Category & Tag Routes ---
app.get("/api/categories", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});
app.get("/api/tags", (req, res) => {
    res.status(501).json({ message: "Not Implemented yet" });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});