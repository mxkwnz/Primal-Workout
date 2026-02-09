const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: 'user', // Default role
            profile: {} // Empty profile initially
        });

        if (user) {
            sendWelcomeEmail(user.email, user.username).catch(() => {});
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(200).json({ message: 'If that email exists, we sent a reset link.' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });
    const baseUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:5500';
    await sendPasswordResetEmail(user.email, token, baseUrl);
    res.status(200).json({ message: 'If that email exists, we sent a reset link.' });
};

const resetPassword = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Password updated', token: generateToken(user._id) });
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
