import mongoose from "mongoose";
import connectDB from "./db.js";
import User from "./models/user.js";
import Idea from "./models/idea.js";
import {sampleUsers , sampleIdeas} from "./data/sampleData.js";


try{
    await connectDB();
    await User.deleteMany({});
    await Idea.deleteMany({});
    const createdUsers = await User.insertMany(sampleUsers);

    const ideasToInsert = sampleIdeas.map((idea, index) => ({
        ...idea,
        userid: createdUsers[index % createdUsers.length]._id
    }));

    await Idea.insertMany(ideasToInsert);
    console.log("database populated with sample data");
}catch(error){
    console.log(error);
}finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
}