import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    idea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea",
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {
    timestamps: true,
});

favoriteSchema.index({ idea: 1, user: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
