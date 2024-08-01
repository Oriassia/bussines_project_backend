"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessesCount = getBusinessesCount;
exports.getBusinessesCategories = getBusinessesCategories;
exports.getBusinesses = getBusinesses;
exports.getBusinessAndReviewsById = getBusinessAndReviewsById;
const business_model_1 = __importDefault(require("../models/business.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
// todo : figure out type of query
function buildCritiria(query) {
    const critiria = {};
    if (query.name) {
        critiria.name = { $regex: query.name, $options: "i" };
    }
    if (query.category) {
        const categories = query.category
            .split(",")
            .map((category) => category.trim());
        critiria.category = { $in: categories };
    }
    if (query.rating) {
        critiria.rating = { $gte: query.rating };
    }
    return critiria;
}
async function getBusinessesCount(req, res) {
    const { query } = req;
    const critiria = buildCritiria(query);
    try {
        const count = await business_model_1.default.countDocuments(critiria);
        res.status(200).json({ count });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getBusinessesCategories(req, res) {
    try {
        // Fetch businesses and select the 'categories' field
        const businesses = await business_model_1.default.find().select("category").lean().exec();
        // Extract the categories field from each business
        const categories = businesses.flatMap((business) => {
            return business.category;
        });
        // Return unique categories if needed
        const uniqueCategories = [...new Set(categories)];
        res.status(200).json(uniqueCategories);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function getBusinesses(req, res) {
    const { query } = req;
    const critiria = buildCritiria(query);
    let page = (query.page && +query.page) || 1;
    if (page < 1)
        page = 1;
    const limit = (query.limit && +query.limit) || 8;
    const startIndex = (page - 1) * +limit || 0;
    try {
        const businesses = await business_model_1.default.find(critiria)
            .skip(startIndex)
            .limit(limit)
            .exec();
        res.status(200).json(businesses);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getBusinessAndReviewsById(req, res) {
    const { businessId } = req.params;
    try {
        const business = await business_model_1.default.findById(businessId)
            .lean()
            .exec();
        const reviewList = await review_model_1.default.find({
            business: businessId,
        })
            .populate("user", "username")
            .lean()
            .exec();
        const businessWithReview = { ...business, reviews: reviewList };
        res.status(200).json(businessWithReview);
    }
    catch (error) {
        if (error.name === "CastError") {
            res
                .status(404)
                .json({ message: `Business not found with id: ${businessId}` });
            return;
        }
        res.status(500).json({ message: error.message });
    }
}
