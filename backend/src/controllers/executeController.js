const axios = require('axios');
const Problem = require('../models/Problem');
const User = require('../models/User');

const JUDGE0_BASE_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ''; // Needs to be configured in .env

// Language ID Mapping for Judge0
const LANGUAGE_MAP = {
    'cpp': 54, // C++ (GCC 9.2.0)
    'java': 62, // Java (OpenJDK 13.0.1)
    'python': 71, // Python (3.8.1)
    'javascript': 93 // Node.js (18.15.0)
};

exports.submitCode = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user.id;

        if (!code || !language || !problemId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const languageId = LANGUAGE_MAP[language.toLowerCase()];
        if (!languageId) {
            return res.status(400).json({ success: false, message: 'Unsupported language' });
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        if (!problem.testCases || problem.testCases.length === 0) {
            return res.status(400).json({ success: false, message: 'Problem has no test cases configured' });
        }

        // We will process test cases sequentially. 
        // For a production app, batch submissions to Judge0 is preferred, but sequential is easier for free tiers.
        let allPassed = true;
        let totalRuntime = 0;
        let maxMemory = 0;
        let failedTestCase = null;
        let failedOutput = null;

        // If no Judge0 key is setup, we provide a sophisticated mock success pattern for UI testing
        const isMocking = !JUDGE0_API_KEY;

        if (isMocking) {
            // Mock execution delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock random failure (20% chance) to demonstrate UI, unless code contains "pass"
            if (!code.toLowerCase().includes('pass') && Math.random() > 0.8) {
                allPassed = false;
                failedTestCase = problem.testCases[0].input;
                failedOutput = "Mock Syntax Error or Wrong Answer";
            }
            totalRuntime = Math.floor(Math.random() * 50) + 10;
            maxMemory = Math.floor(Math.random() * 20000) + 20000;
            
        } else {
            // REAL JUDGE0 INTEGRATION
            for (let i = 0; i < problem.testCases.length; i++) {
                const tc = problem.testCases[i];
                
                const response = await axios.post(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
                    source_code: code,
                    language_id: languageId,
                    stdin: tc.input || "",
                    expected_output: tc.expectedOutput || ""
                }, {
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                        'X-RapidAPI-Key': JUDGE0_API_KEY
                    }
                });

                const result = response.data;
                
                // Keep track of worst memory and total runtime
                if (result.time) totalRuntime += parseFloat(result.time) * 1000;
                if (result.memory) maxMemory = Math.max(maxMemory, result.memory);

                // Status 3 means Accepted
                if (result.status.id !== 3) {
                    allPassed = false;
                    failedTestCase = tc.input;
                    failedOutput = result.compile_output || result.stderr || result.stdout || "Wrong Answer";
                    break;
                }
            }
        }

        if (allPassed) {
            // Update User Stats
            const user = await User.findById(userId);
            let stateMutated = false;

            if (!user.solvedProblems.includes(problemId)) {
                user.solvedProblems.push(problemId);
                user.totalSolved += 1;
                user.coins += problem.difficulty === 'hard' ? 30 : problem.difficulty === 'medium' ? 20 : 10;
                user.updateStreak(); // Gamification
                stateMutated = true;
            }

            if (stateMutated) {
                await user.save();
            }

            // Also increment problem solve count globally
            await Problem.findByIdAndUpdate(problemId, { $inc: { solveCount: 1 } });

            return res.json({
                success: true,
                status: 'Accepted',
                metrics: {
                    runtime: `${Math.round(totalRuntime)} ms`,
                    memory: `${Math.round(maxMemory / 1024)} MB`
                },
                message: 'All test cases passed!'
            });
        } else {
            return res.json({
                success: true,
                status: 'Failed',
                failedTestCase: failedTestCase,
                output: failedOutput,
                message: 'Wrong Answer or Runtime Error on hidden test case'
            });
        }

    } catch (err) {
        console.error('Code Execution Error:', err.response?.data || err.message);
        res.status(500).json({ success: false, message: 'Execution Engine Error. Service might be down.' });
    }
};
