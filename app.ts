import dotenv from "dotenv";
dotenv.config(); // Load config
import { verifyToken } from "./src/middleware/auth.middleware";

import express, { Application } from "express";
const app: Application = express();
import cors from "cors";
import connectDB from "./src/config/db";

// Connect to MongoDB
connectDB();

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());

// allow CORS for local development (for production, you should configure it properly)
app.use(cors());

// ROUTES
import authRoutes from "./src/routes/auth.route";
import userRoutes from "./src/routes/users.route";
import businessRoutes from "./src/routes/businesses.route";
import reviewRoutes from "./src/routes/reviews.route";

app.use("/api/users", verifyToken, userRoutes);
app.use("/api/businesses", businessRoutes, reviewRoutes);
// app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

export default app;
