import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['internal', 'external'],
    required: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // Internal user fields
  studentStaffId: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true 
  },
  department: { 
    type: String 
  },
  // External user fields
  organization: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  // next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);