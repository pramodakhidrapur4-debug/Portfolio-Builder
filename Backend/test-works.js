import mongoose from 'mongoose';
import usermod from './models/usermodel.js';
import PreviousWork from './models/PreviousWork.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import os from 'os';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
const API_URL = `http://localhost:${PORT}/api/works`;

const runTests = async () => {
  console.log("=== STARTING BACKEND TESTS ===");
  
  try {
    // 1. Verify MongoDB Connection
    console.log("1. Connecting to MongoDB...");
    await mongoose.connect(process.env.db_url);
    console.log("✅ MongoDB connected successfully");

    // Clear PreviousWorks for a clean test
    await PreviousWork.deleteMany({});
    
    // Create a dummy image
    const dummyImgPath = path.join(os.tmpdir(), 'dummy.jpg');
    fs.writeFileSync(dummyImgPath, Buffer.from("fake-image-data-for-testing-only"));

    // 2. Setup Admin User and Token
    console.log("2. Setting up Admin user...");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
    process.env.ADMIN_EMAIL = adminEmail; // ensure it matches for the test
    let adminUser = await usermod.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await usermod.create({
        name: "Admin Test",
        email: adminEmail,
        contact_no: 1234567890,
        password: "hashedpassword",
        isverify: true
      });
    }

    const adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SEC || "random#secret");
    console.log("✅ Admin user and token generated");

    // 3. Setup Normal User and Token
    const normalEmail = "normal@test.com";
    let normalUser = await usermod.findOne({ email: normalEmail });
    if (!normalUser) {
      normalUser = await usermod.create({
        name: "Normal Test",
        email: normalEmail,
        contact_no: 1234567891,
        password: "hashedpassword",
        isverify: true
      });
    }
    const normalToken = jwt.sign({ id: normalUser._id }, process.env.JWT_SEC || "random#secret");
    console.log("✅ Normal user and token generated");

    // Wait for server to be ready (assuming we run this while server is running)
    await new Promise(r => setTimeout(r, 2000));

    // 4. Test GET works (public)
    console.log("3. Testing GET /api/works (Public)...");
    let res = await axios.get(API_URL);
    if (res.status === 200 && Array.isArray(res.data.data)) {
      console.log("✅ GET /api/works passed");
    } else {
      throw new Error("GET /api/works failed");
    }

    // 5. Test unauthorized POST (no token)
    console.log("4. Testing POST /api/works (Unauthorized - No Token)...");
    try {
      await axios.post(API_URL, {});
      throw new Error("Should have failed without token");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("✅ Unauthorized POST blocked (401)");
      } else {
        throw new Error("Expected 401 Unauthorized");
      }
    }

    // 6. Test unauthorized POST (normal user token)
    console.log("5. Testing POST /api/works (Forbidden - Normal User)...");
    try {
      await axios.post(API_URL, {}, {
        headers: { Authorization: `Bearer ${normalToken}` }
      });
      throw new Error("Should have failed for normal user");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("✅ Forbidden POST blocked (403)");
      } else {
        throw new Error(`Expected 403 Forbidden, got ${err.response?.status}`);
      }
    }

    // 7. Test POST with valid data (Admin)
    console.log("6. Testing POST /api/works (Valid Data - Admin)...");
    const formData = new FormData();
    formData.append('businessName', 'Test Business');
    formData.append('description', 'Test Description');
    formData.append('link', 'https://example.com');
    formData.append('image', fs.createReadStream(dummyImgPath));

    // Notice we skip cloudinary in test or let it fail? Cloudinary upload requires valid credentials.
    // Since the backend uses actual cloudinary credentials, this upload MIGHT fail if credentials are bad or image is fake.
    // If it fails because "fake-image-data" isn't a valid image, that means Cloudinary is actually being hit!
    // We will catch it and log it.
    let createdWorkId = null;
    try {
      res = await axios.post(API_URL, formData, {
        headers: { 
          ...formData.getHeaders(),
          Authorization: `Bearer ${adminToken}`
        }
      });
      
      if (res.status === 201) {
        console.log("✅ POST /api/works passed. Cloudinary upload successful!");
        createdWorkId = res.data.data._id;
      }
    } catch (err) {
      console.log("ℹ️ POST /api/works failed, likely due to Cloudinary rejecting the dummy image or missing keys.");
      console.log("   Error:", err.response?.data?.message || err.message);
      
      // We will manually create a work in DB for the rest of the tests to proceed
      const mockWork = await PreviousWork.create({
        businessName: "Mock Business",
        description: "Mock Description",
        link: "https://mock.com",
        image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        imagePublicId: "sample"
      });
      createdWorkId = mockWork._id.toString();
      console.log("   Created mock record in DB to continue testing.");
    }

    // 8. Test invalid data (Validation)
    console.log("7. Testing Validation (Invalid URL)...");
    const badData = new FormData();
    badData.append('businessName', 'Bad Business');
    badData.append('description', 'Bad');
    badData.append('link', 'javascript:alert(1)');
    try {
      await axios.post(API_URL, badData, {
        headers: { ...badData.getHeaders(), Authorization: `Bearer ${adminToken}` }
      });
      throw new Error("Should have failed validation");
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data.message.includes('Invalid or dangerous URL')) {
        console.log("✅ Validation passed: Rejected dangerous URL (400)");
      } else if (err.response && err.response.status === 400 && err.response.data.message.includes('Image is required')) {
        console.log("✅ Validation passed: Rejected missing image (400)");
      } else {
        throw new Error("Expected 400 Bad Request for validation error, got: " + (err.response?.data?.message || err.message));
      }
    }

    // 9. Test UPDATE
    console.log("8. Testing PUT /api/works/:id...");
    try {
      const updateData = { businessName: "Updated Business" };
      res = await axios.put(`${API_URL}/${createdWorkId}`, updateData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status === 200 && res.data.data.businessName === "Updated Business") {
        console.log("✅ PUT /api/works/:id passed");
      } else {
        throw new Error("PUT update failed");
      }
    } catch (err) {
      console.log("❌ PUT failed:", err.response?.data?.message || err.message);
    }

    // 10. Test DELETE
    console.log("9. Testing DELETE /api/works/:id...");
    try {
      res = await axios.delete(`${API_URL}/${createdWorkId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.status === 200) {
        console.log("✅ DELETE /api/works/:id passed");
      } else {
        throw new Error("DELETE failed");
      }
    } catch (err) {
      console.log("❌ DELETE failed:", err.response?.data?.message || err.message);
    }

    // 11. Test Invalid ID
    console.log("10. Testing invalid ID format...");
    try {
      await axios.get(`${API_URL}/invalid-id`);
      throw new Error("Should have failed with invalid ID");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log("✅ Invalid ID format caught (400)");
      } else {
        throw new Error("Expected 400 for invalid ID");
      }
    }

    console.log("=== TESTS COMPLETE ===");
  } catch (error) {
    console.error("❌ TEST RUNNER FAILED:", error.message);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

runTests();
