import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { facilityService } from '../services/facilityService'
import { bookingService } from '../services/bookingService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const BookingPage = () => {
  const { facilityId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
    equipmentNeeded: []
  })
  const [equipmentInput, setEquipmentInput] = useState('')

  useEffect(() => {
    if (isAuthenticated && facilityId) {
      fetchFacility()
    }
  }, [facilityId, isAuthenticated])

  useEffect(() => {
    if (formData.bookingDate && facilityId && isAuthenticated) {
      fetchAvailableSlots()
    }
  }, [formData.bookingDate, facilityId, isAuthenticated])

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const fetchFacility = async () => {
    try {
      const response = await facilityService.getFacilityById(facilityId)
      setFacility(response.facility)
    } catch (error) {
      console.error('Failed to fetch facility:', error)
      toast.error('Failed to load facility details')
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const response = await facilityService.getAvailableTimeSlots(facilityId, formData.bookingDate)
      setAvailableSlots(response.slots)
    } catch (error) {
      console.error('Failed to fetch slots:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipmentNeeded: [...prev.equipmentNeeded, equipmentInput.trim()]
      }))
      setEquipmentInput('')
    }
  }

  const removeEquipment = (index) => {
    setFormData(prev => ({
      ...prev,
      equipmentNeeded: prev.equipmentNeeded.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.startTime || !formData.endTime) {
      toast.error('Please select start and end time')
      return
    }

    if (parseInt(formData.expectedAttendees) > facility?.capacity) {
      toast.error(`Expected attendees cannot exceed facility capacity of ${facility?.capacity}`)
      return
    }

    setSubmitting(true)

    const bookingData = {
      facilityId: facility._id,
      bookingDate: formData.bookingDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      purpose: formData.purpose,
      expectedAttendees: parseInt(formData.expectedAttendees),
      equipmentNeeded: formData.equipmentNeeded
    }

    try {
      await bookingService.createBooking(bookingData)
      toast.success('Booking request submitted successfully!')
      navigate('/my-bookings')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500">Facility not found</p>
          <button 
            onClick={() => navigate('/facilities')}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Facilities
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Facility Header */}
          <div className="relative h-48 bg-gray-900">
            {facility.photos?.[0] ? (
              <img 
                src={facility.photos[0]} 
                alt={facility.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fas fa-building text-gray-700 text-5xl"></i>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{facility.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span><i className="fas fa-users mr-1"></i> Capacity: {facility.capacity}</span>
                <span><i className="fas fa-map-marker-alt mr-1"></i> {facility.location}</span>
                {user?.userType === 'external' && facility.pricePerHour > 0 && (
                  <span><i className="fas fa-dollar-sign mr-1"></i> ${facility.pricePerHour}/hour</span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Booking Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-calendar-day mr-2 text-gray-400"></i>
                  Booking Date
                </label>
                <input
                  type="date"
                  name="bookingDate"
                  required
                  value={formData.bookingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* Time Slots */}
              {formData.bookingDate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-clock mr-2 text-gray-400"></i>
                      Start Time
                    </label>
                    <select
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Select start time</option>
                      {availableSlots.filter(slot => slot.available).map((slot) => (
                        <option key={slot.start} value={slot.start}>
                          {slot.start}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-clock mr-2 text-gray-400"></i>
                      End Time
                    </label>
                    <select
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Select end time</option>
                      {availableSlots.filter(slot => slot.available).map((slot) => (
                        <option key={slot.end} value={slot.end}>
                          {slot.end}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-tasks mr-2 text-gray-400"></i>
                  Purpose of Booking
                </label>
                <textarea
                  name="purpose"
                  required
                  rows="3"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Describe the purpose of your booking (e.g., meeting, workshop, conference)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Expected Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-users mr-2 text-gray-400"></i>
                  Expected Attendees
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  required
                  min="1"
                  max={facility.capacity}
                  value={formData.expectedAttendees}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                {facility && parseInt(formData.expectedAttendees) > facility.capacity && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <i className="fas fa-exclamation-circle"></i>
                    Exceeds facility capacity of {facility.capacity} people
                  </p>
                )}
                {facility && parseInt(formData.expectedAttendees) <= facility.capacity && formData.expectedAttendees && (
                  <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
                    <i className="fas fa-check-circle"></i>
                    Within capacity limit
                  </p>
                )}
              </div>

              {/* Equipment Needed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-tools mr-2 text-gray-400"></i>
                  Equipment Needed
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    placeholder="e.g., Projector, Whiteboard, WiFi, Microphone"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                  />
                  <button 
                    type="button" 
                    onClick={addEquipment} 
                    className="bg-gray-900 text-white px-5 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {formData.equipmentNeeded.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.equipmentNeeded.map((item, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-gray-200">
                        <i className="fas fa-check-circle text-green-600 text-xs"></i>
                        {item}
                        <button 
                          type="button" 
                          onClick={() => removeEquipment(index)} 
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Section */}
              {formData.bookingDate && formData.startTime && formData.endTime && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Booking Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📅 Date: {new Date(formData.bookingDate).toLocaleDateString()}</p>
                    <p>⏰ Time: {formData.startTime} - {formData.endTime}</p>
                    <p>👥 Attendees: {formData.expectedAttendees || 'Not specified'}</p>
                    {user?.userType === 'external' && facility.pricePerHour > 0 && (
                      <p>💰 Estimated: ${facility.pricePerHour * 1} (minimum 1 hour)</p>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || (facility && parseInt(formData.expectedAttendees) > facility.capacity)}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i>Submitting...</>
                  ) : (
                    <><i className="fas fa-paper-plane mr-2"></i>Submit Booking Request</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage