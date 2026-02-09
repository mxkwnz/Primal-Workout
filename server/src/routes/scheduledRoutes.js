const express = require('express');
const router = express.Router();
const { getScheduled, getScheduledById, createScheduled, updateScheduled, deleteScheduled } = require('../controllers/scheduledController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getScheduled)
    .post(protect, createScheduled);

router.get('/:id', protect, getScheduledById);
router.route('/:id')
    .put(protect, updateScheduled)
    .delete(protect, deleteScheduled);

module.exports = router;
