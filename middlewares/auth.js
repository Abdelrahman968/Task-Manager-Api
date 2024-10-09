const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "lbbSgaHEvlKYrLMNNqKAlE2FJ7ghMdXY6K2kerUv8Vw";

const authMiddleware = (role) => async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  //   console.log(token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userID);
    if (role && req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = authMiddleware;
