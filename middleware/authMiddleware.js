const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Bearer header

  if (!token) return res.status(401).json({ error: "No token, authorization denied." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Add userId to request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid." });
  }
};

module.exports = authMiddleware;
