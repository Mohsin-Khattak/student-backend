const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "student",
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },

    // University Semesters & Courses (Multiple Courses Support)
    semesters: [
      {
        semesterName: { type: String, required: true }, // Misal ke tor par: "Semester 1", "Fall 2026"
        courses: [{ type: String }], // Us semester ke subjects/courses (jaise ["Data Structures", "OOP", "Calculus"])
      },
    ],

    // Profile & Documents (S3 Integration ke liye)
    profileImage: {
      type: String,
      default: null,
    },
    documents: [
      {
        url: { type: String },
        title: { type: String }, // Misal ke tor par: Degree, Transcript, CNIC
      },
    ],
  },
  {
    timestamps: true,
  }
);

const studentModel = mongoose.model("Student", studentSchema);
module.exports = studentModel;
