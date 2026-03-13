const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    weeks: [{
        weekNumber: Number,
        topic: String,
        displayName: String,
        description: String,
        problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
        completionPercentage: { type: Number, default: 0 },
        isUnlocked: { type: Boolean, default: false }
    }],
    currentWeek: { type: Number, default: 1 },
    overallProgress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
