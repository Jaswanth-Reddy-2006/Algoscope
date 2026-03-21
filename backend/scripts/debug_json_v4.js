const axios = require('axios');
const DATA_URL = 'https://raw.githubusercontent.com/noworneverev/leetcode-api/main/data/leetcode_questions.json';

async function debugData() {
    try {
        const response = await axios.get(DATA_URL);
        const data = response.data;
        const q = data[0].data.question;
        console.log("url:", q.url);
        const match = q.url.match(/\/problems\/([^/]+)\//);
        console.log("extracted slug:", match ? match[1] : "None");
    } catch (e) {
        console.error(e);
    }
}
debugData();
