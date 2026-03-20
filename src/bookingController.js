const Opportunity = require("../models/Opportunity");
const BookingIntent = require("../models/BookingIntent");

exports.createBookingIntent = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    // 1. Find opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || opportunity.status !== "active") {
      return res.status(404).json({ error: "Opportunity not available" });
    }

    // 2. Nova Mode safety gate (future-proof)
    const userNovaMode = req.user?.novaMode || false;

    if (userNovaMode && !opportunity.safety.novaEligible) {
      return res.status(403).json({
        error: "This opportunity is not eligible for Nova Mode"
      });
    }

    // 3. Log booking intent
    await BookingIntent.create({
      userId: req.user?._id || null,
      opportunityId: opportunity._id,
      provider: opportunity.provider.name,
      bookingType: opportunity.booking?.type || "redirect"
    });

    // 4. Respond with redirect info
    return res.json({
      bookingType: opportunity.booking.type,
      redirectUrl: opportunity.booking.externalUrl
    });

  } catch (err) {
    console.error("Booking intent error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
