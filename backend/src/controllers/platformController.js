const User = require('../models/User');
const Problem = require('../models/Problem');

exports.getGlobalStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProblems = await Problem.countDocuments({ isActive: true });
        
        // Sum total solved across all users
        const solvedStats = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$totalSolved' } } }
        ]);
        
        const totalSubmissions = solvedStats.length > 0 ? solvedStats[0].total : 0;
        
        res.json({
            success: true,
            stats: {
                users: totalUsers,
                problems: totalProblems,
                submissions: totalSubmissions
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
