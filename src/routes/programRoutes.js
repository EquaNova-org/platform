// src/routes/programRoutes.js
const express = require("express");
const router = express.Router();

// Multiple dummy programs (temporary database)
const programs = [
  {
    name: "Google STEP Internship",
    provider: "Google",
    level: "Undergraduate",
    country: "USA",
    field: "Computer Science",
    website: "https://careers.google.com",
    verified: true,
    type: "internship"
  },
  {
    name: "Erasmus+ Exchange Program",
    provider: "European Union",
    level: "Undergraduate",
    country: "Multiple (EU)",
    field: "All Fields",
    website: "https://erasmus-plus.ec.europa.eu",
    verified: true,
    type: "university"
  },
  {
    name: "UN Youth Leadership Webinar",
    provider: "United Nations",
    level: "All Levels",
    country: "Online",
    field: "Leadership",
    website: "https://www.un.org/youthenvoy",
    verified: true,
    type: "webinar"
  }
];

// GET /api/programs
router.get("/", (req, res) => {
  res.json(programs);
});

module.exports = router;
