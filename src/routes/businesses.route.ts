import express from "express";

const router = express.Router();
import {
  getBusinesses,
  getBusinessAndReviewsById,
  getBusinessesCount,
  getBusinessesCategories,
} from "../controllers/business.controller";

router.get("/", getBusinesses);
router.get("/count", getBusinessesCount);
router.get("/category", getBusinessesCategories);
router.get("/:businessId", getBusinessAndReviewsById);

export default router;
