const WorkoutLog = require('../models/WorkoutLog');
const ScheduledWorkout = require('../models/ScheduledWorkout');

const createWorkoutLog = async (req, res) => {
    const { scheduledWorkoutId, durationMinutes, rpe, mood, exerciseLogs } = req.body;
    if (!exerciseLogs || !Array.isArray(exerciseLogs)) return res.status(400).json({ message: 'exerciseLogs array required' });
    const log = await WorkoutLog.create({
        userId: req.user._id,
        scheduledWorkoutId: scheduledWorkoutId || null,
        durationMinutes: durationMinutes || null,
        rpe: rpe || null,
        mood: mood || null,
        exerciseLogs: exerciseLogs.map(el => ({
            exerciseId: el.exerciseId,
            exerciseName: el.exerciseName,
            sets: el.sets || [],
            notes: el.notes
        }))
    });
    if (scheduledWorkoutId) {
        await ScheduledWorkout.findOneAndUpdate(
            { _id: scheduledWorkoutId, userId: req.user._id },
            { status: 'completed' }
        );
    }
    res.status(201).json(log);
};

const getWorkoutLogs = async (req, res) => {
    const { from, to, limit } = req.query;
    const filter = { userId: req.user._id };
    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
    }
    const limitNum = Math.min(parseInt(limit, 10) || 50, 100);
    const logs = await WorkoutLog.find(filter).sort({ createdAt: -1 }).limit(limitNum).lean();
    res.json(logs);
};

const getWorkoutLogById = async (req, res) => {
    const log = await WorkoutLog.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!log) return res.status(404).json({ message: 'Workout log not found' });
    res.json(log);
};

module.exports = { createWorkoutLog, getWorkoutLogs, getWorkoutLogById };
