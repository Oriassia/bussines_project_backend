import { Schema, model, Document, Types } from "mongoose";
import Like from "./likes.model";
import User from "./user.model";

export interface IReview extends Document {
  user: Types.ObjectId;
  content: string;
  business: Types.ObjectId;
  likes: number;
  rating: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    likes: { type: Number, default: 0 },
    rating: { type: Number, max: 5, min: 0, required: true },
  },
  { timestamps: true }
);

reviewSchema.pre("findOneAndDelete", async function (next) {
  const reviewId = this.getQuery()["_id"];

  // Delete all likes related to the review
  await Like.deleteMany({ review: reviewId });

  // Update users who liked the review
  await User.updateMany({ likes: reviewId }, { $pull: { likes: reviewId } });

  next();
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;
