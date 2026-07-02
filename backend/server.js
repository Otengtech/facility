// server.js
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

// Load environment variables
dotenv.config();

const app = express();

// ============================================================
// CORS CONFIGURATION - Allow both local and production
// ============================================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nathanielgyarteng.com',
  'https://your-frontend.vercel.app', // Replace with your actual Vercel URL
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN', 'Accept'],
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// API ROUTES
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// ============================================================
// HEALTH CHECK ROUTE (For Vercel)
// ============================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// ROOT ROUTE
// ============================================================
app.get('/', (req, res) => {
  res.json({
    message: 'Barber Shop API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      facilities: '/api/facilities',
      bookings: '/api/bookings',
      admin: '/api/admin',
      reports: '/api/reports',
      health: '/api/health',
    },
  });
});

// ============================================================
// CREATE ADMIN USER FUNCTION
// ============================================================
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      const admin = new User({
        userType: 'internal',
        fullName: 'Oteng',
        email: 'oteng@admin.com',
        phone: '0593957373',
        password: 'oteng@admin.com',
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

// ============================================================
// DATABASE CONNECTION & SERVER START (Local Only)
// ============================================================
const startServer = async () => {
  try {
    // Only connect to MongoDB if not in Vercel serverless environment
    // or if we're running locally
    if (process.env.NODE_ENV !== 'production' || process.env.IS_LOCAL === 'true') {
      await connectDB();
      await createAdminUser();
    } else {
      console.log('🚀 Running in Vercel serverless mode - skipping DB connection on startup');
    }
    
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

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || process.env.IS_LOCAL === 'true') {
  startServer();
}

// ============================================================
// EXPORT APP FOR VERCEL (Serverless)
// ============================================================
export default app;