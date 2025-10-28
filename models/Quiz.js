const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: Number, // صحیح آپشن کا انڈیکس
      points: {
        type: Number,
        default: 1,
      },
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
  passingScore: {
    type: Number,
    default: 60, // پاسنگ اسکور کا پرسنٹیج
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);