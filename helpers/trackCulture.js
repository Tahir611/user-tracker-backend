const CultureBehaviorTracking = require("../models/CultureTracking");

async function trackCulture(userId, factor, action, details = {}) {
  try {
    let cb = await CultureBehaviorTracking.findOne({ userId });
    if (!cb) cb = new CultureBehaviorTracking({ userId });

    cb[factor] = (cb[factor] || 0) + 1;
    cb.activityLog.push({
      action,
      factor,
      value: 1,
      details,
      timestamp: new Date(),
    });

    await cb.save();
  } catch (error) {
    console.error("Error tracking culture behavior:", error);
  }
}

module.exports = { trackCulture };
