const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    muscleGroups: [{ type: String }],
    equipment: [{ type: String }],
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'hard'], default: 'beginner' },
    type: { type: String, enum: ['strength', 'cardio', 'mobility', 'stretch'], default: 'strength' },
    instructions: { type: String },
    tips: { type: String },
    videoUrl: { type: String },
    imageUrl: { type: String },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
