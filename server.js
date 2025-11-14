require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const designTrackingRoutes = require("./routes/student-routes/design-tracking-routes");
const personalityTraitsRoutes = require("./routes/student-routes/personality-traits-routes");
const cultureBehaviourRoutes = require("./routes/student-routes/culture-behaviour-routes");
const feedbackRoutes = require("./routes/student-routes/feedback-routes");
const quizRoutes = require("./routes/student-routes/quiz-routes");
const cultureRoutes = require("./routes/student-routes/culture-routes");

const app = express();
const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;
const MONGO_REMOTE_URI = process.env.MONGO_REMOTE_URI;
const allowedOrigins = [
    "https://user-tracking.site",
    "http://localhost:5173",
    "http://localhost:3000",
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS not allowed"));
            }
        },
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

//database connection
mongoose
    // .connect(MONGO_URI)
    .connect(MONGO_REMOTE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("mongodb is connected"))
    .catch((e) => console.log(e));

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/design-tracking", designTrackingRoutes);
app.use("/student/personality-traits", personalityTraitsRoutes);
app.use("/student/culture-behaviour", cultureBehaviourRoutes);
app.use("/student/feedback", feedbackRoutes);
app.use("/student/quiz", quizRoutes);
app.use("/student/culture", cultureRoutes);
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
