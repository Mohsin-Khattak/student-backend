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
  },
  {
    timestamps: true,
  }
);
const studentModel = mongooes.model("Student", studentSchema);
module.exports = studentModel;
