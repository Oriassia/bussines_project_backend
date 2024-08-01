"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.authorizeReviewOwner = authorizeReviewOwner;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const review_model_1 = __importDefault(require("../models/review.model"));
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
function verifyToken(req, res, next) {
    // Get token from header, the client should be responsible for sending the token
    const authHeader = req.header("Authorization");
    if (!authHeader)
        return res.status(401).json({ error: "Access denied" });
    const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format
    if (!token)
        return res.status(401).json({ error: "Access denied" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Verify token with explicit type assertion
        if (!decoded || !decoded.userId) {
            throw new Error("Invalid token");
        }
        req.userId = decoded.userId; // Add userId to request object
        next(); // Call next middleware
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
async function authorizeReviewOwner(req, res, next) {
    const { reviewId } = req.params;
    const review = await review_model_1.default.findById(reviewId);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }
    if (review.user.toString() !== req.userId) {
        return res.status(403).json({ message: "User not authorized" });
    }
    next();
}
