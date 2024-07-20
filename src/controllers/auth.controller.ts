import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Adjust the path as per your project structure

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });
    await user.save(); // Save user to database
    res.status(200).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.code === 11000)
      res.status(400).json({ error: "User already exists" });

    res.status(500).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) res.status(401).json({ error: "Authentication failed" });

    const isPasswordMatch = await bcrypt.compare(password, user!.password);
    if (!isPasswordMatch)
      res.status(401).json({ error: "Authentication failed" });

    // Generate JWT token containing user id
    const token = jwt.sign({ userId: user!._id }, JWT_SECRET!, {
      expiresIn: "5h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}
