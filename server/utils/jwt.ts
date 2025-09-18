// utils/jwt.js
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    },
    process.env.SECRET_KEY, // 🔑 from .env
    { expiresIn: "60m" } // token expiry
  );
};

// Verify JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return null; // invalid/expired token
  }
};

module.exports = { generateToken, verifyToken };
