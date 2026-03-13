const Problem = require('../models/Problem');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

// GET /api/problems
exports.getProblems = async (req, res) => {
    try {
        const { topic, difficulty, company, search, page = 1, limit = 20 } = req.query;
        const query = { isActive: true };
        if (topic) query.topic = topic;
        if (difficulty) query.difficulty = difficulty;
        if (company) query.companyTags = company;
        if (search) query.title = { $regex: search, $options: 'i' };

        const total = await Problem.countDocuments(query);
        const problems = await Problem.find(query)
            .select('title slug difficulty topic companyTags conceptTags solveCount acceptanceRate leetcodeLink gfgLink')
            .sort({ orderIndex: 1, createdAt: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Attach user progress if authenticated
        let progressMap = {};
        if (req.user) {
            const prog = await UserProgress.find({ userId: req.user.id }).select('problemId status');
            prog.forEach(p => { progressMap[p.problemId.toString()] = p.status; });
        }

        const problemsWithStatus = problems.map(p => ({
            ...p.toObject(),
            userStatus: progressMap[p._id.toString()] || 'unsolved'
        }));

        res.json({ success: true, problems: problemsWithStatus, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/problems/:idOrSlug
exports.getProblem = async (req, res) => {
    try {
        const { id } = req.params;
        let problem;
        
        // Check if ID is a valid Mongoose ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            problem = await Problem.findById(id);
        } else {
            // Otherwise, search by slug
            problem = await Problem.findOne({ slug: id });
        }
        
        if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

        let userProgress = null;
        if (req.user) {
            userProgress = await UserProgress.findOne({ userId: req.user.id, problemId: problem._id });
        }

        res.json({ success: true, problem, userProgress });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/problems (admin)
exports.createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json({ success: true, problem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/problems/:id (admin)
exports.updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
        res.json({ success: true, problem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/problems/:id (admin)
exports.deleteProblem = async (req, res) => {
    try {
        await Problem.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Problem deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/problems/:id/submit
exports.submitSolution = async (req, res) => {
    try {
        const { code, language, timeTaken, testCasesPassed, totalTestCases } = req.body;
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

        const solved = testCasesPassed === totalTestCases;

        const existing = await UserProgress.findOne({ userId: req.user.id, problemId: problem._id });
        if (existing) {
            existing.code = code;
            existing.languageUsed = language;
            existing.attempts += 1;
            existing.testCasesPassed = testCasesPassed;
            existing.totalTestCases = totalTestCases;
            if (solved && existing.status !== 'solved') {
                existing.status = 'solved';
                existing.solvedDate = new Date();
                existing.timeTaken = timeTaken;
                await User.findByIdAndUpdate(req.user.id, { $inc: { totalSolved: 1, coins: 20 } });
                await Problem.findByIdAndUpdate(problem._id, { $inc: { solveCount: 1 } });
            }
            await existing.save();
            return res.json({ success: true, solved, progress: existing });
        }

        const status = solved ? 'solved' : 'attempted';
        const progress = await UserProgress.create({
            userId: req.user.id, problemId: problem._id, status, code, languageUsed: language,
            timeTaken, testCasesPassed, totalTestCases, solvedDate: solved ? new Date() : undefined
        });

        if (solved) {
            await User.findByIdAndUpdate(req.user.id, { $inc: { totalSolved: 1, coins: 20 } });
            await Problem.findByIdAndUpdate(problem._id, { $inc: { solveCount: 1 } });
        }

        res.json({ success: true, solved, progress });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
