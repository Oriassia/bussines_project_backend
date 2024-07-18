import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  reviews: Types.ObjectId[];
  likes: Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    reviews: [{ type: Types.ObjectId, ref: "Review", default: [] }],
    likes: [{ type: Types.ObjectId, ref: "Review", default: [] }],
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
