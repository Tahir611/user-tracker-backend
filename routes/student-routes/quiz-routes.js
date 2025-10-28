const express = require("express");
const {
  submitQuiz,
} = require("../../controllers/student-controller/quiz-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/submit", authenticate, submitQuiz);

module.exports = router;
