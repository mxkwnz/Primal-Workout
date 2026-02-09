const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('selectedPlanId', 'name target difficulty');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile: user.profile,
            settings: user.settings || {},
            onboardingCompleted: user.onboardingCompleted,
            selectedPlanId: user.selectedPlanId,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Update profile stats if provided
        if (req.body.profile) {
            user.profile = { ...user.profile, ...req.body.profile };
        }
        if (req.body.settings) {
            user.settings = { ...(user.settings || {}), ...req.body.settings };
        }
        if (typeof req.body.onboardingCompleted === 'boolean') {
            user.onboardingCompleted = req.body.onboardingCompleted;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            profile: updatedUser.profile,
            settings: updatedUser.settings,
            onboardingCompleted: updatedUser.onboardingCompleted,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Upgrade user to premium
// @route   PUT /api/users/upgrade
// @access  Private
const upgradeUser = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.role = 'premium';
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            token: req.body.token, // Client usually has token, but we return user info updates
            message: 'User upgraded to premium'
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const selectPlan = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { planId } = req.body;
    if (!planId) return res.status(400).json({ message: 'planId required' });
    user.selectedPlanId = planId;
    await user.save();
    res.json({ _id: user._id, selectedPlanId: user.selectedPlanId, message: 'Plan selected' });
};

module.exports = { getUserProfile, updateUserProfile, upgradeUser, selectPlan };
