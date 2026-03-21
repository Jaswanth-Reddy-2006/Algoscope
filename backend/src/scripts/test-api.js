const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function test() {
    console.log("Testing API Key:", API_KEY?.substring(0, 4) + "...");
    try {
        const response = await axios.post(URL, {
            contents: [{ parts: [{ text: "Hello" }] }]
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("SUCCESS!", JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.error("FAILURE!");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Error:", e.message);
        }
    }
}

test();
