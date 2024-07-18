import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Load env vars

async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
}

export default connectDB;