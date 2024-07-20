import express from "express";
import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  createReview,
  deleteLike,
  deleteReview,
  postLike,
  updateReview,
} from "../controllers/review.controller";
import { authorizeReviewOwner } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/", verifyToken, createReview);
router.delete("/:reviewId", verifyToken, authorizeReviewOwner, deleteReview);
router.put("/:reviewId", verifyToken, authorizeReviewOwner, updateReview);
router.post("/:reviewId/likes", verifyToken, postLike);
router.delete("/:reviewId/likes", verifyToken, deleteLike);

export default router;
