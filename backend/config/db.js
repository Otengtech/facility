// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState >= 1) {
            console.log("✅ MongoDB already connected");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI, {
            // No deprecated options needed for newer Mongoose versions
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        // Don't exit process in production (Vercel)
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
});