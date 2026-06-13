import express from 'express';
import { 
  getAllFacilities, 
  getFacilityById, 
  getAvailableTimeSlots,
  createFacility,
  updateFacility 
} from '../controllers/facilityController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllFacilities);
router.get('/available-slots', getAvailableTimeSlots);
router.get('/:id', getFacilityById);
router.post('/', protect, adminOnly, createFacility);
router.put('/:id', protect, adminOnly, updateFacility);

export default router;