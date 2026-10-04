const express = require("express");
const {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  uploadProfileImage,
  uploadDocument, // Controller se function import kiya
} = require("../controllers/student.controller");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const verifyRole = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

router.route("/").get(getStudent);
router.post("/", verifyToken, verifyRole(["admin"]), addStudent);

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
      name: "certificates",
      maxCount: 5,
    },
  ]),
  uploadDocument
);

router
  .route("/:id")
  .put(verifyToken, verifyRole(["admin", "teacher"]), updateStudent)
  .delete(verifyToken, verifyRole(["admin"]), deleteStudent);

module.exports = router;
