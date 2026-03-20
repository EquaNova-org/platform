const express = require("express");
const router = express.Router();
const { createBookingIntent } = require("../controllers/bookingController");

// later: auth middleware plugs here
router.post("/book/:opportunityId", createBookingIntent);

module.exports = router;
