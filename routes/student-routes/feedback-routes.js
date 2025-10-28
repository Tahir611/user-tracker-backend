const express = require("express");
const {
  submitFeedback,
  getUserFeedbacks,
} = require("../../controllers/student-controller/feedback-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

// فیڈبیک سبمٹ کرنا
router.post("/", authenticate, submitFeedback);

// کورس کے فیڈبیکس حاصل کرنا
router.get("/", authenticate, getUserFeedbacks);

module.exports = router;