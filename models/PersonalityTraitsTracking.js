const mongoose = require("mongoose");

const PersonalityTraitsTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // پرسنالٹی ٹریٹس فیکٹرز
  openness: {
    type: Number,
    default: 0,
    min: 0,
  },
  conscientiousness: {
    type: Number,
    default: 0,
    min: 0,
  },
  extraversion: {
    type: Number,
    default: 0,
    min: 0,
  },
  agreeableness: {
    type: Number,
    default: 0,
    min: 0,
  },
  neuroticism: {
    type: Number,
    default: 0,
    min: 0,
  },
  // اکٹیویٹی لاگز
  activityLog: [
    {
      action: String,
      factor: String,
      value: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      details: Object,
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// لاسٹ اپڈیٹڈ کو اپڈیٹ کرنا
PersonalityTraitsTrackingSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("PersonalityTraitsTracking", PersonalityTraitsTrackingSchema);