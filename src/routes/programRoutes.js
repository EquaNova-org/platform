const express = require("express");
const router = express.Router();

let program = {
  name: "Google STEP Internship",
  provider: "Google",
  level: "Undergraduate",
  country: "USA",
  field: "Computer Science",
  website: "https://careers.google.com",
  verified: true,
  type: "internship",
};

// GET program
router.get("/", (req, res) => {
  res.json(program);
});

// POST program (Thunder Client)
router.post("/", (req, res) => {
  program = req.body;
  res.status(201).json({
    message: "Program updated successfully",
    program,
  });
});

module.exports = router;
