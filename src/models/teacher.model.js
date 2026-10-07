const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "teacher" },
    profileImage: { type: String, default: null },

    // Teacher-specific fields:
    subjects: [{ type: String }], // Kaunse subjects parhata hai
    qualification: { type: String, default: "" }, // Degree / Masters etc.

    documents: [
      {
        url: { type: String },
        title: { type: String }, // Misal ke tor par: Resume, Degree
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
