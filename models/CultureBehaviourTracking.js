const mongoose = require("mongoose");

const CultureBehaviourTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // کلچر بیہیویر فیکٹرز
  Collectivism_Individualism: {
    type: String,
    enum: ["collectivism", "individualism", "neutral"],
    default: "neutral",
  },
  Uncertainty_Avoidance: {
    type: String,
    enum: ["high", "low", "neutral"],
    default: "neutral",
  },
  Power_Distance: {
    type: String,
    enum: ["high", "low", "neutral"],
    default: "neutral",
  },
  Long_Short_Term: {
    type: String,
    enum: ["long_term", "short_term", "neutral"],
    default: "neutral",
  },
  Indulgence_Restraint: {
    type: String,
    enum: ["indulgence", "restraint", "neutral"],
    default: "neutral",
  },
  // اکٹیویٹی لاگز
  activityLog: [
    {
      action: String,
      factor: String,
      value: String,
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
CultureBehaviourTrackingSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("CultureBehaviourTrackingOld", CultureBehaviourTrackingSchema);