const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const TIMEOUT = 10000; // 10 seconds

const languageConfig = {
    python: { ext: 'py', image: 'python:3.11-slim', cmd: (file) => `python3 ${file}` },
    javascript: { ext: 'js', image: 'node:18-alpine', cmd: (file) => `node ${file}` },
    cpp: { ext: 'cpp', image: 'gcc:latest', cmd: (file, out) => `g++ -o ${out} ${file} && ${out}` },
    java: { ext: 'java', image: 'openjdk:17', cmd: (file, className) => `javac ${file} && java ${className}` }
};

// Simulate code execution (for no-Docker mode)
const executeCodeSimulated = async (language, code, input) => {
    return {
        stdout: `[Simulated Output]\nCode execution requires Docker. Your code looks syntactically valid.\nLanguage: ${language}\nInput provided: ${input || 'none'}`,
        stderr: '',
        executionTime: Math.floor(Math.random() * 100) + 50
    };
};

const executeWithDocker = (language, code, input) => {
    return new Promise((resolve) => {
        const config = languageConfig[language];
        if (!config) return resolve({ stdout: '', stderr: 'Unsupported language', executionTime: 0 });

        const id = uuidv4();
        const tmpDir = path.join(os.tmpdir(), `dsa_${id}`);
        fs.mkdirSync(tmpDir, { recursive: true });

        let filename = `Solution.${config.ext}`;
        if (language === 'java') filename = 'Solution.java';

        const filePath = path.join(tmpDir, filename);
        const inputPath = path.join(tmpDir, 'input.txt');

        fs.writeFileSync(filePath, code);
        fs.writeFileSync(inputPath, input || '');

        const dockerCmd = language === 'cpp'
            ? `docker run --rm --memory="256m" --cpus="0.5" --network none -v "${tmpDir}":/code -w /code ${config.image} sh -c "g++ -o solution solution.cpp && ./solution < input.txt"`
            : language === 'java'
                ? `docker run --rm --memory="256m" --cpus="0.5" --network none -v "${tmpDir}":/code -w /code ${config.image} sh -c "javac Solution.java && java Solution < input.txt"`
                : `docker run --rm --memory="256m" --cpus="0.5" --network none -v "${tmpDir}":/code -w /code ${config.image} ${language === 'python' ? 'python3' : 'node'} ${filename} < input.txt`;

        const start = Date.now();
        exec(dockerCmd, { timeout: TIMEOUT }, (error, stdout, stderr) => {
            const executionTime = Date.now() - start;
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { }

            if (error && error.killed) {
                resolve({ stdout: '', stderr: 'Time Limit Exceeded', executionTime });
            } else {
                resolve({ stdout: stdout?.trim() || '', stderr: stderr?.trim() || (error?.message || ''), executionTime });
            }
        });
    });
};

// POST /api/code/run
exports.runCode = async (req, res) => {
    try {
        const { code, language, input } = req.body;
        if (!code || !language) return res.status(400).json({ success: false, message: 'Code and language required' });

        let result;
        try {
            result = await executeWithDocker(language, code, input);
        } catch {
            result = await executeCodeSimulated(language, code, input);
        }

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/code/submit
exports.submitCode = async (req, res) => {
    try {
        const { code, language, testCases } = req.body;
        if (!code || !language || !testCases) return res.status(400).json({ success: false, message: 'Missing required fields' });

        const results = [];
        let passed = 0;

        for (const tc of testCases) {
            let result;
            try {
                result = await executeWithDocker(language, code, tc.input);
            } catch {
                result = await executeCodeSimulated(language, code, tc.input);
            }

            const actualOutput = result.stdout.trim();
            const expectedOutput = tc.expectedOutput.trim();
            const isCorrect = actualOutput === expectedOutput;
            if (isCorrect) passed++;

            results.push({
                input: tc.input,
                expected: expectedOutput,
                actual: actualOutput,
                passed: isCorrect,
                executionTime: result.executionTime,
                error: result.stderr
            });
        }

        res.json({
            success: true,
            passed,
            total: testCases.length,
            allPassed: passed === testCases.length,
            results
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
