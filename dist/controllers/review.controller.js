"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.getReviews = getReviews;
exports.deleteReview = deleteReview;
exports.updateReview = updateReview;
exports.postLike = postLike;
exports.deleteLike = deleteLike;
const review_model_1 = __importDefault(require("../models/review.model"));
const rating_middleware_1 = require("../middleware/rating.middleware");
const likes_model_1 = __importDefault(require("../models/likes.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const app_1 = require("../app");
async function getReviews(req, res) {
    const { businessId } = req.params;
    try {
        const reviews = await review_model_1.default.find({
            business: businessId,
        }).exec();
        res.status(200).json(reviews);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function createReview(req, res) {
    const { userId } = req; // user id received from verifyToken func
    try {
        // Create and save the new task
        const newReviewData = {
            ...req.body,
            user: userId,
        };
        const newReview = new review_model_1.default(newReviewData);
        const tempReview = await newReview.save();
        await (0, rating_middleware_1.updateBusinessRating)(tempReview.business);
        app_1.io.emit("reviewCreated", tempReview);
        res.status(201).json(tempReview);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function deleteReview(req, res) {
    const { reviewId } = req.params;
    try {
        const deletedReview = await review_model_1.default.findOneAndDelete({
            _id: reviewId,
        }).exec();
        await (0, rating_middleware_1.updateBusinessRating)(deletedReview.business);
        app_1.io.emit("reviewDeleted", deletedReview);
        res.status(200).json({ message: "Review deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function updateReview(req, res) {
    const updatedData = req.body;
    const { reviewId } = req.params;
    try {
        const updatedReview = await review_model_1.default.findByIdAndUpdate(reviewId, updatedData, // {content: "i think this place is great!"}
        { new: true });
        if (!updatedReview) {
            res.status(404).json({ message: "Review not found" });
            return;
        }
        await (0, rating_middleware_1.updateBusinessRating)(updatedReview.business);
        app_1.io.emit("reviewUpdated", updatedReview);
        res.status(200).json(updatedReview);
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the review",
            error: error.message,
        });
    }
}
async function postLike(req, res) {
    const { userId } = req;
    const { reviewId } = req.params;
    try {
        const checkReview = await review_model_1.default.findById(reviewId);
        if (!checkReview) {
            res.status(404).json({ message: "Review not found!" });
            return;
        }
        const newLike = new likes_model_1.default({
            review: reviewId,
            user: userId,
        });
        const savedLike = await newLike.save();
        await review_model_1.default.findByIdAndUpdate(reviewId, { $inc: { likes: 1 } });
        await user_model_1.default.findByIdAndUpdate(userId, { $push: { likes: reviewId } });
        app_1.io.emit("likedReview", savedLike);
        res.status(201).json(savedLike);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function deleteLike(req, res) {
    const { userId } = req;
    const { reviewId } = req.params;
    try {
        await likes_model_1.default.findOneAndDelete({ user: userId, review: reviewId });
        await review_model_1.default.findByIdAndUpdate(reviewId, { $inc: { likes: -1 } });
        await user_model_1.default.findByIdAndUpdate(userId, { $pull: { likes: reviewId } });
        app_1.io.emit("unlikedReview", { user: userId, review: reviewId });
        res.status(201).json({ message: "Like removed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
