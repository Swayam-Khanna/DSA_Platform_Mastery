const Problem = require('../models/Problem');
const MockInterview = require('../models/MockInterview');

// POST /api/mock/start
exports.startMockInterview = async (req, res) => {
    try {
        const { company = 'General' } = req.body;
        const query = { isActive: true };
        if (company !== 'General') query.companyTags = company;

        const easyProblems = await Problem.find({ ...query, difficulty: 'easy' }).select('_id title topic difficulty');
        const mediumProblems = await Problem.find({ ...query, difficulty: 'medium' }).select('_id title topic difficulty');
        const hardProblems = await Problem.find({ ...query, difficulty: 'hard' }).select('_id title topic difficulty');

        const getRandom = (arr, n) => arr.sort(() => Math.random() - 0.5).slice(0, n);

        let selectedProblems = [];
        if (easyProblems.length >= 1) selectedProblems.push(...getRandom(easyProblems, 1));
        if (mediumProblems.length >= 1) selectedProblems.push(...getRandom(mediumProblems, 1));
        if (hardProblems.length >= 1) selectedProblems.push(...getRandom(hardProblems, 1));

        // Fill remaining slots if not enough variety
        while (selectedProblems.length < 3) {
            const allProblems = [...easyProblems, ...mediumProblems, ...hardProblems];
            const remaining = allProblems.filter(p => !selectedProblems.find(s => s._id.toString() === p._id.toString()));
            if (remaining.length === 0) break;
            selectedProblems.push(getRandom(remaining, 1)[0]);
        }

        const mock = await MockInterview.create({
            userId: req.user.id,
            company,
            problems: selectedProblems.map(p => ({ problemId: p._id })),
            startedAt: new Date()
        });

        await mock.populate('problems.problemId', 'title topic difficulty slug');
        res.status(201).json({ success: true, mockInterview: mock });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/mock/:id/submit
exports.submitMockInterview = async (req, res) => {
    try {
        const { problemResults, timeUsed } = req.body;
        const mock = await MockInterview.findById(req.params.id);
        if (!mock) return res.status(404).json({ success: false, message: 'Mock interview not found' });
        if (mock.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

        let solved = 0;
        mock.problems.forEach((p, i) => {
            const result = problemResults?.find(r => r.problemId === p.problemId.toString());
            if (result) {
                p.status = result.solved ? 'solved' : 'failed';
                p.code = result.code;
                p.timeTaken = result.timeTaken;
                if (result.solved) solved++;
            }
        });

        mock.timeUsed = timeUsed;
        mock.score = Math.round((solved / mock.problems.length) * 100);
        mock.passed = solved >= 2;
        mock.status = 'completed';
        mock.completedAt = new Date();
        await mock.save();

        if (mock.passed) {
            const User = require('../models/User');
            await User.findByIdAndUpdate(req.user.id, { $inc: { coins: 100 } });
        }

        res.json({ success: true, mockInterview: mock, coinsEarned: mock.passed ? 100 : 0 });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/mock/history
exports.getMockHistory = async (req, res) => {
    try {
        const history = await MockInterview.find({ userId: req.user.id })
            .populate('problems.problemId', 'title difficulty topic')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json({ success: true, history });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
