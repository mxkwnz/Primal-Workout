const mongoose = require('mongoose');

const setLogSchema = new mongoose.Schema({
    weight: { type: Number },
    reps: { type: Number },
    time: { type: Number },
    rpe: { type: Number },
    completed: { type: Boolean, default: true }
});

const exerciseLogSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    exerciseName: { type: String, required: true },
    sets: [setLogSchema],
    notes: { type: String }
});

const workoutLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledWorkoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledWorkout' },
    durationMinutes: { type: Number },
    rpe: { type: Number },
    mood: { type: String },
    sleepQuality: { type: String },
    exerciseLogs: [exerciseLogSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
