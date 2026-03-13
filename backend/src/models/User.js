const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    preferredLanguage: {
        type: String,
        enum: ['cpp', 'java', 'python', 'javascript'],
        default: 'python'
    },
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'unassessed'],
        default: 'unassessed'
    },
    coins: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    lastStreakDate: { type: Date },
    assessmentCompleted: { type: Boolean, default: false },
    assessmentScore: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    solvedProblems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak on login
userSchema.methods.updateStreak = function () {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!this.lastStreakDate) {
        this.streak = 1;
        this.lastStreakDate = today;
        this.coins += 10;
        return;
    }

    const lastDate = new Date(this.lastStreakDate);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        this.streak += 1;
        this.lastStreakDate = today;
        const coinsEarned = Math.min(this.streak * 10, 100);
        this.coins += coinsEarned;
        if (this.streak > this.longestStreak) {
            this.longestStreak = this.streak;
        }
    } else if (diffDays > 1) {
        this.streak = 1;
        this.lastStreakDate = today;
        this.coins += 10;
    }
    // diffDays === 0 means same day, no update needed
};

module.exports = mongoose.model('User', userSchema);
