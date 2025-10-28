const CultureBehaviourTracking = require("../../models/CultureBehaviourTracking");

// کلچر بیہیویر ٹریکنگ ڈیٹا حاصل کرنا
const getUserCultureBehaviour = async (req, res) => {
  try {
    const { userId } = req.params;

    let cultureBehaviour = await CultureBehaviourTracking.findOne({ userId });

    // اگر ٹریکنگ موجود نہیں ہے تو نئی بنائیں
    if (!cultureBehaviour) {
      cultureBehaviour = new CultureBehaviourTracking({ userId });
      await cultureBehaviour.save();
    }

    res.status(200).json({
      success: true,
      data: cultureBehaviour,
    });
  } catch (error) {
    console.error("Error fetching culture behaviour:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch culture behaviour data",
    });
  }
};

// کلچر بیہیویر فیکٹر اپڈیٹ کرنا
const updateCultureBehaviourFactor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { factor, value, action, details } = req.body;

    let cultureBehaviour = await CultureBehaviourTracking.findOne({ userId });

    if (!cultureBehaviour) {
      cultureBehaviour = new CultureBehaviourTracking({ userId });
    }

    // مخصوص فیکٹر اپڈیٹ کرنا
    if (cultureBehaviour[factor] !== undefined) {
      cultureBehaviour[factor] = value;

      // اکٹیویٹی لاگ میں شامل کرنا
      cultureBehaviour.activityLog.push({
        action,
        factor,
        value,
        details: details || {},
        timestamp: new Date(),
      });

      await cultureBehaviour.save();

      res.status(200).json({
        success: true,
        message: "Culture behaviour factor updated successfully",
        data: cultureBehaviour,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid culture behaviour factor",
      });
    }
  } catch (error) {
    console.error("Error updating culture behaviour factor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update culture behaviour factor",
    });
  }
};

module.exports = {
  getUserCultureBehaviour,
  updateCultureBehaviourFactor,
};