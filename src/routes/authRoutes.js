const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =====================
   Helper: generate token
===================== */
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* =====================
   POST /api/auth/register
===================== */
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ fullName, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        novaMode: user.novaMode
      }
    });

  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

/* =====================
   POST /api/auth/login
===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        novaMode: user.novaMode
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

/* =====================
   GET /api/auth/me
   (protected — verify token)
===================== */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ user });

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;
