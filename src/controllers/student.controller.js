const studentModel = require("../models/student.model");
const { deleteFileFromS3 } = require("../middleware/upload.middleware");
const userModel = require("../models/user.model");

// get all student
const getStudent = async (req, res) => {
  try {
    const students = await studentModel.find({});
    res.status(200).json({
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
  console.log("🔥 POST /api/students wali request hit ho gayi hai!", req.body); // <-- Yeh line dalein

  try {
    const { name, age, course } = req.body;
    const newStudent = await studentModel.create(req.body);
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
    const updatedStudent = await studentModel.findByIdAndUpdate(id, req.body, {
      returnDocument: "after", // Yeh option updated document return karta hai
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
    const { id } = req.params; // URL se ID nikalne ke liye
    const deletedStudent = await studentModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        sucess: false,
        message: "Student nahi mila!",
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Student successfully delete ho gaya!",
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: error.message,
    });
  }
};
// S3 image upload aur DB update karne ka controller function
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Koi file upload nahi hui" });
    }

    const studentId = req.user.id;
    const student = await userModel.findById(studentId);
    if (student && student.profileImage) {
      await deleteFileFromS3(student.profileImage);
    }

    const s3ImageUrl = req.file.location; // S3 ka public URL

    const updatedStudent = await userModel.findByIdAndUpdate(
      studentId,
      { profileImage: s3ImageUrl },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "File successfully AWS S3 pe upload ho gayi hai",
      user: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const profileImage = req.files["profileImage"]
      ? req.files["profileImage"][0].location
      : null;
    const certificates = req.files["certificates"]
      ? req.files["certificates"].map((file) => file.location)
      : [];
    const studentId = req.user.id;
    const updateStudent = studentModel.findByIdAndUpdate(
      studentId,
      {
        ...(profileImage & { profileImage }),
        $push: { documents: { $each: certificates } },
      },
      { returnDocument: "after" }
    );
    res.status(200).json({
      sucess: true,
      message: "Documents successfully S3 par upload ho gaye hain!",
      user: updateStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getStudent,
  updateStudent,
  addStudent,
  deleteStudent,
  uploadProfileImage,
  uploadDocument,
};
