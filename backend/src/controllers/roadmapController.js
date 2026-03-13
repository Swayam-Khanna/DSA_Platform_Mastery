const Roadmap = require('../models/Roadmap');
const UserProgress = require('../models/UserProgress');

// GET /api/roadmap
exports.getRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ userId: req.user.id }).populate('weeks.problems', 'title difficulty slug topic');
        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'No roadmap found. Please complete the assessment first.' });
        }

        // Calculate completion for each week
        const progress = await UserProgress.find({ userId: req.user.id, status: 'solved' }).select('problemId');
        const solvedIds = new Set(progress.map(p => p.problemId.toString()));

        const weeksWithProgress = roadmap.weeks.map(week => {
            const total = week.problems.length;
            const solved = week.problems.filter(p => solvedIds.has(p._id.toString())).length;
            const completionPercentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            return { ...week.toObject(), completionPercentage, solved, total };
        });

        const overallProgress = weeksWithProgress.reduce((sum, w) => sum + w.completionPercentage, 0) / weeksWithProgress.length;

        res.json({ success: true, roadmap: { ...roadmap.toObject(), weeks: weeksWithProgress, overallProgress: Math.round(overallProgress) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = exports;
