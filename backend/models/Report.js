import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    enum: ['booking_report', 'facility_utilization', 'revenue_report', 'user_stats'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parameters: {
    startDate: Date,
    endDate: Date,
    groupBy: {
      type: String,
      enum: ['day', 'month', null],
      default: null
    }
  },
  // Store the exact response from your controllers
  reportData: {
    // For booking report
    report: [{
      _id: mongoose.Schema.Types.Mixed,
      totalBookings: Number,
      approved: Number,
      confirmed: Number,
      completed: Number,
      rejected: Number,
      totalRevenue: Number
    }],
    
    // For facility utilization
    utilization: [{
      _id: mongoose.Schema.Types.ObjectId,
      totalBookings: Number,
      confirmedBookings: Number,
      facility: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        description: String,
        capacity: Number,
        location: String,
        pricePerHour: Number
      }
    }],
    
    // For revenue report
    revenue: {
      totalRevenue: Number,
      totalPaidBookings: Number
    },
    byUserType: [{
      _id: String, // 'internal' or 'external'
      revenue: Number,
      count: Number
    }],
    
    // For user stats
    stats: {
      totalUsers: Number,
      internalUsers: Number,
      externalUsers: Number,
      activeBookings: Number
    }
  },
  summary: {
    totalRecords: Number,
    totalRevenue: Number,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  format: {
    type: String,
    enum: ['json', 'pdf', 'csv'],
    default: 'json'
  },
  fileUrl: String,
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 90*24*60*60*1000) // 90 days
  }
}, { timestamps: true });

// Indexes for efficient queries
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ reportType: 1, createdAt: -1 });
reportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to save report from controller response
reportSchema.statics.saveBookingReport = async function(userId, params, reportData) {
  const report = new this({
    reportType: 'booking_report',
    title: `Booking Report ${params.startDate} to ${params.endDate}`,
    generatedBy: userId,
    parameters: {
      startDate: params.startDate,
      endDate: params.endDate,
      groupBy: params.groupBy || null
    },
    reportData: {
      report: reportData
    },
    summary: {
      totalRecords: reportData.length,
      totalRevenue: reportData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0)
    }
  });
  
  return await report.save();
};

reportSchema.statics.saveUtilizationReport = async function(userId, params, utilizationData) {
  const report = new this({
    reportType: 'facility_utilization',
    title: 'Facility Utilization Report',
    generatedBy: userId,
    parameters: {
      startDate: params.startDate,
      endDate: params.endDate
    },
    reportData: {
      utilization: utilizationData
    },
    summary: {
      totalRecords: utilizationData.length,
      totalRevenue: 0
    }
  });
  
  return await report.save();
};

reportSchema.statics.saveRevenueReport = async function(userId, params, revenueData, byUserTypeData) {
  const report = new this({
    reportType: 'revenue_report',
    title: `Revenue Report ${params.startDate || 'All Time'} to ${params.endDate || 'Present'}`,
    generatedBy: userId,
    parameters: {
      startDate: params.startDate,
      endDate: params.endDate
    },
    reportData: {
      revenue: revenueData,
      byUserType: byUserTypeData
    },
    summary: {
      totalRecords: byUserTypeData.length,
      totalRevenue: revenueData.totalRevenue || 0
    }
  });
  
  return await report.save();
};

reportSchema.statics.saveUserStatsReport = async function(userId, statsData) {
  const report = new this({
    reportType: 'user_stats',
    title: 'User Statistics Report',
    generatedBy: userId,
    reportData: {
      stats: statsData
    },
    summary: {
      totalRecords: statsData.totalUsers,
      totalRevenue: 0
    }
  });
  
  return await report.save();
};

// Method to get user's report history
reportSchema.statics.getUserReports = async function(userId, limit = 10) {
  return await this.find({ generatedBy: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('reportType title createdAt summary');
};

// Method to delete old reports
reportSchema.statics.deleteOldReports = async function(daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return await this.deleteMany({ 
    createdAt: { $lt: cutoffDate },
    format: { $ne: 'pdf' } // Keep PDF reports longer
  });
};

export default mongoose.model('Report', reportSchema);