import { Types } from "mongoose";
import Review, { IReview } from "../models/review.model";
import Business from "../models/business.model";

export async function updateBusinessRating(businessId: Types.ObjectId) {
  const businessReviews = await Review.find({
    business: businessId,
  });
  const averageRating =
    businessReviews.reduce(
      (sum: number, review: IReview) => sum + review.rating,
      0
    ) / businessReviews.length;
  await Business.findByIdAndUpdate(businessId, { rating: averageRating });
}
