"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_2 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.verifyToken, review_controller_1.createReview);
router.delete("/:reviewId", auth_middleware_1.verifyToken, auth_middleware_2.authorizeReviewOwner, review_controller_1.deleteReview);
router.put("/:reviewId", auth_middleware_1.verifyToken, auth_middleware_2.authorizeReviewOwner, review_controller_1.updateReview);
router.post("/:reviewId/likes", auth_middleware_1.verifyToken, review_controller_1.postLike);
router.delete("/:reviewId/likes", auth_middleware_1.verifyToken, review_controller_1.deleteLike);
exports.default = router;
