import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./db.js";
import User from "./models/user.js";

async function createAdmin() {
    try {
        await connectDB();
        const username = "neonninja09";
        const password = "Y8MXA3.4@haTJCz";
        
        let user = await User.findOne({ username });
        if (user) {
            console.log("User exists, updating password.");
        } else {
            user = new User({
                username,
                email: "neonninja09@example.com",
            });
        }

        user.passwordHash = await bcrypt.hash(password, 10);
        await user.save();
        console.log("User successfully created/updated!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
createAdmin();
