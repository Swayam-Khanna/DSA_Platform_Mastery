const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

// GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const { type = 'coins', limit = 50 } = req.query;
        const sortField = type === 'solved' ? 'totalSolved' : 'coins';

        const users = await User.find()
            .select('name email coins totalSolved streak avatar skillLevel')
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            userId: user._id,
            name: user.name,
            avatar: user.avatar,
            coins: user.coins,
            totalSolved: user.totalSolved,
            streak: user.streak,
            skillLevel: user.skillLevel,
            isCurrentUser: req.user ? user._id.toString() === req.user.id : false
        }));

        // Find current user's rank if not in top list
        let userRank = null;
        if (req.user) {
            const currentUserRank = await User.countDocuments({ [sortField]: { $gt: req.user[sortField] || 0 } });
            const inTopList = leaderboard.find(u => u.isCurrentUser);
            if (!inTopList) {
                const currentUser = await User.findById(req.user.id).select('name coins totalSolved streak avatar skillLevel');
                userRank = { rank: currentUserRank + 1, ...currentUser.toObject(), isCurrentUser: true };
            }
        }

        res.json({ success: true, leaderboard, userRank });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
