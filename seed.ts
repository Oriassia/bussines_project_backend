import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import connectDB from "./src/config/db";
import User from "./src/models/user.model";
import Business from "./src/models/business.model";
import Review from "./src/models/review.model";
import Like from "./src/models/likes.model";

dotenv.config(); // Load environment variables

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

const users = [
  {
    username: "john_doe",
    password: "password123",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    likes: [],
  },
  {
    username: "jane_doe",
    password: "password123",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    likes: [],
  },
];

const businesses = [
  {
    name: "Coffee Shop",
    image: "https://picsum.photos/200/300?random=1",
    description: "A great place to drink coffee and smoke",
    category: "Cafe",
    contactInfo: {
      address: "123 Coffee St.",
      openAt: "09:00",
      closeAt: "22:00",
      phoneNumber: "123-456-7890",
      websiteLink: "https://coffeeshop.com",
    },
    rating: 0,
  },
  {
    name: "Pizza Place",
    image: "https://picsum.photos/200/300?random=3",
    description: "Delicious pizza and more",
    category: "Restaurant",
    contactInfo: {
      address: "456 Pizza Rd.",
      openAt: "09:00",
      closeAt: "22:00",
      phoneNumber: "987-654-3210",
      websiteLink: "https://pizzaplace.com",
    },
    rating: 0,
  },
];

const reviews = [
  {
    content: "Great coffee and friendly staff!",
    likes: 0,
    rating: 5,
  },
  {
    content: "Amazing pizza and fast service!",
    likes: 0,
    rating: 4,
  },
  {
    content: "Nice ambiance but the coffee is too bitter.",
    likes: 0,
    rating: 3,
  },
  {
    content: "The pizza was too greasy.",
    likes: 0,
    rating: 2,
  },
];

async function seedDB() {
  try {
    await connectDB(); // Connect to the database
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Like.deleteMany({});

    await Like.insertMany([]);
    // Hash passwords and create users
    const createdUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS); // Hash password
        const user = new User({ ...u, password: hashedPassword }); // Create new user object
        await user.save(); // Save user to database
        return user; // Return the saved user object
      })
    );

    // Create businesses
    const createdBusinesses = await Business.insertMany(businesses);

    // Create reviews and associate them with users and businesses
    const createdReviews = await Promise.all(
      reviews.map(async (r, index) => {
        const review = new Review({
          ...r,
          user: createdUsers[index % createdUsers.length]._id,
          business: createdBusinesses[index % createdBusinesses.length]._id,
        });
        await review.save();
        return review;
      })
    );

    console.log("Database seeded");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}

seedDB();
