const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { upload } = require("../middleware/upload.middleware"); // Aapka multer-s3 middleware

const {
  uploadProfileImage,
  uploadDocument,
} = require("../controllers/upload.controller");

// 1. Profile Image Upload Route
router.post(
  "/upload-profile",
  verifyToken,
  upload.single("profileImage"),
  uploadProfileImage
);

// 2. Documents & Profile Image Upload Route
router.post(
  "/upload-document",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  uploadDocument
);

module.exports = router;
