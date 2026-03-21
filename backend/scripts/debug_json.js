const axios = require('axios');
const DATA_URL = 'https://raw.githubusercontent.com/noworneverev/leetcode-api/main/data/leetcode_questions.json';

async function debugData() {
    try {
        const response = await axios.get(DATA_URL);
        const data = response.data;
        console.log("Data length:", data.length);
        console.log("First item keys:", Object.keys(data[0]));
        console.log("First item .data keys:", data[0].data ? Object.keys(data[0].data) : "None");
        console.log("First item .data.question keys:", data[0].data?.question ? Object.keys(data[0].data.question) : "None");
        console.log("Sample Slug:", data[0].data?.question?.titleSlug);
    } catch (e) {
        console.error(e);
    }
}
debugData();
