"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessRating = updateBusinessRating;
const review_model_1 = __importDefault(require("../models/review.model"));
const business_model_1 = __importDefault(require("../models/business.model"));
async function updateBusinessRating(businessId) {
    let averageRating;
    const businessReviews = await review_model_1.default.find({
        business: businessId,
    });
    if (businessReviews.length === 0)
        averageRating = 0;
    else {
        averageRating =
            businessReviews.reduce((sum, review) => {
                return (sum +
                    (review.rating !== undefined && review.rating !== null
                        ? review.rating
                        : 0));
            }, 0) / businessReviews.length;
    }
    await business_model_1.default.findByIdAndUpdate(businessId, { rating: averageRating });
}
