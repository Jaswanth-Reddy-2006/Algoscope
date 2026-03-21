const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function test() {
    try {
        const response = await axios.post(URL, {
            contents: [{ parts: [{ text: "Hello" }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("SUCCESS V1!", JSON.stringify(response.data.candidates[0].content.parts[0].text, null, 2));
    } catch (e) {
        console.error("V1 FAILURE!");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Error:", e.message);
        }
    }
}

test();
