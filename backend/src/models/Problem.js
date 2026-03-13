const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    explanation: { type: String }
});

const starterCodeSchema = new mongoose.Schema({
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    javascript: { type: String, default: '' }
});

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    topic: {
        type: String,
        enum: ['arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'dynamic-programming', 'greedy', 'backtracking', 'hashing', 'sliding-window', 'recursion', 'binary-search', 'sorting'],
        required: true
    },
    companyTags: [{
        type: String,
        enum: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix', 'Apple', 'Uber', 'LinkedIn', 'Twitter', 'Adobe']
    }],
    conceptTags: [{ type: String }],
    starterCode: starterCodeSchema,
    testCases: [testCaseSchema],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    constraints: [{ type: String }],
    hints: [{ type: String }],
    solution: {
        approach: String,
        timeComplexity: String,
        spaceComplexity: String,
        code: String
    },
    leetcodeLink: { type: String, default: '' },
    gfgLink: { type: String, default: '' },
    isPremium: { type: Boolean, default: false },
    solveCount: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-generate slug from title
problemSchema.pre('save', function () {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
    }
});

module.exports = mongoose.model('Problem', problemSchema);
