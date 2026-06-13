import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.post('/setup-admin', async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            return res.status(400).json({
                message: 'Admin already exists',
                admin: {
                    email: existingAdmin.email,
                    role: existingAdmin.role
                }
            });
        }

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

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            credentials: {
                email: admin.email,
                password: 'oteng@admin.com',
                studentStaffId: admin.studentStaffId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;