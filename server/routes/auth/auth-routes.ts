// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../../controllers/auth/auth-controller");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
