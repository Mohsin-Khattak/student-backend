const userModel = require("../models/user.model");
const { deleteFileFromS3 } = require("../middleware/upload.middleware");

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
    const documents = req.files["documents"]
      ? req.files["documents"].map((file) => file.location)
      : [];
    const studentId = req.user.id;
    const updateStudent = userModel.findByIdAndUpdate(
      studentId,
      {
        ...(profileImage & { profileImage }),
        $push: { documents: { $each: documents } },
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
  uploadProfileImage,
  uploadDocument,
};
