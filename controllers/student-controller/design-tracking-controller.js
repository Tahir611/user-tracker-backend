const DesignTracking = require("../../models/DesignTracking");

// Get user's design tracking data
const getUserDesignTracking = async (req, res) => {
  try {
    const { userId } = req.params;

    let designTracking = await DesignTracking.findOne({ userId });

    // If no tracking exists, create a new one
    if (!designTracking) {
      designTracking = new DesignTracking({ userId });
      await designTracking.save();
    }

    res.status(200).json({
      success: true,
      data: designTracking,
    });
  } catch (error) {
    console.error("Error fetching design tracking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch design tracking data",
    });
  }
};

// Update design tracking factor
const updateDesignFactor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { factor, value, action, sessionId } = req.body;

    let designTracking = await DesignTracking.findOne({ userId });

    if (!designTracking) {
      designTracking = new DesignTracking({ userId });
    }

    // Update the specific factor
    if (designTracking[factor] !== undefined) {
      designTracking[factor] += value;

      // Add to activity log
      designTracking.activityLog.push({
        action,
        factor,
        value,
        sessionId: sessionId || "default",
        timestamp: new Date(),
      });

      await designTracking.save();

      res.status(200).json({
        success: true,
        message: "Design factor updated successfully",
        data: designTracking,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid design factor",
      });
    }
  } catch (error) {
    console.error("Error updating design factor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update design factor",
    });
  }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    let designTracking = await DesignTracking.findOne({ userId });

    if (!designTracking) {
      designTracking = new DesignTracking({ userId });
    }

    // Update preferences
    designTracking.preferences = { ...designTracking.preferences, ...preferences };

    // Log preference change
    designTracking.activityLog.push({
      action: "preference_update",
      factor: "preferences",
      value: 1,
      timestamp: new Date(),
    });

    await designTracking.save();

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: designTracking,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
    });
  }
};

// Track user interaction
const trackUserInteraction = async (req, res) => {
  try {
    const { userId } = req.params;
    const { interactions } = req.body; // Array of interactions

    let designTracking = await DesignTracking.findOne({ userId });

    if (!designTracking) {
      designTracking = new DesignTracking({ userId });
    }

    // Process multiple interactions
    interactions.forEach((interaction) => {
      const { factor, action, value = 1, sessionId } = interaction;

      if (designTracking[factor] !== undefined) {
        designTracking[factor] += value;

        designTracking.activityLog.push({
          action,
          factor,
          value,
          sessionId: sessionId || "default",
          timestamp: new Date(),
        });
      }
    });

    await designTracking.save();

    res.status(200).json({
      success: true,
      message: "User interactions tracked successfully",
      data: designTracking,
    });
  } catch (error) {
    console.error("Error tracking user interactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track user interactions",
    });
  }
};

// Get analytics data
const getDesignAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = "all" } = req.query;

    const designTracking = await DesignTracking.findOne({ userId });

    if (!designTracking) {
      return res.status(404).json({
        success: false,
        message: "No tracking data found",
      });
    }

    // Filter activity log based on timeframe
    let activityLog = designTracking.activityLog;
    if (timeframe !== "all") {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      activityLog = designTracking.activityLog.filter(
        (log) => log.timestamp >= startDate
      );
    }

    // Calculate analytics
    const analytics = {
      totalInteractions: activityLog.length,
      factorBreakdown: {
        visualGraphics: designTracking.visualGraphics,
        color: designTracking.color,
        activityNoticeability: designTracking.activityNoticeability,
        entryPoint: designTracking.entryPoint,
        font: designTracking.font,
        gestalt: designTracking.gestalt,
        hierarchy: designTracking.hierarchy,
        perceptiveAnimation: designTracking.perceptiveAnimation,
        transitionNavigation: designTracking.transitionNavigation,
      },
      preferences: designTracking.preferences,
      recentActivity: activityLog.slice(-10), // Last 10 activities
    };

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error fetching design analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch design analytics",
    });
  }
};

module.exports = {
  getUserDesignTracking,
  updateDesignFactor,
  updateUserPreferences,
  trackUserInteraction,
  getDesignAnalytics,
};
