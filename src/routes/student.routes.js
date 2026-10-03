const express = require("express");
const {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const verifyRole = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

router.route("/").get(getStudent);
router.post("/", verifyToken, verifyRole(["admin"]), addStudent);
router
  .route("/:id")
  .put(verifyToken, verifyRole(["admin", "teacher"]), updateStudent)
  .delete(verifyToken, verifyRole(["admin"]), deleteStudent);

router.post(
  "/upload-profile",
  verifyToken,
  upload.single("profileImage"),
  (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ sucess: false, message: "koi file upload nahi hwi" });
      }
      res.status(200).json({
        sucess: true,
        message: "File sucessfully AWS S3 pe upload hogi hai",
        fileUrl: req.file.location,
        fileName: req.file.key,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);
module.exports = router;
