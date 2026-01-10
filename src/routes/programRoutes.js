// src/routes/programRoutes.js
const express = require("express");
const router = express.Router();

// Dummy single program
const program = {
  name: "Google STEP Internship",
  provider: "Google",
  level: "Undergraduate",
  country: "USA",
  field: "Computer Science",
  website: "https://careers.google.com",
  verified: true,
  type: "internship",
  _id: "695f5434f04e0b0122473d47",
  createdAt: "2026-01-08T06:52:36.696Z",
  updatedAt: "2026-01-08T06:52:36.696Z",
  __v: 0
};

// GET /api/programs
router.get("/", (req, res) => {
  res.json(program);
});

module.exports = router;
