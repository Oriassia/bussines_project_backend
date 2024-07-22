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
    name: "Brew Haven",
    image:
      "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Brew Haven offers a cozy atmosphere where you can enjoy a wide variety of coffee drinks, teas, and pastries. Whether you're meeting friends, working on your laptop, or simply relaxing with a good book, Brew Haven is the perfect spot to unwind. Our baristas are skilled in crafting delicious beverages and our pastries are freshly baked every day.",
    category: "Cafe",
    contactInfo: {
      address: "123 Coffee St.",
      phoneNumber: "123-456-7890",
      websiteLink: "https://brewhaven.com",
      openAt: "08:00",
      closeAt: "22:00",
    },
    rating: 5,
  },
  {
    name: "Slice of Heaven",
    image:
      "https://images.pexels.com/photos/8176833/pexels-photo-8176833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Slice of Heaven is known for its delicious pizza made with the freshest ingredients. Our menu features a wide variety of pizzas, including classic favorites and unique specialty pies. In addition to pizza, we offer a selection of pastas, salads, and desserts. Whether you're dining in or taking out, Slice of Heaven is the perfect place for a satisfying meal.",
    category: "Restaurant",
    contactInfo: {
      address: "456 Pizza Rd.",
      phoneNumber: "987-654-3210",
      websiteLink: "https://sliceofheaven.com",
      openAt: "11:00",
      closeAt: "23:00",
    },
    rating: 4,
  },
  {
    name: "Readers' Corner",
    image:
      "https://images.pexels.com/photos/3952078/pexels-photo-3952078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Readers' Corner is a haven for book lovers, offering a wide selection of books across various genres. Our store is a quiet and welcoming place where you can browse, read, and discover new authors. We also host regular events, including book signings, readings, and discussions. Whether you're a casual reader or a literary enthusiast, Readers' Corner has something for everyone.",
    category: "Bookstore",
    contactInfo: {
      address: "789 Book Ln.",
      phoneNumber: "654-321-9870",
      websiteLink: "https://readerscorner.com",
      openAt: "09:00",
      closeAt: "21:00",
    },
    rating: 3,
  },
  {
    name: "Green Goodies",
    image:
      "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Green Goodies is your go-to destination for fresh, organic foods. Our menu includes a variety of salads, smoothies, and bowls made with locally sourced ingredients. We are committed to promoting a healthy lifestyle by offering nutritious and delicious options. Whether you're looking for a quick meal or a place to relax and enjoy wholesome food, Green Goodies has you covered.",
    category: "Health Food",
    contactInfo: {
      address: "321 Green Ave.",
      phoneNumber: "321-654-9870",
      websiteLink: "https://greengoodies.com",
      openAt: "08:00",
      closeAt: "20:00",
    },
    rating: 2,
  },
  {
    name: "Gadget Galaxy",
    image:
      "https://images.pexels.com/photos/792345/pexels-photo-792345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Gadget Galaxy is the ultimate destination for tech enthusiasts. We offer a wide range of the latest gadgets, from smartphones and laptops to smart home devices and accessories. Our knowledgeable staff is always on hand to help you find the perfect product and provide expert advice. Whether you're looking to upgrade your tech or find the perfect gift, Gadget Galaxy has everything you need.",
    category: "Electronics",
    contactInfo: {
      address: "987 Tech Blvd.",
      phoneNumber: "789-123-4560",
      websiteLink: "https://gadgetgalaxy.com",
      openAt: "10:00",
      closeAt: "21:00",
    },
    rating: 0,
  },
  {
    name: "Fit Life Center",
    image:
      "https://images.pexels.com/photos/7031705/pexels-photo-7031705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Fit Life Center is dedicated to helping you achieve your fitness goals. Our state-of-the-art facility features a wide range of equipment, fitness classes, and personal training services. Whether you're a beginner or a seasoned athlete, our friendly and knowledgeable staff is here to support you every step of the way. Join us at Fit Life Center and take the first step towards a healthier, happier you.",
    category: "Gym",
    contactInfo: {
      address: "654 Fit Rd.",
      phoneNumber: "456-789-0123",
      websiteLink: "https://fitlifecenter.com",
      openAt: "06:00",
      closeAt: "22:00",
    },
    rating: 0,
  },
  {
    name: "Creative Canvas",
    image:
      "https://images.pexels.com/photos/139764/pexels-photo-139764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Creative Canvas is a gallery showcasing modern and contemporary art from local and international artists. Our exhibitions feature a diverse range of styles and mediums, providing a platform for emerging and established artists alike. Whether you're an art enthusiast or simply looking for inspiration, Creative Canvas offers a vibrant and dynamic environment to explore the world of art.",
    category: "Art Gallery",
    contactInfo: {
      address: "321 Art St.",
      phoneNumber: "321-456-7890",
      websiteLink: "https://creativecanvas.com",
      openAt: "10:00",
      closeAt: "19:00",
    },
    rating: 0,
  },
  {
    name: "Epicurean Delight",
    image:
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Epicurean Delight is a fine dining restaurant offering a gourmet experience with a menu that combines classic and contemporary cuisine. Our chefs use the freshest ingredients to create dishes that are as visually stunning as they are delicious. Whether you're celebrating a special occasion or enjoying a night out, Epicurean Delight provides an elegant and memorable dining experience.",
    category: "Restaurant",
    contactInfo: {
      address: "456 Gourmet Ln.",
      phoneNumber: "654-123-9870",
      websiteLink: "https://epicureandelight.com",
      openAt: "17:00",
      closeAt: "23:00",
    },
    rating: 0,
  },
  {
    name: "Furry Friends",
    image:
      "https://www.woodlandsmarket.com/petshop/wp-content/uploads/DSC07237.jpg",
    description:
      "Furry Friends is your one-stop shop for all your pet needs. We offer a wide range of products, from food and toys to grooming supplies and accessories. Our knowledgeable staff is passionate about pets and always ready to help you find the best products for your furry companions. Whether you have a dog, cat, bird, or small animal, Furry Friends has everything you need to keep your pet happy and healthy.",
    category: "Pet Store",
    contactInfo: {
      address: "789 Pet St.",
      phoneNumber: "789-456-1230",
      websiteLink: "https://furryfriends.com",
      openAt: "09:00",
      closeAt: "20:00",
    },
    rating: 0,
  },
  {
    name: "Harmonic Haven",
    image:
      "https://images.pexels.com/photos/5855789/pexels-photo-5855789.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Harmonic Haven is a music store offering a wide selection of instruments and accessories for musicians of all levels. From guitars and keyboards to drums and brass instruments, we have everything you need to make music. Our staff includes experienced musicians who can provide expert advice and help you find the perfect instrument. Whether you're a beginner or a professional, Harmonic Haven is your go-to destination for all things music.",
    category: "Music Store",
    contactInfo: {
      address: "123 Music Ave.",
      phoneNumber: "456-123-7890",
      websiteLink: "https://harmonichaven.com",
      openAt: "10:00",
      closeAt: "18:00",
    },
    rating: 0,
  },
  {
    name: "Blissful Retreat",
    image:
      "https://images.pexels.com/photos/23916839/pexels-photo-23916839.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Blissful Retreat is a spa dedicated to helping you relax and rejuvenate. Our services include massages, facials, body treatments, and more, all designed to provide a luxurious and calming experience. Our skilled therapists use high-quality products and techniques to ensure you leave feeling refreshed and revitalized. Whether you're looking to unwind after a long day or treat yourself to a day of pampering, Blissful Retreat is the perfect place to relax.",
    category: "Spa",
    contactInfo: {
      address: "321 Spa Ln.",
      phoneNumber: "987-654-3210",
      websiteLink: "https://blissfulretreat.com",
      openAt: "10:00",
      closeAt: "20:00",
    },
    rating: 0,
  },
  {
    name: "Style Savvy",
    image:
      "https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Style Savvy is a clothing store offering the latest trends in fashion for men, women, and children. Our curated collection includes stylish and affordable clothing, shoes, and accessories for every occasion. Our friendly staff is always on hand to help you find the perfect outfit and provide personalized styling advice. Whether you're updating your wardrobe or looking for a special piece, Style Savvy has something for everyone.",
    category: "Clothing Store",
    contactInfo: {
      address: "654 Fashion St.",
      phoneNumber: "321-654-7890",
      websiteLink: "https://stylesavvy.com",
      openAt: "10:00",
      closeAt: "19:00",
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
