const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admin role required" });
    }
    next();
  } catch (error) {
    console.error("Admin check middleware error:", error);
    res.status(500).json({ message: "Server error checking admin role" });
  }
};

module.exports = checkAdmin;
