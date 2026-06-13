import Facility from '../models/Facility.js';
import Booking from '../models/Booking.js';

export const getAllFacilities = async (req, res) => {
  try {
    const { capacity, equipment, date } = req.query;
    let query = { isAvailable: true };
    
    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }
    
    if (equipment) {
      query.equipment = { $in: [equipment] };
    }
    
    const facilities = await Facility.find(query);
    
    // Check availability for specific date if provided
    if (date && facilities.length > 0) {
      const targetDate = new Date(date);
      const bookings = await Booking.find({
        facility: { $in: facilities.map(f => f._id) },
        bookingDate: {
          $gte: new Date(targetDate.setHours(0,0,0)),
          $lte: new Date(targetDate.setHours(23,59,59))
        },
        status: { $in: ['approved', 'confirmed'] }
      });
      
      const bookedFacilityIds = new Set(bookings.map(b => b.facility.toString()));
      
      facilities.forEach(facility => {
        facility._doc.isBookedOnDate = bookedFacilityIds.has(facility._id.toString());
      });
    }
    
    res.json({ success: true, facilities });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found', success: false });
    }
    res.json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { facilityId, date } = req.query;
    const targetDate = new Date(date);
    
    const bookings = await Booking.find({
      facility: facilityId,
      bookingDate: {
        $gte: new Date(targetDate.setHours(0,0,0)),
        $lte: new Date(targetDate.setHours(23,59,59))
      },
      status: { $in: ['pending', 'approved', 'confirmed'] }
    });
    
    const bookedSlots = bookings.map(b => ({ start: b.startTime, end: b.endTime }));
    
    const allSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      const start = `${hour.toString().padStart(2, '0')}:00`;
      const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const isBooked = bookedSlots.some(slot => slot.start === start);
      allSlots.push({ start, end, available: !isBooked });
    }
    
    res.json({ success: true, slots: allSlots });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Admin only
export const createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};