import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { userType, fullName, email, phone, password, studentStaffId, department, organization } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists', success: false });
    }
    
    // Validate internal user
    if (userType === 'internal') {
      if (!studentStaffId) {
        return res.status(400).json({ message: 'Student/Staff ID required', success: false });
      }
      const idExists = await User.findOne({ studentStaffId });
      if (idExists) {
        return res.status(400).json({ message: 'ID already registered', success: false });
      }
    }
    
    const user = await User.create({
      userType,
      fullName,
      email,
      phone,
      password,
      studentStaffId: userType === 'internal' ? studentStaffId : undefined,
      department: userType === 'internal' ? department : undefined,
      organization: userType === 'external' ? organization : undefined
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, studentStaffId } = req.body;
    
    let user;
    if (studentStaffId) {
      user = await User.findOne({ studentStaffId });
    } else {
      user = await User.findOne({ email });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials', success: false });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        role: user.role
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};