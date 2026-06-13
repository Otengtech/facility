import api from './api'

export const facilityService = {
  getAllFacilities: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return await api.get(`/facilities${params ? `?${params}` : ''}`)
  },

  getFacilityById: async (id) => {
    return await api.get(`/facilities/${id}`)
  },

  getAvailableTimeSlots: async (facilityId, date) => {
    return await api.get(`/facilities/available-slots?facilityId=${facilityId}&date=${date}`)
  },

  createFacility: async (facilityData) => {
    return await api.post('/facilities', facilityData)
  },

  updateFacility: async (id, facilityData) => {
    return await api.put(`/facilities/${id}`, facilityData)
  }
}