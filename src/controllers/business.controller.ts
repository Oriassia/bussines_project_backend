import { Request, Response } from "express";
import Business, { IBusiness } from "../models/business.model";
export async function getBusinesses(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const businesses: IBusiness[] = await Business.find().exec();
    res.status(200).json(businesses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getBusinessById(
  req: Request,
  res: Response
): Promise<Response> {
  const { businessId } = req.params;
  try {
    const business: IBusiness | null = await Business.findById(
      businessId
    ).exec();
    return res.status(200).json(business);
  } catch (error: any) {
    if (error.name === "CastError") {
      return res
        .status(404)
        .json({ message: `Business not found with id: ${businessId}` });
    }
    return res.status(500).json({ message: error.message });
  }
}
