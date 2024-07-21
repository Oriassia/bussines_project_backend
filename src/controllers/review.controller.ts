import { Request, Response } from "express";
import Review, { IReview } from "../models/review.model";
import { updateBusinessRating } from "../middleware/rating.middleware";
import Like from "../models/likes.model";
import User from "../models/user.model";
import { io } from "../app";

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

async function createReview(req: Request, res: Response): Promise<void> {
  const { userId } = req; // user id received from verifyToken func

  try {
    // Create and save the new task
    const newReviewData: Omit<IReview, "_id"> = {
      ...req.body,
      user: userId,
    };
    const newReview = new Review(newReviewData);
    const tempReview = await newReview.save();
    updateBusinessRating(tempReview.business);
    io.emit("reviewCreated", tempReview);
    res.status(201).json(tempReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteReview(req: Request, res: Response): Promise<void> {
  const { reviewId } = req.params;
  try {
    const deletedReview: IReview | null = await Review.findByIdAndDelete(
      reviewId
    ).exec();

    updateBusinessRating(deletedReview!.business);
    io.emit("reviewDeleted", deletedReview);
    res.status(200).json({ message: "Review deleted successfully" });
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

    updateBusinessRating(updatedReview.business);
    io.emit("reviewUpdated", updatedReview);
    res.status(200).json(updatedReview);
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred while updating the review",
      error: error.message,
    });
  }
}

async function postLike(req: Request, res: Response): Promise<void> {
  const { userId } = req;
  const { reviewId } = req.params;
  try {
    const newLike = new Like({
      review: reviewId,
      user: userId,
    });
    const savedLike = await newLike.save();
    await Review.findByIdAndUpdate(reviewId, { $inc: { likes: 1 } });
    await User.findByIdAndUpdate(userId, { $push: { likes: reviewId } });
    io.emit("likedReview", savedLike);
    res.status(201).json(savedLike);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteLike(req: Request, res: Response): Promise<void> {
  const { userId } = req;
  const { reviewId } = req.params;
  try {
    await Like.findOneAndDelete({ user: userId, review: reviewId });
    await Review.findByIdAndUpdate(reviewId, { $inc: { likes: -1 } });
    await User.findByIdAndUpdate(userId, { $pull: { likes: reviewId } });
    io.emit("unlikedReview", { userId, reviewId });
    res.status(201).json({ message: "Like removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
  postLike,
  deleteLike,
};
