import dotenv from "dotenv";
dotenv.config(); // Load config
import { verifyToken } from "./middleware/auth.middleware";

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { createServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";

const app: Application = express();
const server: Server = createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

// Connect to MongoDB
connectDB();

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());

// allow CORS for local development (for production, you should configure it properly)
app.use(cors());

// ROUTES
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/users.route";
import businessRoutes from "./routes/businesses.route";
import reviewRoutes from "./routes/reviews.route";

app.use("/api/users", verifyToken, userRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

export default app;
