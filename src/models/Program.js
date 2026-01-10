const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Bachelor", "Master", "PhD", "Course", "Undergraduate", "Graduate", "Postgraduate", "High School"],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["university", "internship", "webinar"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", ProgramSchema);
