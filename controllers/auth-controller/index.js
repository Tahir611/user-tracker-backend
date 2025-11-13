const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    const {
        userName,
        userEmail,
        password,
        role,
        university,
        degree,
        semester,
    } = req.body;
    const existingUser = await User.findOne({
        $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User name or user email already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        userName,
        userEmail,
        role,
        password: hashPassword,
        university,
        degree,
        semester,
    });

    await newUser.save();

    return res.status(201).json({
        success: true,
        message: "User registered successfully!",
    });
};

const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    const accessToken = jwt.sign(
        {
            _id: checkUser._id,
            userName: checkUser.userName,
            userEmail: checkUser.userEmail,
            role: checkUser.role,
            university: checkUser.university,
            degree: checkUser.degree,
            semester: checkUser.semester,
        },
        "JWT_SECRET",
        { expiresIn: "120m" }
    );

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                userName: checkUser.userName,
                userEmail: checkUser.userEmail,
                role: checkUser.role,
                university: checkUser.university,
                degree: checkUser.degree,
                semester: checkUser.semester,
            },
        },
    });
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select(
            "userName userEmail role university degree semester"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
