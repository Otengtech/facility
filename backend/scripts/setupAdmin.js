import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      userType: 'internal',
      fullName: 'Oteng',
      email: 'oteng@admin.com',
      phone: '0593957373',
      password: 'oteng@admin.com',
      studentStaffId: 'ADMIN001',
      department: 'Administration',
      role: 'admin'
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: oteng@admin.com');
    console.log('🆔 Student/Staff ID: ADMIN001');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();