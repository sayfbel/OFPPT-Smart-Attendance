const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@ofppt.ma',
            password: 'admin123'
        });
        console.log('Login successful:', response.data);
    } catch (err) {
        console.error('Login failed with status:', err.response?.status);
        console.error('Error message:', err.response?.data);
        if (!err.response) {
            console.error('No response received from server. Is it running on port 5000?');
        }
    }
}

testLogin();
