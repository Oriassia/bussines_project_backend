import express from "express";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
} from "../controllers/review.controller";
import { authorizeReviewOwner } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/:businessId", getReviews);
router.post("/:businessId", verifyToken, createReview);
router.delete("/:id", verifyToken, authorizeReviewOwner, deleteReview);
router.put("/:id", verifyToken, updateReview);

export default router;
