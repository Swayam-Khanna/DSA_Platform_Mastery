const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        enum: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix', 'General'],
        required: true
    },
    problems: [{
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        status: { type: String, enum: ['pending', 'solved', 'failed'], default: 'pending' },
        code: String,
        timeTaken: Number
    }],
    totalTime: { type: Number, default: 2700 }, // 45 min in seconds
    timeUsed: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    passed: { type: Boolean },
    status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
