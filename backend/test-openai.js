require('dotenv').config();
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
        throw err;
    }
};

async function test() {
    console.log("Testing OpenAI integration...");
    try {
        const result = await generateContent("Reply with exactly 'INTEGRATION SUCCESSFUL'");
        console.log("Response:", result);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
