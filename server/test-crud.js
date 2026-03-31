const axios = require('axios');

async function testCRUD() {
  try {
    // Login
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@mini-crm.com',
      password: 'Admin@123'
    });

    const token = loginResponse.data.token;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('Login successful');

    // Get all leads
    const leadsResponse = await axios.get('http://localhost:5000/api/leads', { headers });
    console.log(`Initial leads count: ${leadsResponse.data.length}`);

    // Create a new lead
    const newLead = {
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '+1-555-9999',
      source: 'Website',
      status: 'new',
      notes: 'Created via API test'
    };

    const createResponse = await axios.post('http://localhost:5000/api/leads', newLead, { headers });
    console.log('Created new lead:', createResponse.data.name);

    // Update the lead's status
    const leadId = createResponse.data.id;
    const updateResponse = await axios.put(`http://localhost:5000/api/leads/${leadId}`,
      { status: 'contacted', notes: 'Status updated to contacted' },
      { headers }
    );
    console.log('Updated lead status to:', updateResponse.data.status);

    // Delete the test lead
    await axios.delete(`http://localhost:5000/api/leads/${leadId}`, { headers });
    console.log('Deleted test lead');

    // Verify final count
    const finalResponse = await axios.get('http://localhost:5000/api/leads', { headers });
    console.log(`Final leads count: ${finalResponse.data.length}`);

    console.log('✅ All CRUD operations successful!');

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testCRUD();