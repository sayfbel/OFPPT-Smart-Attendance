const axios = require('axios');

async function testApi() {
    const baseUrl = 'http://localhost:5000/api';
    console.log(`🚀 Testing Backend API at ${baseUrl}...`);
    
    try {
        const response = await axios.get(`${baseUrl}/admin/summary`);
        console.log('✅ API responding! Status:', response.status);
        console.log('📊 Dashboard Data retrieved successfully.');
    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.error('❌ Server is not running on port 5000. Start it with "npm run dev" first.');
        } else if (err.response && err.response.status === 401) {
            console.log('✅ API is alive (returned 401 Unauthorized as expected without token).');
        } else {
            console.error('❌ API Test Failed:', err.message);
        }
    }
}

testApi();
