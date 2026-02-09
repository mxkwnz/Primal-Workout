const express = require('express');
const router = express.Router();
const { createWorkoutLog, getWorkoutLogs, getWorkoutLogById } = require('../controllers/workoutLogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getWorkoutLogs)
    .post(protect, createWorkoutLog);

router.get('/:id', protect, getWorkoutLogById);

module.exports = router;
