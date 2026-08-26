import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/business-enquiries', {
      name: "Test Name",
      email: "test@test.com",
      phone: "1234567890",
      businessName: "Test Business",
      message: "Test message"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
}

test();
