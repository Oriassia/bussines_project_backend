import express from "express";

const router = express.Router();
import {
  getBusinesses,
  getBusinessAndReviewsById,
} from "../controllers/business.controller";

router.get("/", getBusinesses);
router.get("/:businessId", getBusinessAndReviewsById);

export default router;
