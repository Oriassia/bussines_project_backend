"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: "Review", required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
likeSchema.index({ user: 1, review: 1 }, { unique: true });
const Like = (0, mongoose_1.model)("Like", likeSchema);
exports.default = Like;
