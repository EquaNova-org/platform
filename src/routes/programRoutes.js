const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

/**
 * GET all opportunities
 * /api/programs
 */
router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST create ONE opportunity
 * /api/programs
 */
router.post("/", async (req, res) => {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * GET opportunity by ID
 * /api/programs/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

module.exports = router;
