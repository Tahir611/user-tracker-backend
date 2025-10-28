const express = require("express");
const {
  getUserDesignTracking,
  updateDesignFactor,
  updateUserPreferences,
  trackUserInteraction,
  getDesignAnalytics,
} = require("../../controllers/student-controller/design-tracking-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

// Get user's design tracking data
router.get("/:userId", authenticate, getUserDesignTracking);

// Update a specific design factor
router.put("/:userId/factor", authenticate, updateDesignFactor);

// Update user preferences
router.put("/:userId/preferences", authenticate, updateUserPreferences);

// Track multiple user interactions
router.post("/:userId/track", authenticate, trackUserInteraction);

// Get design analytics
router.get("/:userId/analytics", authenticate, getDesignAnalytics);

module.exports = router;
