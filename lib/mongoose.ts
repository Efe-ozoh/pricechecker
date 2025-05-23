import mongoose from "mongoose";


let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URL) {
        return console.log('MONGODB_URL is not defined');
    };

    if(isConnected) {
        return console.log("=> using existing database connection")
    };


    try {
        await mongoose.connect(process.env.MONGODB_URL,  { 
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000, });

        isConnected = true;

        console.log("MonogoDB Connected");
    } catch (error) {
        console.log(error);
        
    }
}; 