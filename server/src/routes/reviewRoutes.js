const express = require('express');
const router = express.Router();
const { createReview, listReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/', protect, authorize('admin', 'moderator'), listReviews);

module.exports = router;
