"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
const getUser = async (req, res) => {
    const { userId } = req;
    try {
        const user = await user_model_1.default.findById(userId).exec();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
router.get("/", getUser);
exports.default = router;
