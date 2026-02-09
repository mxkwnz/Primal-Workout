const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { registerSchema, loginSchema, resetPasswordSchema, validate, emailValid } = require('../validators/authSchemas');

router.post('/register', registerSchema, validate, registerUser);
router.post('/login', loginSchema, validate, loginUser);
router.post('/forgot-password', [emailValid()], validate, forgotPassword);
router.post('/reset-password', resetPasswordSchema, validate, resetPassword);

module.exports = router;
