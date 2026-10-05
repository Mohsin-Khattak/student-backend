const mongooes = require("mongoose");

const userSchema = new mongooes.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "student", "teacher"],
      default: "student",
    },
    profileImage: { type: String, default: null },
    documents: [
      {
        url: { type: String },
        title: { type: String }, // optional: document ka naam ya type (jaise CNIC, Degree)
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongooes.model("User", userSchema);
