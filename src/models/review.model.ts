import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  content: string;
  business: Types.ObjectId;
  likes: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;
