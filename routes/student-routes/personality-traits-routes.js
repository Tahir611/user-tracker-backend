const express = require("express");
const {
  getUserPersonalityTraits,
  updatePersonalityTraitFactor,
  updateOpennessOnActions,
} = require("../../controllers/student-controller/personality-traits-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

// یوزر کا پرسنالٹی ٹریٹس ٹریکنگ ڈیٹا حاصل کرنا
router.get("/:userId", authenticate, getUserPersonalityTraits);

// مخصوص پرسنالٹی ٹریٹ فیکٹر اپڈیٹ کرنا
router.put("/:userId/factor", authenticate, updatePersonalityTraitFactor);

router.put("/:userId/openness-actions", authenticate, updateOpennessOnActions);

module.exports = router;
