"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const business_controller_1 = require("../controllers/business.controller");
router.get("/", business_controller_1.getBusinesses);
router.get("/count", business_controller_1.getBusinessesCount);
router.get("/category", business_controller_1.getBusinessesCategories);
router.get("/:businessId", business_controller_1.getBusinessAndReviewsById);
exports.default = router;
