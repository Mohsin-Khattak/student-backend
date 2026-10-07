const { deleteFileFromS3 } = require("../middleware/upload.middleware");
const adminModel = require("../models/admin.model");
const studentModel = require("../models/student.model");
const teacherModel = require("../models/teacher.model");

const getModelByRole = (role) => {
  if (role === "admin") return adminModel;
  if (role === "teacher") return teacherModel;
  if (role === "student") return studentModel;
  return null;
};

// S3 image upload aur DB update karne ka controller function
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Koi file upload nahi hui" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;
    const targetModel = getModelByRole(userRole);
    if (!targetModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user role!" });
    }

    const user = await targetModel.findById(userId);

    if (user && user.profileImage) {
      await deleteFileFromS3(user.profileImage);
    }

    const s3ImageUrl = req.file.location; // S3 ka public URL

    const updateUser = await targetModel.findByIdAndUpdate(
      userId,
      { profileImage: s3ImageUrl },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "File successfully AWS S3 pe upload ho gayi hai",
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadDocument = async (req, res) => {
  try {
    const profileImage =
      req.files && req.files["profileImage"]
        ? req.files["profileImage"][0].location
        : null;

    const documents =
      req.files && req.files["documents"]
        ? req.files["documents"].map((file) => ({
            url: file.location,
            title: file.originalname,
          }))
        : [];

    const userId = req.user.id;
    const userRole = req.user.role;
    const targetModel = getModelByRole(userRole);
    if (!targetModel) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user role!" });
    }

    // Update data object banana
    const updateData = {};
    if (profileImage) {
      updateData.profileImage = profileImage;
    }
    if (documents.length > 0) {
      updateData.$push = { documents: { $each: documents } };
    }

    // 'await' yahan lazmi hai!
    const updateUser = await targetModel.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after",
    });

    res.status(200).json({
      success: true,
      message: "Documents successfully S3 par upload ho gaye hain!",
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadProfileImage,
  uploadDocument,
};
