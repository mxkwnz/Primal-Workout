const Workout = require('../models/Workout');
const User = require('../models/User');
const seedWorkoutPlans = require('../utils/seedWorkoutPlans');

// @desc    Get workout plans (filter by target & difficulty)
// @route   GET /api/workouts?target=...&difficulty=...
// @access  Private
const getWorkouts = async (req, res) => {
    try {
        await seedWorkoutPlans();
        const { target, difficulty, mine } = req.query;
        if (mine === 'true') {
            const myWorkouts = await Workout.find({ createdBy: req.user._id }).lean();
            return res.json(myWorkouts);
        }
        const filter = { $or: [{ accessLevel: 'free', createdBy: null }, { createdBy: req.user._id }] };
        if (target) filter.target = target;
        if (difficulty) filter.difficulty = difficulty;
        const workouts = await Workout.find(filter).lean();
        return res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get plans catalog (public, for workout plans page)
// @route   GET /api/workouts/plans?target=...&difficulty=...
const getPlansPublic = async (req, res) => {
    try {
        await seedWorkoutPlans();
        const { target, difficulty } = req.query;
        const filter = { accessLevel: 'free', createdBy: null };
        if (target) filter.target = target;
        if (difficulty) filter.difficulty = difficulty;
        const workouts = await Workout.find(filter).select('name description target difficulty exercises').lean();
        return res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate a workout plan (Premium only)
// @route   POST /api/workouts/generate
// @access  Private (Premium+)
const generateWorkout = async (req, res) => {
    const { age, height, weight, goalWeight, goal, gender } = req.body;

    // Logic to generate workout based on stats
    // This is a simplified logic placeholder
    let workoutName = `Custom ${goal} Plan`;
    let exercises = [];

    if (goal === 'loose_fat') {
        workoutName = 'Fat Loss Shred';
        exercises = [
            { name: 'Burpees', sets: 4, reps: '15', rest: 45 },
            { name: 'Jump Squats', sets: 4, reps: '20', rest: 45 },
            { name: 'Mountain Climbers', sets: 3, reps: '50', rest: 30 },
            { name: 'High Knees', sets: 3, reps: '45s', rest: 30 }
        ];
    } else if (goal === 'gain_muscle') {
        workoutName = 'Muscle Mass Builder';
        exercises = [
            { name: 'Bench Press', sets: 4, reps: '8-12', rest: 90 },
            { name: 'Squats', sets: 4, reps: '8-12', rest: 90 },
            { name: 'Deadlifts', sets: 3, reps: '6-8', rest: 120 },
            { name: 'Overhead Press', sets: 3, reps: '8-12', rest: 90 }
        ];
    } else {
        workoutName = 'General Fitness';
        exercises = [
            { name: 'Pushups', sets: 3, reps: '15', rest: 60 },
            { name: 'Lunges', sets: 3, reps: '12/leg', rest: 60 },
            { name: 'Plank', sets: 3, reps: '60s', rest: 60 }
        ];
    }

    const allowedTargets = ['loose_fat', 'gain_muscle', 'become_calisthenic', 'body_builders_plan', 'athletes_plan', 'power_lifters_plan'];
        const target = allowedTargets.includes(goal) ? goal : 'gain_muscle';
    const workout = await Workout.create({
        name: workoutName,
        description: `Generated plan for ${goal} based on your stats.`,
        exercises,
        target,
        difficulty: 'intermediate',
        accessLevel: 'premium',
        createdBy: req.user._id
    });

    res.status(201).json(workout);
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (workout) {
        // Check access
        if (workout.accessLevel === 'premium' && req.user.role === 'user') {
            return res.status(403).json({ message: 'Upgrade to Premium to access this workout' });
        }
        res.json(workout);
    } else {
        res.status(404).json({ message: 'Workout not found' });
    }
};

const updateWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    const isOwner = workout.createdBy && workout.createdBy.toString() === req.user._id.toString();
    const canManage = ['moderator', 'admin'].includes(req.user.role);
    if (!(isOwner || canManage)) return res.status(403).json({ message: 'Not authorized to update workout' });
    const allowed = ['name', 'description', 'exercises', 'target', 'difficulty'];
    Object.keys(req.body).forEach(k => {
        if (allowed.includes(k)) workout[k] = req.body[k];
    });
    await workout.save();
    res.json(workout);
};

const deleteWorkout = async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    const isOwner = workout.createdBy && workout.createdBy.toString() === req.user._id.toString();
    const canManage = ['moderator', 'admin'].includes(req.user.role);
    if (!(isOwner || canManage)) return res.status(403).json({ message: 'Not authorized to delete workout' });
    await workout.deleteOne();
    res.json({ message: 'Workout deleted' });
};

const createWorkout = async (req, res) => {
    const { planId, name, description, exercises, target, difficulty } = req.body;
    if (planId) {
        const template = await Workout.findById(planId);
        if (!template) return res.status(404).json({ message: 'Plan not found' });
        if (template.accessLevel === 'premium' && !['premium', 'moderator', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Upgrade to Premium to copy this plan' });
        }
        const workout = await Workout.create({
            name: template.name + ' (My copy)',
            description: template.description,
            exercises: template.exercises,
            target: template.target,
            difficulty: template.difficulty,
            accessLevel: 'free',
            createdBy: req.user._id
        });
        return res.status(201).json(workout);
    }
    if (!name || !target || !exercises || !Array.isArray(exercises)) {
        return res.status(400).json({ message: 'name, target, and exercises array required' });
    }
    const workout = await Workout.create({
        name,
        description: description || '',
        exercises: exercises.map(e => ({ name: e.name, sets: e.sets || 3, reps: e.reps || '10', rest: e.rest || 60, notes: e.notes })),
        target,
        difficulty: difficulty || 'beginner',
        accessLevel: 'free',
        createdBy: req.user._id
    });
    res.status(201).json(workout);
};

module.exports = { getWorkouts, getPlansPublic, generateWorkout, getWorkoutById, updateWorkout, deleteWorkout, createWorkout };
