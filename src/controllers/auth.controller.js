const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const adminModel = require("../models/admin.model");
const teacherModel = require("../models/teacher.model");
const studentModel = require("../models/student.model");

const getModuleByRole = (role) => {
  if (role === "admin") return adminModel;
  if (role === "teacher") return teacherModel;
  if (role === "student") return studentModel;
  return null;
};
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      semesters,
      subjects,
      qualification,
    } = req.body;

    const userRole = role || "student";
    const targetModule = getModuleByRole(userRole);

    if (!targetModule) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid role selected" });
    }

    const existingAdmin = await adminModel.findOne({ email });
    const existingTeacher = await teacherModel.findOne({ email });
    const existingStudent = await studentModel.findOne({ email });

    if (existingAdmin || existingTeacher || existingStudent) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let userData = {
      name,
      email,
      password: hashedPassword,
      role: userRole,
    };

    if (userRole === "student") {
      (studentModel.age = age), (studentModel.semesters = semesters || []);
    } else if (userRole === "teacher") {
      (teacherModel.subjects = subjects || []),
        (teacherModel.qualification = qualification || "");
    }
    const newUser = await targetModule.create(userData);
    res.status(201).json({
      message: `${userRole} created successfully`,
      sucess: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;
    let role = "";
    user = await adminModel.findOne({ email });
    if (user) {
      role = "admin";
    }

    if (!user) {
      user = await teacherModel.findOne({ email });
      if (user) role = "teacher";
    }
    if (!user) {
      user = await studentModel.findOne({ email });
      if (user) role = "student";
    }

    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login };
