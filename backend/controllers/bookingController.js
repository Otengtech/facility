import Booking from '../models/Booking.js';
import Facility from '../models/Facility.js';
import User from '../models/User.js';
import { sendBookingNotification } from '../utils/emailService.js';
// Remove SMS import: import { sendBookingSMS } from '../utils/smsService.js';

export const createBooking = async (req, res) => {
  try {
    const { facilityId, bookingDate, startTime, endTime, purpose, expectedAttendees, equipmentNeeded } = req.body;
    
    // Check for conflicts
    const conflictingBooking = await Booking.findOne({
      facility: facilityId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      status: { $in: ['pending', 'approved', 'confirmed'] }
    });
    
    if (conflictingBooking) {
      return res.status(409).json({ 
        message: 'Time slot already booked. Please choose another time.',
        success: false 
      });
    }
    
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found', success: false });
    }
    
    const user = await User.findById(req.user._id);
    const totalAmount = user.userType === 'external' ? facility.pricePerHour : 0;
    
    const booking = await Booking.create({
      user: req.user._id,
      facility: facilityId,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      purpose,
      expectedAttendees,
      equipmentNeeded: equipmentNeeded || [],
      status: 'pending',
      paymentStatus: totalAmount > 0 ? 'pending' : 'waived',
      totalAmount
    });
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('facility')
      .populate('user', '-password');
    
    // Notify admins via email only
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendBookingNotification(admin, populatedBooking, 'pending');
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking request submitted successfully',
      booking: populatedBooking 
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// Other functions remain the same...
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('facility')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('facility')
      .populate('user', '-password');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }
    
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized', success: false });
    }
    
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized', success: false });
    }
    
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel booking at this stage', success: false });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};