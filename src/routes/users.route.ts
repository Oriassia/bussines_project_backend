import express, { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

const router = express.Router();

const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req;
  try {
    const user: IUser | null = await User.findById(userId).exec();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

router.get("/", getUser);

export default router;
