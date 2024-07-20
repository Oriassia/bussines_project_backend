import express from "express";

const router = express.Router();
import {
  getBusinesses,
  getBusinessById,
} from "../controllers/business.controller";

router.get("/", getBusinesses);
router.get("/:businessId", getBusinessById);

export default router;
