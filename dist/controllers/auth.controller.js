"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model")); // Adjust the path as per your project structure
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value
async function register(req, res) {
    try {
        const { username, password, firstName, lastName, email } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, SALT_ROUNDS); // Hash password
        const user = new user_model_1.default({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
        });
        await user.save(); // Save user to database
        res.status(200).json({ message: "User registered successfully" });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        res.status(500).json({ error: error.message });
    }
}
async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ error: "Authentication failed" });
            return;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ error: "Authentication failed" });
            return;
        }
        // Generate JWT token containing user id
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "5h",
        });
        // Send token in response to the client, not the user object!
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
}
