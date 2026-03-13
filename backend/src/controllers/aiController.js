const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateContent = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error('OpenAI API error:', err.message);
        throw new Error('AI service temporarily unavailable');
    }
};

exports.explainProblem = async (req, res) => {
    try {
        const { title, description, topic, difficulty } = req.body;
        const prompt = `You are an expert DSA instructor. Explain this coding problem clearly for a student.
    
Problem: ${title}
Difficulty: ${difficulty}
Topic: ${topic}
Description: ${description}

Explain:
1. What the problem is asking in simple terms
2. Key observations to solve it
3. The overall approach/strategy (without full code)
4. Time and space complexity hints

Keep the explanation concise and educational.`;

        const explanation = await generateContent(prompt);
        res.json({ success: true, explanation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getHint = async (req, res) => {
    try {
        const { title, description, code, language, level = 1 } = req.body;
        const prompt = `You are a coding mentor. Give a helpful hint for this DSA problem WITHOUT revealing the complete solution.

Problem: ${title}
Description: ${description}
Language: ${language}
Student's current code:
\`\`\`${language}
${code || '// No code written yet'}
\`\`\`

Hint level: ${level} (1=gentle nudge, 2=directional hint, 3=specific algorithm hint)

Give a level ${level} hint that guides the student without giving away the answer.`;

        const hint = await generateContent(prompt);
        res.json({ success: true, hint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.debugCode = async (req, res) => {
    try {
        const { code, language, error, problemTitle } = req.body;
        const prompt = `You are a debugging expert. Help the student find bugs in their code.

Problem: ${problemTitle}
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`
${error ? `Error message: ${error}` : ''}

Identify:
1. The bug(s) in the code
2. Why it occurs
3. How to fix it (give corrected code snippets)
4. What to learn from this mistake`;

        const analysis = await generateContent(prompt);
        res.json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.analyzeComplexity = async (req, res) => {
    try {
        const { code, language } = req.body;
        const prompt = `You are a time/space complexity expert. Analyze this code:

Language: ${language}
\`\`\`${language}
${code}
\`\`\`

Provide:
1. **Time Complexity**: O(?) with explanation
2. **Space Complexity**: O(?) with explanation  
3. **Bottlenecks**: What makes it slow?
4. **Optimization ideas**: How to improve it?

Be precise and educational.`;

        const analysis = await generateContent(prompt);
        res.json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.reviewCode = async (req, res) => {
    try {
        const { code, language, problemTitle } = req.body;
        const prompt = `You are a senior software engineer doing a code review for a DSA solution.

Problem: ${problemTitle}
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Review:
1. **Correctness**: Any logical errors?
2. **Efficiency**: Time/space complexity?
3. **Code Quality**: Readability, naming, style?
4. **Edge Cases**: What cases might fail?
5. **Overall Score**: /10 with brief justification`;

        const review = await generateContent(prompt);
        res.json({ success: true, review });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.chat = async (req, res) => {
    try {
        const { message, context } = req.body;
        const prompt = `You are a helpful and knowledgeable AI DSA Tutor. Your goal is to help students learn data structures and algorithms effectively. 
        ${context ? `Context about current activity: ${context}` : ''}
        Student's message: ${message}
        
        Provide a clear, educational, and encouraging response. Use markdown for code blocks or emphasis if needed. Keep the response concise but thorough.`;

        const reply = await generateContent(prompt);
        res.json({ success: true, reply });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

