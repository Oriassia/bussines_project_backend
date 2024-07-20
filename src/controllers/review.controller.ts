import { Request, Response } from "express";
import Review, { IReview } from "../models/review.model";
import User, { IUser } from "../models/user.model";
import { Types } from "mongoose";
import Business, { IBusiness } from "../models/business.model";

async function createReview(req: Request, res: Response): Promise<void> {
  const { userId } = req; // user id received from verifyToken func
  const { businessId } = req.params;

  try {
    // Create and save the new task
    const newReviewData: Omit<IReview, "_id"> = {
      ...req.body,
      user: userId,
      business: businessId,
    };
    const newReview = new Review(newReviewData);
    const tempReview = await newReview.save();

    // Find the user and add the task ID to their tasks array
    const user: IUser | null = await User.findById(userId);
    if (!user) res.status(404).json({ message: "User not found" });

    //update user reviews array >> adding review id
    user!.reviews.push(tempReview._id as Types.ObjectId);
    await user!.save();

    const business: IBusiness | null = await Business.findById(businessId);
    if (!business) res.status(404).json({ message: "business not found" });

    //update business reviews array >> adding review id
    business!.reviews.push(tempReview._id as Types.ObjectId);
    await business!.save();

    res.status(201).json(tempReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteReview(req: Request, res: Response): Promise<void> {
  const { reviewId } = req.params;
  const { userId } = req;
  try {
    const deletedReview: IReview | null = await Review.findByIdAndDelete(
      reviewId
    ).exec();

    if (!deletedReview) {
      res
        .status(404)
        .json({ message: `Review not found with the id: ${reviewId}` });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { reviews: reviewId },
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error: any) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ message: `Review not found with the id: ${reviewId}` });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}

async function getReviews(req: Request, res: Response): Promise<void> {
  const { businessId } = req.params;
  try {
    const reviews: IReview[] = await Review.find({
      business: businessId,
    }).exec();
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function updateReview(req: Request, res: Response): Promise<void> {
  const updatedData: Partial<IReview> = req.body;
  const { reviewId } = req.params;

  try {
    const updatedReview: IReview | null = await Review.findByIdAndUpdate(
      reviewId,
      updatedData, // {content: "i think this place is great!"}
      { new: true }
    );
    if (!updatedReview) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json(updatedReview);
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred while updating the review",
      error: error.message,
    });
  }
}

export { createReview, getReviews, deleteReview, updateReview };
