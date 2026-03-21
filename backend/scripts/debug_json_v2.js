const axios = require('axios');
const DATA_URL = 'https://raw.githubusercontent.com/noworneverev/leetcode-api/main/data/leetcode_questions.json';

async function debugData() {
    try {
        const response = await axios.get(DATA_URL);
        const data = response.data;
        console.log("First item .data.question:", JSON.stringify(data[0].data.question, null, 2));
    } catch (e) {
        console.error(e);
    }
}
debugData();
