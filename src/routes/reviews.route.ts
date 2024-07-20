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

router.get("/:businessId/reviews", getReviews);
router.post("/:businessId/reviews", verifyToken, createReview);
router.delete(
  "/:businessId/reviews/:reviewId",
  verifyToken,
  authorizeReviewOwner,
  deleteReview
);
router.put(
  "/:businessId/reviews/:reviewId",
  verifyToken,
  authorizeReviewOwner,
  updateReview
);

export default router;
