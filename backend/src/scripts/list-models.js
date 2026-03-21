const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function test() {
    try {
        const response = await axios.get(URL);
        console.log("ACCESSIBLE MODELS:");
        console.log(JSON.stringify(response.data.models.map(m => m.name), null, 2));
    } catch (e) {
        console.error("LIST MODELS FAILED!");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Error:", e.message);
        }
    }
}

test();
