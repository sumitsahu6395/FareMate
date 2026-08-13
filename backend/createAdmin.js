const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const existingAdmin = await Admin.findOne({
      email: "admin@faremate.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "FareMate Admin",
      email: "admin@faremate.com",
      password: "Admin@123",
      role: "admin",
    });

    console.log("Admin created successfully");

    process.exit();
  } catch (error) {
    console.error("Admin creation error:", error.message);
    process.exit(1);
  }
};

createAdmin();