const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// GET /api/users/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const stats = await UserProgress.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        res.json({ success: true, user, stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, preferredLanguage, bio, github, linkedin, avatar } = req.body;
        
        if (name && name.length > 50) {
            return res.status(400).json({ success: false, message: 'Name cannot exceed 50 characters' });
        }
        
        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Name cannot be empty' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, preferredLanguage, bio, github, linkedin, avatar },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/users/stats
exports.getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const progress = await UserProgress.find({ userId: req.user.id }).populate('problemId', 'topic difficulty title');

        const topicStats = {};
        progress.forEach(p => {
            if (p.problemId && p.status === 'solved') {
                const topic = p.problemId.topic;
                topicStats[topic] = (topicStats[topic] || 0) + 1;
            }
        });

        // Last 7 days activity
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const weeklyActivity = await UserProgress.aggregate([
            { $match: { userId: req.user._id, solvedDate: { $gte: sevenDaysAgo }, status: 'solved' } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$solvedDate' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            stats: {
                totalSolved: user.totalSolved,
                coins: user.coins,
                streak: user.streak,
                longestStreak: user.longestStreak,
                topicStats,
                weeklyActivity
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
