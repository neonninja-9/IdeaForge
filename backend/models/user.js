import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },
    passwordHash: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    preferences: {
        productUpdates: { type: Boolean, default: true },
        weeklyReflection: { type: Boolean, default: false },
    },
}, {
    timestamps: true
});

const User = mongoose.model("User" , userSchema);

export default User;
