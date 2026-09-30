const studentModel = require("../models/student.model");

// get all student
const getStudent = async (req, res) => {
  try {
    const students = await studentModel.find({});
    res.status(201).json({
      sucess: true,
      count: students.length,
      data: students,
      message: "Student records fetch",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};

// add new student
const addStudent = async (req, res) => {
  try {
    const { name, age, course } = req.body;
    const newStudent = await studentModel.create({ name, age, course });
    res.status(200).json({
      sucess: true,
      data: newStudent,
      message: "Student add successfully",
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

// 3. Update a student (PUT)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true, // Yeh option updated document return karta hai
      runValidators: true, // Update ke waqt bhi schema rules check honge
    });

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student nahi mila!" });
    }

    res.status(200).json({
      success: true,
      message: "Student update ho gaya!",
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//delete student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.body();
    const student = await studentModel.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({
        sucess: false,
        message: "student does not exists",
      });
    }
    res.status(200).json({
      sucess: true,
      message: "student delete sucessfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStudent,
  updateStudent,
  addStudent,
  deleteStudent,
};
