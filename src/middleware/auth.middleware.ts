import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Review from "../models/review.model";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Define the shape of the decoded JWT payload
interface DecodedToken extends JwtPayload {
  userId: string;
}

// Extend the Express Request interface to include the userId property
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Get token from header, the client should be responsible for sending the token
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as DecodedToken | undefined; // Verify token with explicit type assertion
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token");
    }
    req.userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function authorizeReviewOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.user.toString() !== req.userId) {
    return res.status(403).json({ message: "User not authorized" });
  }

  next();
}
