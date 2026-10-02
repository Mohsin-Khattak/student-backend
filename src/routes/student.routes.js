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

router.route("/").get(getStudent);
router.post("/", verifyToken, verifyRole(["admin"]), addStudent);
router
  .route("/:id")
  .put(verifyToken, verifyRole(["admin", "teacher"]), updateStudent)
  .delete(verifyToken, verifyRole(["admin"]), deleteStudent);
module.exports = router;
