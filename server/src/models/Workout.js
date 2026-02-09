const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }, // String to allow "10-12" or "Failure"
    rest: { type: Number, default: 60 }, // in seconds
    notes: { type: String }
});

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    exercises: [exerciseSchema],
    target: {
        type: String,
        enum: ['loose_fat', 'gain_muscle', 'become_calisthenic', 'body_builders_plan', 'athletes_plan', 'power_lifters_plan'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'hard', 'olympic_champion'],
        default: 'beginner'
    },
    accessLevel: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null implies system-created/public plan
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;
