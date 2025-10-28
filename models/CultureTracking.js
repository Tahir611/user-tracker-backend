const mongoose = require("mongoose");

const CultureBehaviorTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  collectivism: { type: Number, default: 0 },
  individualism: { type: Number, default: 0 },
  uncertaintyAvoidance: { type: Number, default: 0 },
  powerDistance: { type: Number, default: 0 },
  longTermOrientation: { type: Number, default: 0 },
  shortTermOrientation: { type: Number, default: 0 },
  indulgence: { type: Number, default: 0 },
  restraint: { type: Number, default: 0 },

  activityLog: [
    {
      action: String,
      factor: String,
      value: Number,
      details: Object,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("CultureBehaviorTracking", CultureBehaviorTrackingSchema);
