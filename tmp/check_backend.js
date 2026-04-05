const axios = require('axios');

async function check() {
    try {
        console.log("Checking http://localhost:5000/api/db-check...");
        const response = await axios.get('http://localhost:5000/api/db-check');
        console.log("Local Backend Check:", response.data);
    } catch (err) {
        if (err.response) {
            console.log("Local Backend Check Failed (Response):", err.response.data);
        } else {
            console.log("Local Backend Check Failed (Request):", err.message);
        }
    }
}

check();
