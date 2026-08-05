import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    fields: {
        problem: { type: String, default: "" },
        solution: { type: String, default: "" },
        impact: { type: String, default: "" },
    }
}, {
    timestamps: true,
});

const Template = mongoose.model("Template", templateSchema);

export default Template;
