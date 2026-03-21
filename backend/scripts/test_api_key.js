const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
    console.log("Testing API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    if (!process.env.GEMINI_API_KEY) return;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'API Key is working'");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("API Error Details:");
        console.error("Message:", e.message);
        console.error("Status:", e.status);
    }
}

testKey();
