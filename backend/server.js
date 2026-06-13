import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// Create admin user function
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      // Create admin user
      const admin = new User({
        userType: 'internal',
        fullName: 'Oteng',
        email: 'oteng@admin.com',
        phone: '0593957373',
        password: 'oteng@admin.com', // Change this in production
        studentStaffId: 'ADMIN001',
        department: 'Administration',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: oteng@admin.com');
      console.log('🔑 Password: oteng@admin.com');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

// Database connection and server start
const startServer = async () => {
  try {
    await connectDB();
    
    // Create admin user after database connection
    await createAdminUser();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Admin login: http://localhost:${PORT}/api/auth/login`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    success: false 
  });
});