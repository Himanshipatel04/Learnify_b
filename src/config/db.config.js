import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(dbURI, {
            dbName: "LearnifyDB"
        });
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit process with failure                   
    }
}