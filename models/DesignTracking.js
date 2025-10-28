const mongoose = require("mongoose");

const DesignTrackingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Design factors tracking (9 factors)
  visualGraphics: {
    type: Number,
    default: 0,
    min: 0,
  },
  color: {
    type: Number,
    default: 0,
    min: 0,
  },
  activityNoticeability: {
    type: Number,
    default: 0,
    min: 0,
  },
  entryPoint: {
    type: Number,
    default: 0,
    min: 0,
  },
  font: {
    type: Number,
    default: 0,
    min: 0,
  },
  gestalt: {
    type: Number,
    default: 0,
    min: 0,
  },
  hierarchy: {
    type: Number,
    default: 0,
    min: 0,
  },
  perceptiveAnimation: {
    type: Number,
    default: 0,
    min: 0,
  },
  transitionNavigation: {
    type: Number,
    default: 0,
    min: 0,
  },
  // User preferences
  preferences: {
    preferredColors: [String],
    preferredFonts: [String],
    preferredAnimationSpeed: {
      type: String,
      enum: ["slow", "normal", "fast"],
      default: "normal",
    },
    preferredLayoutStyle: {
      type: String,
      enum: ["minimal", "detailed", "modern", "classic"],
      default: "modern",
    },
  },
  // Activity logs
  activityLog: [
    {
      action: String,
      factor: String,
      value: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      sessionId: String,
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update lastUpdated on save
DesignTrackingSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("DesignTracking", DesignTrackingSchema);
