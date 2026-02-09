const Review = require('../models/Review');

const createReview = async (req, res) => {
    try {
        const { rating, review } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const doc = await Review.create({
            user: req.user._id,
            rating: Number(rating),
            review: review || ''
        });
        const populated = await Review.findById(doc._id).populate('user', 'username');
        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const listReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createReview, listReviews };
