const mongoose = require('mongoose');

const scheduledWorkoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    workoutTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    status: { type: String, enum: ['planned', 'completed', 'skipped'], default: 'planned' },
    createdAt: { type: Date, default: Date.now }
});

scheduledWorkoutSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ScheduledWorkout', scheduledWorkoutSchema);
