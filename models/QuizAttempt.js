const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: String, default: null },
  attempts: { type: Number, default: 0 },
  lastResult: { type: String, enum: ["pass", "fail", "none"], default: "none" },
  lastScore: { type: Number, default: 0 },
  lastAttemptAt: { type: Date, default: Date.now },
  failCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);