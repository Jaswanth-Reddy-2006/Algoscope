const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

async function test() {
    console.log("Testing Minimal API Call...");
    try {
        const result = await model.generateContent("Hi");
        console.log("RESPONSE SUCCESSFUL:", result.response.text());
    } catch (e) {
        console.error("API CALL FAILED:", e.message);
    }
}

test();
