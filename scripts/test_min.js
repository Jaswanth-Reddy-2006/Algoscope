const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
    console.log("Testing Minimum Synthesis...");
    try {
        const result = await model.generateContent("Give me a JSON with one field 'test': 'success'");
        console.log("RESPONSE:", result.response.text());
    } catch (e) {
        console.error("FAILED:", e.message);
    }
}

test();
