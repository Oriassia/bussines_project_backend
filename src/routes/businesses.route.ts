import express from "express";

const router = express.Router();
import {
  getBusinesses,
  getBusinessById,
} from "../controllers/business.controller";
import { getReviews } from "../controllers/review.controller";

router.get("/", getBusinesses);
router.get("/:businessId", getBusinessById);
router.get("/:businessId/reviews", getReviews);

export default router;
