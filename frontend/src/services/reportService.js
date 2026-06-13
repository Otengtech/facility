import api from './api'

export const reportService = {
  getBookingReport: async (startDate, endDate, groupBy) => {
    const params = new URLSearchParams({ startDate, endDate, groupBy }).toString()
    return await api.get(`/reports/bookings?${params}`)
  },

  getFacilityUtilization: async (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString()
    return await api.get(`/reports/utilization?${params}`)
  },

  getRevenueReport: async (startDate, endDate) => {
    const params = new URLSearchParams({ startDate, endDate }).toString()
    return await api.get(`/reports/revenue?${params}`)
  },

  getUserStats: async () => {
    return await api.get('/reports/stats')
  },

  getSavedReports: async (limit = 10) => {
    return await api.get(`/reports/saved?limit=${limit}`)
  },

  getReportById: async (id) => {
    return await api.get(`/reports/${id}`)
  }
}