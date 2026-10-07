const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    profileImage: { type: String, default: null },

    // Admin-specific fields:
    adminLevel: { type: String, default: "super-admin" }, // Access control ke liye
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
