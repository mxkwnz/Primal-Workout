const express = require('express');
const router = express.Router();
const { getWorkouts, getPlansPublic, generateWorkout, getWorkoutById, updateWorkout, deleteWorkout, createWorkout } = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/plans', getPlansPublic);
router.route('/')
    .get(protect, getWorkouts)
    .post(protect, createWorkout);
router.post('/generate', protect, authorize('premium', 'moderator', 'admin'), generateWorkout);

router.route('/:id')
    .get(protect, getWorkoutById)
    .put(protect, authorize('premium', 'moderator', 'admin'), updateWorkout)
    .delete(protect, authorize('premium', 'moderator', 'admin'), deleteWorkout);

module.exports = router;
