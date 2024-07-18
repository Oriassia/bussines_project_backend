import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import connectDB from "./src/config/db";
import User from "./src/models/user.model";
import Business from "./src/models/business.model";
import Review from "./src/models/review.model";

dotenv.config(); // Load environment variables

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

const users = [
  {
    username: "john_doe",
    password: "password123",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    reviews: [],
    likes: [],
  },
  {
    username: "jane_doe",
    password: "password123",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    reviews: [],
    likes: [],
  },
];

const businesses = [
  {
    name: "Coffee Shop",
    image: "coffee.jpg",
    description: "A great place to drink coffee",
    category: "Cafe",
    contactInfo: {
      address: "123 Coffee St.",
      phoneNumber: "123-456-7890",
      websiteLink: "https://coffeeshop.com",
    },
    rating: 4.5,
    reviews: [],
  },
  {
    name: "Pizza Place",
    image: "pizza.jpg",
    description: "Delicious pizza and more",
    category: "Restaurant",
    contactInfo: {
      address: "456 Pizza Rd.",
      phoneNumber: "987-654-3210",
      websiteLink: "https://pizzaplace.com",
    },
    rating: 4.7,
    reviews: [],
  },
];

const reviews = [
  {
    content: "Great coffee and friendly staff!",
    likes: 10,
  },
  {
    content: "Amazing pizza and fast service!",
    likes: 8,
  },
];

async function seedDB() {
  try {
    await connectDB(); // Connect to the database
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});

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

        // Update the respective business and user with the review
        await Business.findByIdAndUpdate(
          review.business,
          { $push: { reviews: review._id } },
          { new: true }
        );

        await User.findByIdAndUpdate(
          review.user,
          { $push: { reviews: review._id } },
          { new: true }
        );

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
