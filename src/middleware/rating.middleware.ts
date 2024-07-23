import { Types } from "mongoose";
import Review, { IReview } from "../models/review.model";
import Business from "../models/business.model";

export async function updateBusinessRating(businessId: Types.ObjectId) {
  let averageRating;
  const businessReviews = await Review.find({
    business: businessId,
  });
  if (businessReviews.length === 0) averageRating = 0;
  else {
    averageRating =
      businessReviews.reduce((sum: number, review: IReview) => {
        return (
          sum +
          (review.rating !== undefined && review.rating !== null
            ? review.rating
            : 0)
        );
      }, 0) / businessReviews.length;
  }
  await Business.findByIdAndUpdate(businessId, { rating: averageRating });
}
