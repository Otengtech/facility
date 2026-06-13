import api from './api'

export const bookingService = {
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData)
  },

  getUserBookings: async () => {
    return await api.get('/bookings')
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`)
  },

  cancelBooking: async (id) => {
    return await api.put(`/bookings/${id}/cancel`)
  }
}

export const adminBookingService = {
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return await api.get(`/admin/bookings${params ? `?${params}` : ''}`)
  },

  updateBookingStatus: async (id, status, rejectionReason = '') => {
    return await api.put(`/admin/bookings/${id}/status`, { status, rejectionReason })
  },

  confirmPayment: async (id, paymentReference) => {
    return await api.put(`/admin/bookings/${id}/payment`, { paymentReference })
  },

  markCompleted: async (id) => {
    return await api.put(`/admin/bookings/${id}/complete`)
  }
}