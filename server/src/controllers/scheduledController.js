const ScheduledWorkout = require('../models/ScheduledWorkout');
const Workout = require('../models/Workout');

const getScheduled = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        const filter = { userId: req.user._id };
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }
        const list = await ScheduledWorkout.find(filter).populate('workoutTemplateId', 'name exercises target difficulty').sort({ date: 1 }).lean();
        res.json(list);
    } catch (err) { next(err); }
};

const createScheduled = async (req, res, next) => {
    try {
        const { date, workoutTemplateId } = req.body;
        if (!date || !workoutTemplateId) return res.status(400).json({ message: 'date and workoutTemplateId required' });
        const workout = await Workout.findById(workoutTemplateId);
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        const existing = await ScheduledWorkout.findOne({ userId: req.user._id, date: new Date(date) });
        if (existing) return res.status(400).json({ message: 'Already have a workout on this date' });
        const scheduled = await ScheduledWorkout.create({
            userId: req.user._id,
            date: new Date(date),
            workoutTemplateId
        });
        const populated = await ScheduledWorkout.findById(scheduled._id).populate('workoutTemplateId', 'name exercises target difficulty');
        res.status(201).json(populated);
    } catch (err) { next(err); }
};

const updateScheduled = async (req, res, next) => {
    try {
        const scheduled = await ScheduledWorkout.findOne({ _id: req.params.id, userId: req.user._id });
        if (!scheduled) return res.status(404).json({ message: 'Scheduled workout not found' });
        if (req.body.date) scheduled.date = new Date(req.body.date);
        if (req.body.status) scheduled.status = req.body.status;
        await scheduled.save();
        const populated = await ScheduledWorkout.findById(scheduled._id).populate('workoutTemplateId', 'name exercises target difficulty');
        res.json(populated);
    } catch (err) { next(err); }
};

const getScheduledById = async (req, res, next) => {
    try {
        const scheduled = await ScheduledWorkout.findOne({ _id: req.params.id, userId: req.user._id })
            .populate('workoutTemplateId');
        if (!scheduled) return res.status(404).json({ message: 'Scheduled workout not found' });
        res.json(scheduled);
    } catch (err) { next(err); }
};

const deleteScheduled = async (req, res, next) => {
    try {
        const deleted = await ScheduledWorkout.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ message: 'Scheduled workout not found' });
        res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
};

module.exports = { getScheduled, getScheduledById, createScheduled, updateScheduled, deleteScheduled };
