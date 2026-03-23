const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    type: { 
      type: String, 
      enum: ["internship", "volunteering", "webinar", "scholarship", "exchange", "study program", "competition", "hackathon", "summer camp"], 
      required: true 
    },

    // ✅ MUST be a top-level field
    contentHash: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    provider: { type: String, trim: true },
    country: { type: String, trim: true },
    field: { type: String, trim: true },
    level: { type: String, trim: true },
    deadline: { type: Date },
    verified: { type: Boolean, default: false },

    source: {
      name: String,
      sourceUrl: { type: String, index: true } // NOT unique
    },

    description: String
  },
  { timestamps: true }
);

// Only compile model once
module.exports =
  mongoose.models.Opportunity ||
  mongoose.model("Opportunity", OpportunitySchema);
