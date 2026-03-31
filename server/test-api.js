const axios = require('axios');

async function testAPI() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@mini-crm.com',
      password: 'Admin@123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful, token received');

    // Get leads
    const leadsResponse = await axios.get('http://localhost:5000/api/leads', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(`Total leads: ${leadsResponse.data.length}`);
    console.log('Sample leads:');

    // Show first 5 leads
    leadsResponse.data.slice(0, 5).forEach((lead, index) => {
      console.log(`${index + 1}. ${lead.name} - ${lead.email} - ${lead.status} - ${lead.source}`);
    });

    // Count by status
    const statusCounts = leadsResponse.data.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    console.log('\nStatus breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`${status}: ${count}`);
    });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAPI();