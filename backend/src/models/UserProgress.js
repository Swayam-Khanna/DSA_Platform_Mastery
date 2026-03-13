const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    status: {
        type: String,
        enum: ['attempted', 'solved', 'skipped'],
        default: 'attempted'
    },
    languageUsed: {
        type: String,
        enum: ['cpp', 'java', 'python', 'javascript'],
        required: true
    },
    code: { type: String },
    timeTaken: { type: Number }, // seconds
    attempts: { type: Number, default: 1 },
    solvedDate: { type: Date },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    executionTime: { type: Number }, // ms
    memoryUsed: { type: Number } // KB
}, { timestamps: true });

userProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
