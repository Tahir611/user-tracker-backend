const { trackCulture } = require("../../helpers/trackCulture");

const startQuizCulture = async (req, res) => {
  try {
    const { userId, attemptType, quizId } = req.body;

    if (!userId || !attemptType)
      return res.status(400).json({ success: false, message: "Missing fields" });

    if (attemptType === "group") {
      await trackCulture(userId, "collectivism", "started_group_quiz", { quizId });
    } else {
      await trackCulture(userId, "individualism", "started_solo_quiz", { quizId });
    }

    return res.status(200).json({ success: true, message: "Culture logged successfully" });
  } catch (error) {
    console.error("Error logging culture quiz start:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const submitQuizCulture = async (req, res) => {
  try {
    const { userId, quizId, timeTakenSeconds, timeLimitSeconds } = req.body;
    console.log({userId, quizId, timeLimitSeconds, timeLimitSeconds});

    const ratio = timeTakenSeconds / timeLimitSeconds;
    console.log(ratio);
    if (ratio <= 0.25) {
      await trackCulture(userId, "uncertaintyAvoidance", "submitted_early", { quizId, timeTakenSeconds });
    } else if (ratio >= 0.9) {
      await trackCulture(userId, "uncertaintyAvoidance", "submitted_last_minute", { quizId, timeTakenSeconds });
    }

    return res.status(200).json({ success: true, message: "Quiz submission culture logged" });
  } catch (error) {
    console.error("Error logging quiz culture:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const trackActionCulture = async (req, res) => {
  try {
    const { userId, actionType, details } = req.body;

    switch (actionType) {
      case "opened_announcements":
        await trackCulture(userId, "powerDistance", "followed_announcements", details);
        break;
      case "skipped_announcements":
        await trackCulture(userId, "powerDistance", "skipped_announcements", details);
        break;
      case "explored_all_modules":
        await trackCulture(userId, "longTermOrientation", "explored_all_modules", details);
        break;
      case "skipped_to_quiz":
        await trackCulture(userId, "shortTermOrientation", "skipped_to_quiz", details);
        break;
      case "explored_optional_content":
        await trackCulture(userId, "indulgence", "explored_optional_content", details);
        break;
      case "did_only_required":
        await trackCulture(userId, "restraint", "did_only_required", details);
        break;
    }

    return res.status(200).json({ success: true, message: "Culture behavior logged" });
  } catch (error) {
    console.error("Error tracking culture action:", error);
    res.status(500).json({ success: false, message: "Failed to track culture" });
  }
};

module.exports = { startQuizCulture, submitQuizCulture, trackActionCulture };
