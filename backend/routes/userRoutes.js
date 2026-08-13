const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/userController");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Protected Profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User authenticated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
});


module.exports = router;