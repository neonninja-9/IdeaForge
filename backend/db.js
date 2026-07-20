import mongoose from "mongoose";

async function connectDB(){
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in the environment variables (.env)");
    }
    await mongoose.connect(process.env.MONGODB_URI);
}

export default connectDB;