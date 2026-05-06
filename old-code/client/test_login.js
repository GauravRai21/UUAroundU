const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      uniqueId: '23150010042',
      password: 'Gaurav2004'
    });
    console.log('Login successful:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Server responded with status:', err.response.status);
      console.log('Data:', err.response.data);
    } else {
      console.log('Network error / Server unreachable:', err.message);
    }
  }
}

testLogin();
