// Test API call to debug the blogs fetching issue
console.log('Testing API calls...');

const API_BASE_URL = 'http://localhost:5000/api';

// Test 1: Try different endpoints
async function testAPICalls() {
  console.log('=== Testing Blog API Endpoints ===');
  
  try {
    // Test with includeAll parameter
    console.log('1. Testing with includeAll=true...');
    let response = await fetch(`${API_BASE_URL}/blogs?includeAll=true`);
    console.log('Status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Success with includeAll:', data.length, 'blogs found');
      console.log('Sample blog:', data[0]);
    } else {
      console.log('Failed with includeAll:', await response.text());
    }
  } catch (err) {
    console.error('Error with includeAll:', err);
  }

  try {
    // Test without parameters
    console.log('2. Testing without parameters...');
    let response = await fetch(`${API_BASE_URL}/blogs`);
    console.log('Status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Success without params:', data.length, 'blogs found');
      console.log('Sample blog:', data[0]);
    } else {
      console.log('Failed without params:', await response.text());
    }
  } catch (err) {
    console.error('Error without params:', err);
  }

  try {
    // Test with admin query
    console.log('3. Testing with admin=true...');
    let response = await fetch(`${API_BASE_URL}/blogs?admin=true`);
    console.log('Status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Success with admin:', data.length, 'blogs found');
    } else {
      console.log('Failed with admin:', await response.text());
    }
  } catch (err) {
    console.error('Error with admin:', err);
  }
}

// Run the test
testAPICalls();