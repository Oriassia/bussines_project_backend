import express, { Request, Response } from "express";
import Business, { IBusiness } from "../models/business.model";

const router = express.Router();

async function getBusinesses(req: Request, res: Response): Promise<void> {
  try {
    const businesses: IBusiness[] = await Business.find().exec();
    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

router.get("/", getBusinesses);

export default router;
