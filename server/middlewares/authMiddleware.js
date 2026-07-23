const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }

  // Handle Bearer prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

module.exports = checkAuth;
