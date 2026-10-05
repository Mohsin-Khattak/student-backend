const {
  uploadProfileImage,
  uploadDocument,
} = require("../controllers/upload.controller");

// Yahan sirf middleware aur controller function attach kiya hai
router.post(
  "/upload-profile",
  verifyToken,
  upload.single("profileImage"),
  uploadProfileImage
);

router.route(
  "/upload-document",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    {
      name: "documents",
      maxCount: 5,
    },
  ]),
  uploadDocument
);
