import express from 'express';
import {
  getAllBookings,
  updateBookingStatus,
  confirmPayment,
  markBookingCompleted,
  getAllUsers,
  createFacilityAdmin
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly); // All admin routes require authentication and admin role

router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/bookings/:id/payment', confirmPayment);
router.put('/bookings/:id/complete', markBookingCompleted);
router.get('/users', getAllUsers);
router.post('/facilities', createFacilityAdmin);

export default router;