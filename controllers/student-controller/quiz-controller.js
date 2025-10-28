const QuizAttempt = require("../../models/QuizAttempt");
const PersonalityTraitsTracking = require("../../models/PersonalityTraitsTracking");

const submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, score, timeTakenSeconds, timeLimitSeconds } =
      req.body;
    if (!userId || typeof score !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const passed = score >= 6; // pass threshold 6/10

    // find or create attempt
    let attempt = await QuizAttempt.findOne({ userId, quizId: quizId || null });
    if (!attempt) {
      attempt = new QuizAttempt({ userId, quizId: quizId || null });
    }

    // --- Update attempt data ---
    // if (passed) {
    //   attempt.attempts = 0;
    // } else {
      attempt.attempts = (attempt.attempts || 0) + 1;
    // }

    // 🔥 Manage failCount logic
    if (!passed) {
      attempt.failCount = (attempt.failCount || 0) + 1;
    } 
    // else {
    //   // We'll reset failCount only after Neuroticism is triggered
    //   // so keep it here for now
    // }

    // update attempt data
    // attempt.attempts = passed ? 0 : attempt.attempts + 1;
    // attempt.failAttempts = !passed
    //   ? attempt.failAttempts + 1
    //   : attempt.failAttempts;
    console.log({ attempt: attempt.attempts }, { passed });

    attempt.lastResult = passed ? "pass" : "fail";
    attempt.lastScore = score;
    attempt.lastAttemptAt = new Date();
    await attempt.save();

    // update personality tracking
    let pt = await PersonalityTraitsTracking.findOne({ userId });
    if (!pt) pt = new PersonalityTraitsTracking({ userId });

    // --- Conscientiousness ---
    if (timeTakenSeconds < timeLimitSeconds) {
      pt.conscientiousness = (pt.conscientiousness || 0) + 1;
      pt.activityLog.push({
        action: "quiz_before_deadline",
        factor: "conscientiousness",
        value: 1,
        details: { quizId, score, timeTakenSeconds, timeLimitSeconds },
        timestamp: new Date(),
      });
    }

    // --- Record quiz attempt ---
    pt.activityLog.push({
      action: "quiz_attempt",
      factor: passed ? "pass" : "fail",
      value: passed ? 1 : 0,
      details: { quizId, score, timeTakenSeconds },
      timestamp: new Date(),
    });

    // --- Neuroticism logic based on failCount ---
    if (passed && attempt.failCount >= 2) {
      pt.neuroticism = (pt.neuroticism || 0) + 1;
      pt.activityLog.push({
        action: "neuroticism_increment",
        factor: "neuroticism",
        value: 1,
        details: { quizId, failCount: attempt.failCount },
        timestamp: new Date(),
      });

      // Reset failCount after increment
    //   attempt.failCount = 0;
      await attempt.save();
    } else if (passed) {
      // If passed but didn’t trigger neuroticism, still reset consecutive fail attempts
      attempt.failCount = 0;
      await attempt.save();
    }

    // --- Neuroticism ---
    // pt.activityLog.push({
    //   action: "quiz_attempt",
    //   factor: passed ? "pass" : "fail",
    //   value: passed ? 1 : 0,
    //   details: { quizId, score, timeTakenSeconds },
    //   timestamp: new Date(),
    // });

    // check previous consecutive fails
    // let consecutiveFails = 0;
    // for (let i = pt.activityLog.length - 1; i >= 0; i--) {
    //   console.log({ consecutiveFails });
    //   const log = pt.activityLog[i];
    //   console.log(
    //     { log },
    //     { action: log.action, factor: log.factor, quizid: log.details.quizId }
    //   );
    //   if (
    //     log.action === "quiz_attempt" &&
    //     log.factor === "fail" &&
    //     log.details.quizId === quizId
    //   ) {
    //     consecutiveFails++;
    //     console.log({ consecutiveFails });
    //   } else if (
    //     log.action === "quiz_attempt" &&
    //     log.factor === "pass" &&
    //     log.details.quizId === quizId
    //   ) {
    //     break;
    //   }
    // }
    // console.log({ consecutiveFails });

    // if (passed && consecutiveFails >= 2) {
    //   pt.neuroticism = (pt.neuroticism || 0) + 1;
    //   pt.activityLog.push({
    //     action: "neuroticism_increment",
    //     factor: "neuroticism",
    //     value: 1,
    //     details: { quizId, consecutiveFails },
    //     timestamp: new Date(),
    //   });
    // }

    await pt.save();

    res.status(200).json({
      success: true,
      message: "Quiz result saved successfully",
      data: { passed, score, attempts: attempt.attempts, failCount: attempt.failCount },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ success: false, message: "Failed to submit quiz" });
  }
};

module.exports = { submitQuiz };
