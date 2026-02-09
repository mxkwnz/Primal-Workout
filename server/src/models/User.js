const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'premium', 'admin'],
        default: 'user',
    },
    profile: {
        age: { type: Number },
        height: { type: Number },
        weight: { type: Number },
        goalWeight: { type: Number },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        goal: {
            type: String,
            enum: ['loose_fat', 'gain_muscle', 'maintain', 'endurance', 'strength'],
            default: 'maintain'
        },
        activityLevel: {
            type: String,
            enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
            default: 'moderate'
        },
        equipment: [{ type: String }],
        restrictions: { type: String }
    },
    settings: {
        units: { type: String, enum: ['kg', 'lb'], default: 'kg' },
        language: { type: String, default: 'en' },
        notifications: { type: Boolean, default: true }
    },
    onboardingCompleted: { type: Boolean, default: false },
    selectedPlanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
