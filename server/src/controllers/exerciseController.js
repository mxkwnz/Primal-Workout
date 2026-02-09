const Exercise = require('../models/Exercise');
const seedExercises = require('../utils/seedExercises');

const getExercises = async (req, res) => {
    try {
        await seedExercises();
        const { muscleGroup, equipment, difficulty, type, q } = req.query;
        const filter = {};
        if (muscleGroup) filter.muscleGroups = muscleGroup;
        if (equipment) filter.equipment = equipment;
        if (difficulty) filter.difficulty = difficulty;
        if (type) filter.type = type;
        if (q) filter.name = new RegExp(q, 'i');
        const exercises = await Exercise.find(filter).lean();
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getExerciseById = async (req, res) => {
    const ex = await Exercise.findById(req.params.id).lean();
    if (!ex) return res.status(404).json({ message: 'Exercise not found' });
    res.json(ex);
};

module.exports = { getExercises, getExerciseById };
