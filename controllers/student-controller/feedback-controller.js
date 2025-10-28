const Feedback = require("../../models/Feedback");
const PersonalityTraitsTracking = require("../../models/PersonalityTraitsTracking");

// پوزیٹو کیورڈز کی لسٹ
const positiveKeywords = [
  "good", "great", "excellent", "amazing", "wonderful", "fantastic", "helpful",
  "useful", "informative", "clear", "easy", "best", "love", "enjoy", "like",
  "recommend", "satisfied", "impressive", "outstanding", "perfect"
];

// نیگیٹو کیورڈز کی لسٹ
const negativeKeywords = [
  "bad", "poor", "terrible", "awful", "horrible", "confusing", "difficult",
  "hard", "boring", "waste", "useless", "unclear", "disappointed", "frustrating",
  "hate", "dislike", "worst", "not helpful", "misleading", "incomplete"
];

// فیڈبیک کا سینٹیمنٹ چیک کرنا
const analyzeSentiment = (content) => {
  const text = content.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) positiveCount++;
  });

  negativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) negativeCount++;
  });

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
};

// فیڈبیک سبمٹ کرنا
const submitFeedback = async (req, res) => {
  try {
    const {
      //  courseId,
       userId, content } = req.body;

    // سینٹیمنٹ انالیسس
    const sentiment = analyzeSentiment(content);

    // فیڈبیک بنانا
    const feedback = new Feedback({
      // courseId,
      userId,
      content,
      sentiment,
    });

    await feedback.save();

    // پرسنالٹی ٹریٹس اپڈیٹ کرنا
    let personalityTraits = await PersonalityTraitsTracking.findOne({ userId });

    if (!personalityTraits) {
      personalityTraits = new PersonalityTraitsTracking({ userId });
    }

    // extraversion کاؤنٹ بڑھانا
    personalityTraits.extraversion += 1;
    personalityTraits.activityLog.push({
      action: "submit_feedback",
      factor: "extraversion",
      value: 1,
      details: { 
        // courseId, 
        feedbackId: feedback._id },
      timestamp: new Date(),
    });

    // اگر فیڈبیک پوزیٹو ہے تو agreeableness کاؤنٹ بڑھانا
    if (sentiment === "positive") {
      personalityTraits.agreeableness += 1;
      personalityTraits.activityLog.push({
        action: "positive_feedback",
        factor: "agreeableness",
        value: 1,
        details: { 
          // courseId, 
          feedbackId: feedback._id },
        timestamp: new Date(),
      });
    }

    await personalityTraits.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

// کورس کے فیڈبیکس حاصل کرنا
const getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("userId", "userName userEmail");

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error fetching User feedbacks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch User feedbacks",
    });
  }
};

module.exports = {
  submitFeedback,
  getUserFeedbacks,
};