const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @route POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, preferredLanguage } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, preferredLanguage: preferredLanguage || 'python' });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
                skillLevel: user.skillLevel,
                coins: user.coins,
                streak: user.streak,
                totalSolved: user.totalSolved,
                assessmentCompleted: user.assessmentCompleted
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Update streak
        user.updateStreak();
        user.lastLoginDate = new Date();
        await user.save();

        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                preferredLanguage: user.preferredLanguage,
                skillLevel: user.skillLevel,
                coins: user.coins,
                streak: user.streak,
                totalSolved: user.totalSolved,
                assessmentCompleted: user.assessmentCompleted,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user with that email' });
        }
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save();
        res.json({ success: true, message: 'Reset token generated', resetToken });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @route PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
    try {
        const crypto = require('crypto');
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        const token = generateToken(user._id);
        res.json({ success: true, token, message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
