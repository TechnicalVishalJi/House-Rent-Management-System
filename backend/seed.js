/**
 * Seed script — creates an admin user for testing
 * Run: node backend/seed.js
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const ADMIN = {
  name: "Admin User",
  email: "admin@rentease.com",
  password: "admin123",
  role: "admin",
  phone: "+1 555 000 0000",
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Avoid duplicate
  const User = require("./models/User");
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log("Admin already exists. Skipping...");
    process.exit(0);
  }

  await User.create(ADMIN);
  console.log(`
✅ Admin user created!
   Email:    ${ADMIN.email}
   Password: ${ADMIN.password}
  `);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
