import express from 'express';
import {
  getBookingReport,
  getFacilityUtilization,
  getRevenueReport,
  getUserStats,
  getSavedReports,
  getReportById
} from '../controllers/reportController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/bookings', getBookingReport);
router.get('/utilization', getFacilityUtilization);
router.get('/revenue', getRevenueReport);
router.get('/stats', getUserStats);
router.get('/saved', getSavedReports);
router.get('/:id', getReportById);

export default router;