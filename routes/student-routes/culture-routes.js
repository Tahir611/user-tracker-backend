const express = require("express");
const authenticate = require("../../middleware/auth-middleware");
const {
  startQuizCulture,
  submitQuizCulture,
  trackActionCulture,
} = require("../../controllers/student-controller/culture-controller");

const router = express.Router();

router.post("/start-quiz", authenticate, startQuizCulture);
router.post("/submit-quiz", authenticate, submitQuizCulture);
router.post("/action", authenticate, trackActionCulture);

module.exports = router;
