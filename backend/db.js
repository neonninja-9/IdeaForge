import mongoose from "mongoose";

async function connectDB(){
    try{
    await mongoose.connect(process.env.MONGODB_URI);
    }
    catch(e){
        console.log(e);
    }
}

export default connectDB;