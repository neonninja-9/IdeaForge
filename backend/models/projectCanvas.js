import mongoose from "mongoose";

/** One private startup canvas per user. */
const projectCanvasSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },
    notes: {
        type: Map,
        of: String,
        default: {},
    },
}, { timestamps: true });

const ProjectCanvas = mongoose.model("ProjectCanvas", projectCanvasSchema);

export default ProjectCanvas;
