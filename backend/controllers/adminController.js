import Booking from '../models/Booking.js';
import Facility from '../models/Facility.js';
import User from '../models/User.js';
import { sendBookingNotification, sendPaymentInstructions } from '../utils/emailService.js';
// Remove SMS import: import { sendBookingSMS } from '../utils/smsService.js';

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    const booking = await Booking.findById(id)
      .populate('user')
      .populate('facility');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }
    
    booking.status = status;
    if (status === 'rejected') {
      booking.rejectionReason = rejectionReason;
    }
    
    await booking.save();
    
    // Send email notification only (no SMS)
    await sendBookingNotification(booking.user, booking, status);
    
    // If external user booking approved, send payment instructions
    if (status === 'approved' && booking.user.userType === 'external' && booking.totalAmount > 0) {
      await sendPaymentInstructions(booking.user, booking);
    }
    
    res.json({ success: true, message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Other functions remain the same...
export const getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('user', '-password')
      .populate('facility')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference } = req.body;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }
    
    booking.paymentStatus = 'paid';
    booking.paymentReference = paymentReference;
    booking.status = 'confirmed';
    await booking.save();
    
    const populatedBooking = await Booking.findById(id).populate('user').populate('facility');
    await sendBookingNotification(populatedBooking.user, populatedBooking, 'confirmed');
    
    res.json({ success: true, message: 'Payment confirmed, booking is now confirmed' });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const markBookingCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id).populate('user').populate('facility');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found', success: false });
    }
    
    booking.status = 'completed';
    await booking.save();
    
    await sendBookingNotification(booking.user, booking, 'completed');
    
    res.json({ success: true, message: 'Booking marked as completed' });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const createFacilityAdmin = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};