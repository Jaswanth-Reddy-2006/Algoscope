import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

async function test() {
    try {
        console.log('Testing connection to http://localhost:5000/api/problems...');
        const response = await api.get('/problems');
        console.log('Success! Problem count:', response.data.length);
    } catch (err) {
        console.error('Failed to connect:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

test();
