const { body, validationResult } = require('express-validator');

// Email: must be like user@domain.com / user@site.ru (reject qwerty@.com - domain must have at least one char before the dot)
const emailValid = () =>
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/)
        .withMessage('Email must be valid (e.g. example@domain.com or user@site.ru)');

const registerSchema = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 2 }).withMessage('Username must be at least 2 characters'),
    emailValid(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginSchema = [
    emailValid(),
    body('password').notEmpty().withMessage('Password is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const msg = errors.array().map(e => e.msg).join('. ');
    return res.status(400).json({ message: msg });
};

const updateProfileSchema = [
    body('username').optional().trim().isLength({ min: 2 }).withMessage('Username must be at least 2 characters'),
    body('email').optional().trim().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/).withMessage('Email must be valid (e.g. example@domain.com)'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const resetPasswordSchema = [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

module.exports = { registerSchema, loginSchema, updateProfileSchema, resetPasswordSchema, validate, emailValid };
