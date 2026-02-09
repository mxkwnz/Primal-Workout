const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, upgradeUser, selectPlan } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { updateProfileSchema, validate } = require('../validators/authSchemas');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateProfileSchema, validate, updateUserProfile);

router.put('/upgrade', protect, upgradeUser);
router.put('/select-plan', protect, selectPlan);

module.exports = router;
