const express = require("express");
const {
  getStudent,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student.controller");
const router = express.Router();

router.route("/").get(getStudent).post(addStudent);
router.route("/:id").put(updateStudent).delete(deleteStudent);
module.exports = router;
