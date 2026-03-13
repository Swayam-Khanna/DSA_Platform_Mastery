const { questions, getSkillLevel } = require('../data/assessmentQuestions');
const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const Problem = require('../models/Problem');

const roadmapTemplates = {
    beginner: [
        { weekNumber: 1, topic: 'arrays', displayName: 'Arrays Fundamentals', description: 'Master array operations, traversal, and basic algorithms' },
        { weekNumber: 2, topic: 'strings', displayName: 'Strings', description: 'String manipulation, palindromes, anagrams' },
        { weekNumber: 3, topic: 'hashing', displayName: 'Hashing & Maps', description: 'HashMap, HashSet, frequency counting' },
        { weekNumber: 4, topic: 'linked-lists', displayName: 'Linked Lists', description: 'Singly, doubly linked lists, reversal, detection' },
        { weekNumber: 5, topic: 'stacks', displayName: 'Stacks & Queues', description: 'Stack operations, monotonic stack, queue BFS' },
        { weekNumber: 6, topic: 'recursion', displayName: 'Recursion & Backtracking', description: 'Recursive thinking, backtracking fundamentals' },
        { weekNumber: 7, topic: 'trees', displayName: 'Binary Trees', description: 'Tree traversals, BST, depth-first and breadth-first' },
        { weekNumber: 8, topic: 'dynamic-programming', displayName: 'Dynamic Programming Intro', description: 'Memoization, tabulation, classic DP problems' }
    ],
    intermediate: [
        { weekNumber: 1, topic: 'arrays', displayName: 'Advanced Arrays', description: 'Two pointers, prefix sums, advanced array techniques' },
        { weekNumber: 2, topic: 'sliding-window', displayName: 'Sliding Window', description: 'Fixed and variable window patterns' },
        { weekNumber: 3, topic: 'binary-search', displayName: 'Binary Search', description: 'Search in sorted arrays, rotated arrays, binary search on answers' },
        { weekNumber: 4, topic: 'trees', displayName: 'Trees & BST', description: 'AVL, segment trees, LCA, path sum problems' },
        { weekNumber: 5, topic: 'graphs', displayName: 'Graph Traversals', description: 'DFS, BFS, connected components, cycle detection' },
        { weekNumber: 6, topic: 'dynamic-programming', displayName: 'DP Patterns', description: 'LCS, LIS, knapsack, matrix chain multiplication' },
        { weekNumber: 7, topic: 'greedy', displayName: 'Greedy Algorithms', description: 'Activity selection, Huffman, interval scheduling' },
        { weekNumber: 8, topic: 'backtracking', displayName: 'Backtracking', description: 'N-queens, sudoku solver, subset generation' }
    ],
    advanced: [
        { weekNumber: 1, topic: 'graphs', displayName: 'Advanced Graphs', description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, topological sort' },
        { weekNumber: 2, topic: 'dynamic-programming', displayName: 'Advanced DP', description: 'Bitmask DP, digit DP, tree DP' },
        { weekNumber: 3, topic: 'trees', displayName: 'Advanced Trees', description: 'Segment trees with lazy propagation, Fenwick trees, tries' },
        { weekNumber: 4, topic: 'backtracking', displayName: 'Complex Backtracking', description: 'Constraint satisfaction, game theory problems' },
        { weekNumber: 5, topic: 'sliding-window', displayName: 'Monotonic Structures', description: 'Monotonic stack/deque, sliding window maximum' },
        { weekNumber: 6, topic: 'greedy', displayName: 'Advanced Greedy', description: 'Interval scheduling, fractional knapsack, job sequencing' },
        { weekNumber: 7, topic: 'binary-search', displayName: 'Advanced Binary Search', description: 'Binary search on answer space, parallel binary search' },
        { weekNumber: 8, topic: 'strings', displayName: 'String Algorithms', description: 'KMP, Rabin-Karp, Z-algorithm, suffix arrays' }
    ]
};

// GET /api/assessment/questions/:language
exports.getQuestions = async (req, res) => {
    try {
        const { language } = req.params;
        const langQuestions = questions[language];
        if (!langQuestions) {
            return res.status(400).json({ success: false, message: 'Invalid language. Choose: python, javascript, cpp, java' });
        }
        // Return without answers
        const sanitized = langQuestions.map(({ answer, ...rest }) => rest);
        res.json({ success: true, questions: sanitized, total: sanitized.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/assessment/submit
exports.submitAssessment = async (req, res) => {
    try {
        const { language, answers } = req.body; // answers: [{id: 'py1', answer: 0}, ...]
        const langQuestions = questions[language];
        if (!langQuestions) {
            return res.status(400).json({ success: false, message: 'Invalid language' });
        }

        let score = 0;
        const results = langQuestions.map(q => {
            const userAnswer = answers.find(a => a.id === q.id);
            const correct = userAnswer && userAnswer.answer === q.answer;
            if (correct) score++;
            return { id: q.id, correct, correctAnswer: q.answer, userAnswer: userAnswer?.answer };
        });

        const skillLevel = getSkillLevel(score, langQuestions.length);

        // Update user
        await User.findByIdAndUpdate(req.user.id, {
            skillLevel,
            assessmentCompleted: true,
            assessmentScore: score,
            preferredLanguage: language,
            $inc: { coins: 50 }
        });

        // Generate roadmap
        const template = roadmapTemplates[skillLevel];
        const roadmapWeeks = await Promise.all(template.map(async (week) => {
            const problems = await Problem.find({ topic: week.topic, isActive: true })
                .select('_id').limit(10);
            return { ...week, problems: problems.map(p => p._id), isUnlocked: week.weekNumber === 1 };
        }));

        await Roadmap.findOneAndUpdate(
            { userId: req.user.id },
            { skillLevel, weeks: roadmapWeeks, currentWeek: 1, overallProgress: 0 },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            score,
            total: langQuestions.length,
            percentage: Math.round((score / langQuestions.length) * 100),
            skillLevel,
            results,
            coinsEarned: 50,
            message: `Assessment complete! You are ${skillLevel} level. Your learning roadmap has been generated!`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
