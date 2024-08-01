"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config(); // Load env vars
async function connectDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
}
exports.default = connectDB;
