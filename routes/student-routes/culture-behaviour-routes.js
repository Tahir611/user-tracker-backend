const express = require("express");
const {
  getUserCultureBehaviour,
  updateCultureBehaviourFactor,
} = require("../../controllers/student-controller/culture-behaviour-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

// یوزر کا کلچر بیہیویر ٹریکنگ ڈیٹا حاصل کرنا
router.get("/:userId", authenticate, getUserCultureBehaviour);

// مخصوص کلچر بیہیویر فیکٹر اپڈیٹ کرنا
router.put("/:userId/factor", authenticate, updateCultureBehaviourFactor);

module.exports = router;