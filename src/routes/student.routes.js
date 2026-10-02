const express = require("express");
const {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
console.log("📂 student.routes.js file load ho gayi hai!");
router.route("/").get(getStudent);

router.post("/", verifyToken, addStudent);

router
  .route("/:id")
  .put(verifyToken, updateStudent)
  .delete(verifyToken, deleteStudent);
module.exports = router;
