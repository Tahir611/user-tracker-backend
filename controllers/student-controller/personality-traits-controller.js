const PersonalityTraitsTracking = require("../../models/PersonalityTraitsTracking");

// پرسنالٹی ٹریٹس ٹریکنگ ڈیٹا حاصل کرنا
const getUserPersonalityTraits = async (req, res) => {
  try {
    const { userId } = req.params;

    let personalityTraits = await PersonalityTraitsTracking.findOne({ userId });

    // اگر ٹریکنگ موجود نہیں ہے تو نئی بنائیں
    if (!personalityTraits) {
      personalityTraits = new PersonalityTraitsTracking({ userId });
      await personalityTraits.save();
    }

    res.status(200).json({
      success: true,
      data: personalityTraits,
    });
  } catch (error) {
    console.error("Error fetching personality traits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch personality traits data",
    });
  }
};

// پرسنالٹی ٹریٹ فیکٹر اپڈیٹ کرنا
const updatePersonalityTraitFactor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { factor, value, action, details } = req.body;

    let personalityTraits = await PersonalityTraitsTracking.findOne({ userId });

    if (!personalityTraits) {
      personalityTraits = new PersonalityTraitsTracking({ userId });
    }

    // مخصوص فیکٹر اپڈیٹ کرنا
    if (personalityTraits[factor] !== undefined) {
      personalityTraits[factor] += value;

      // اکٹیویٹی لاگ میں شامل کرنا
      personalityTraits.activityLog.push({
        action,
        factor,
        value,
        details: details || {},
        timestamp: new Date(),
      });

      await personalityTraits.save();

      res.status(200).json({
        success: true,
        message: "Personality trait factor updated successfully",
        data: personalityTraits,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid personality trait factor",
      });
    }
  } catch (error) {
    console.error("Error updating personality trait factor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update personality trait factor",
    });
  }
};

const updateOpennessOnActions = async (req, res) => {
  console.log("req check", req)
  try {
    const { userId } = req.params;
    const { videoPlayed, buyClicked } = req.body;

    // Dono actions hone chahiye
    if (!videoPlayed || !buyClicked) {
      return res.status(200).json({
        success: true,
        message: "Both actions not completed yet",
      });
    }

    let personalityTraits = await PersonalityTraitsTracking.findOne({ userId });
    if (!personalityTraits) {
      personalityTraits = new PersonalityTraitsTracking({ userId });
    }

    // Openness increment
    personalityTraits.openness += 1;
    personalityTraits.activityLog.push({
      action: "video_and_buy",
      factor: "openness",
      value: 1,
      details: { videoPlayed, buyClicked },
      timestamp: new Date(),
    });

    await personalityTraits.save();

    res.status(200).json({
      success: true,
      message: "Openness updated successfully (video + buy actions)",
      data: personalityTraits,
    });
  } catch (error) {
    console.error("Error updating openness:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update openness factor",
    });
  }
};

module.exports = {
  getUserPersonalityTraits,
  updatePersonalityTraitFactor,
  updateOpennessOnActions
};
