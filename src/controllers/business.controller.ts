import { Request, Response } from "express";
import Business, { IBusiness } from "../models/business.model";
import Review, { IReview } from "../models/review.model";
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

export async function getBusinessAndReviewsById(
  req: Request,
  res: Response
): Promise<void> {
  const { businessId } = req.params;
  try {
    const business: IBusiness | null = await Business.findById(businessId)
      .lean()
      .exec();

    const reviewList: IReview[] | null = await Review.find({
      business: businessId,
    })
      .populate("user", "username")
      .lean()
      .exec();

    const businessWithReview = { ...business, reviews: reviewList };
    res.status(200).json(businessWithReview);
  } catch (error: any) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ message: `Business not found with id: ${businessId}` });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}
