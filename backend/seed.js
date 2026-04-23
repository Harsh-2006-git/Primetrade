require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminExists = await User.findOne({ email: "admin@primetask.com" });
    if (adminExists) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const admin = new User({
      fullName: "System Admin",
      email: "admin@primetask.com",
      password: "Admin@123",
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@primetask.com");
    console.log("Pass: Admin@123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
