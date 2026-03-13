const router = require('express').Router();
const { protect, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');

// GET /api/admin/stats
router.get('/stats', protect, requireAdmin, async (req, res) => {
    try {
        const [totalUsers, totalProblems, totalSubmissions, difficultyBreakdown, topicBreakdown] = await Promise.all([
            User.countDocuments(),
            Problem.countDocuments({ isActive: true }),
            UserProgress.countDocuments(),
            Problem.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]),
            Problem.aggregate([{ $group: { _id: '$topic', count: { $sum: 1 } } }]),
        ]);
        res.json({ success: true, stats: { totalUsers, totalProblems, totalSubmissions, difficultyBreakdown, topicBreakdown } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/admin/users
router.get('/users', protect, requireAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
        const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await User.countDocuments(query);
        res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT /api/admin/users/:id
router.put('/users/:id', protect, requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, requireAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
