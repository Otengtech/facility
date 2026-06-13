import Booking from '../models/Booking.js';
import Facility from '../models/Facility.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

export const getBookingReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let groupStage = {};
    if (groupBy === 'day') {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
      };
    } else if (groupBy === 'month') {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      };
    } else {
      groupStage = { _id: null };
    }
    
    const report = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          ...groupStage,
          totalBookings: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    // Save report to database
    const savedReport = await Report.saveBookingReport(
      req.user._id,
      { startDate, endDate, groupBy },
      report
    );
    
    res.json({ 
      success: true, 
      report,
      reportId: savedReport._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getFacilityUtilization = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const utilization = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$facility",
          totalBookings: { $sum: 1 },
          confirmedBookings: { 
            $sum: { $cond: [{ $in: ["$status", ["approved", "confirmed", "completed"]] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "facilities",
          localField: "_id",
          foreignField: "_id",
          as: "facility"
        }
      },
      { $unwind: "$facility" },
      { $sort: { totalBookings: -1 } }
    ]);
    
    // Save report
    const savedReport = await Report.saveUtilizationReport(
      req.user._id,
      { startDate, endDate },
      utilization
    );
    
    res.json({ 
      success: true, 
      utilization,
      reportId: savedReport._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {
      paymentStatus: 'paid'
    };
    
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const revenue = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalPaidBookings: { $sum: 1 }
        }
      }
    ]);
    
    const revenueByUserType = await Booking.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$user.userType",
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Save report
    const savedReport = await Report.saveRevenueReport(
      req.user._id,
      { startDate, endDate },
      revenue[0] || { totalRevenue: 0, totalPaidBookings: 0 },
      revenueByUserType
    );
    
    res.json({ 
      success: true, 
      revenue: revenue[0] || { totalRevenue: 0, totalPaidBookings: 0 },
      byUserType: revenueByUserType,
      reportId: savedReport._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const internalUsers = await User.countDocuments({ userType: 'internal' });
    const externalUsers = await User.countDocuments({ userType: 'external' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['approved', 'confirmed'] }
    });
    
    const stats = {
      totalUsers,
      internalUsers,
      externalUsers,
      adminUsers,
      activeBookings
    };
    
    // Save report
    const savedReport = await Report.saveUserStatsReport(req.user._id, stats);
    
    res.json({
      success: true,
      stats,
      reportId: savedReport._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// New endpoint to get saved reports
export const getSavedReports = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const reports = await Report.getUserReports(req.user._id, parseInt(limit));
    
    res.json({
      success: true,
      reports
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// New endpoint to get a specific saved report
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'fullName email');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found', success: false });
    }
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};