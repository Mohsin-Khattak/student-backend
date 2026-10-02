const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("🛡️ verifyToken function ke andar agaye hain!");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access! Token nahi mila.",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );

    req.user = decoded;
    next();
  } catch (error) {
    console.log("errorr check karo", error.message);
    return res.status(403).json({
      success: false,
      message: "Invalid ya Expired Token!",
    });
  }
};

module.exports = verifyToken;
