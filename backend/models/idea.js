import mongoose from "mongoose";

// 1. Define the schema structure
const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    discription: {
        type: String,
        required: true,
        unique: true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    problem: {
        type: String,
        required: false,
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// 2. Create the model
// The first argument is the singular name of the collection your model is for (e.g. "User" -> "users" collection).
const Idea = mongoose.model("Idea", ideaSchema);

// 3. Export the model
export default Idea;
