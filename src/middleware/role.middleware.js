const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access! Phly login kary.",
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access! Tumhare paas permission nahi hai.",
      });
    }
    next();
  };
};

module.exports = verifyRole;
