import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import usermod from './models/usermodel.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.db_url);
    console.log('Connected to DB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@test.com';
    const exist = await usermod.findOne({ email: adminEmail });
    
    if (exist) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash('admin123', salt);
    
    const admin = new usermod({
      name: 'Admin User',
      email: adminEmail,
      password: hashedpassword,
      contact_no: 1234567890,
      isverify: true,
    });
    
    await admin.save();
    console.log(`Admin created successfully!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: admin123`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
