import mongoose from "mongoose";
import dotenv from "dotenv";
// Optional: Add the DNS fix here if needed
// import dns from 'dns';
// dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

export const connectDB = async () => {
    try {
        // Deprecated options like useNewUrlParser have been removed.
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

const createAdminIfNotExists = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
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
            
            console.log('\n✅ Admin user created automatically!\n');
            console.log('📧 Email: oteng@admin.com');
            console.log('🔑 Password: oteng@admin.com\n');
        } else {
            console.log('ℹ️ Admin user already exists:', adminExists.email);
        }
    } catch (error) {
        console.error('Error creating admin:', error.message);
    }
};