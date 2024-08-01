"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likes_model_1 = __importDefault(require("./likes.model"));
const user_model_1 = __importDefault(require("./user.model"));
const reviewSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    business: { type: mongoose_1.Schema.Types.ObjectId, ref: "Business", required: true },
    likes: { type: Number, default: 0 },
    rating: { type: Number, max: 5, min: 0, required: true },
}, { timestamps: true });
reviewSchema.pre("findOneAndDelete", async function (next) {
    const reviewId = this.getQuery()["_id"];
    // Delete all likes related to the review
    await likes_model_1.default.deleteMany({ review: reviewId });
    // Update users who liked the review
    await user_model_1.default.updateMany({ likes: reviewId }, { $pull: { likes: reviewId } });
    next();
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
