// src/routes/programRoutes.js
const express = require("express");
const router = express.Router();

// Programs array (even if only one for now)
const programs = [
  {
    name: "Google STEP Internship",
    provider: "Google",
    level: "Undergraduate",
    country: "USA",
    field: "Computer Science",
    website: "https://careers.google.com",
    verified: true,
    type: "internship",
  }
];

// GET /api/programs
router.get("/", (req, res) => {
  res.json(programs);
});

module.exports = router;
