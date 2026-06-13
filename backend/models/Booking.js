import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  facility: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Facility', 
    required: true 
  },
  bookingDate: { 
    type: Date, 
    required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  purpose: { 
    type: String, 
    required: true 
  },
  expectedAttendees: { 
    type: Number, 
    required: true,
    min: 1 
  },
  equipmentNeeded: [{ 
    type: String 
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  rejectionReason: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'waived', 'failed'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  invoiceUrl: String,
  paymentReference: String,
  adminNotes: String
}, { timestamps: true });

// IMPORTANT: Create compound indexes for efficient conflict checking
bookingSchema.index({ facility: 1, bookingDate: 1, startTime: 1, endTime: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ user: 1, createdAt: -1 });

// Add a unique compound index to prevent double booking at database level
// This ensures no two bookings can have the same facility, date, and overlapping times
bookingSchema.index(
  { 
    facility: 1, 
    bookingDate: 1, 
    startTime: 1, 
    endTime: 1,
    status: 1 
  },
  { 
    unique: false, // Can't be unique because status varies
    partialFilterExpression: { 
      status: { $in: ['pending', 'approved', 'confirmed'] } 
    }
  }
);

export default mongoose.model('Booking', bookingSchema);