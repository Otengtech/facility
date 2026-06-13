import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Facility'
  }],
  capacity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  equipment: [{ 
    type: String 
  }],
  location: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    default: 0 // 0 for internal users, >0 for external
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  operatingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '22:00' }
  }
}, { timestamps: true });

export default mongoose.model('Facility', facilitySchema);