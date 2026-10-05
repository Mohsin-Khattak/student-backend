const mongooes = require("mongoose");

const studentSchema = new mongooes.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
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
const studentModel = mongooes.model("Student", studentSchema);
module.exports = studentModel;
