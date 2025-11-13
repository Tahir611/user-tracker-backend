const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    password: String,
    role: String,
    university: { type: String, default: null },
    degree: { type: String, default: null },
    semester: { type: String, default: null },
});

module.exports = mongoose.model("User", UserSchema);
