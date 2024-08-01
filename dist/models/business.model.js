"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema();
const contactInfoSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    openAt: { type: String, required: true },
    closeAt: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    websiteLink: { type: String, required: true },
}, {
    _id: false,
});
const businessSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    contactInfo: { type: contactInfoSchema, required: true },
    rating: { type: Number, required: true, default: 0 },
});
const Business = (0, mongoose_1.model)("Business", businessSchema);
exports.default = Business;
