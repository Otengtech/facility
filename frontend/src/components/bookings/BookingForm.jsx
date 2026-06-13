import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { facilityService } from '../../services/facilityService'
import { bookingService } from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const BookingForm = ({ facilityId, onSuccess }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
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
  const [lastCheckedTime, setLastCheckedTime] = useState(null)

  useEffect(() => {
    fetchFacility()
  }, [facilityId])

  useEffect(() => {
    if (formData.bookingDate && facilityId) {
      fetchAvailableSlots()
    }
  }, [formData.bookingDate, facilityId])

  // Real-time availability check when time selection changes
  useEffect(() => {
    if (formData.bookingDate && formData.startTime && formData.endTime && facilityId) {
      const checkTimer = setTimeout(() => {
        checkRealTimeAvailability()
      }, 500) // Debounce to avoid too many API calls
      
      return () => clearTimeout(checkTimer)
    }
  }, [formData.startTime, formData.endTime, formData.bookingDate, facilityId])

  const fetchFacility = async () => {
    try {
      const response = await facilityService.getFacilityById(facilityId)
      setFacility(response.facility)
    } catch (error) {
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

  const checkRealTimeAvailability = async () => {
    if (!formData.startTime || !formData.endTime) return
    
    setCheckingAvailability(true)
    try {
      const response = await facilityService.checkAvailability(
        facilityId,
        formData.bookingDate,
        formData.startTime,
        formData.endTime
      )
      
      if (!response.available) {
        toast.warning(`This time slot (${formData.startTime} - ${formData.endTime}) is no longer available. Please select another time.`, {
          autoClose: 5000
        })
        // Refresh available slots
        fetchAvailableSlots()
        // Clear selected times
        setFormData(prev => ({ ...prev, startTime: '', endTime: '' }))
      } else {
        setLastCheckedTime(new Date())
      }
    } catch (error) {
      console.error('Availability check failed:', error)
    } finally {
      setCheckingAvailability(false)
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

    // Final availability check before submission
    setSubmitting(true)
    setCheckingAvailability(true)
    
    try {
      const availabilityCheck = await facilityService.checkAvailability(
        facilityId,
        formData.bookingDate,
        formData.startTime,
        formData.endTime
      )
      
      if (!availabilityCheck.available) {
        toast.error('This time slot is no longer available. Please select another time.')
        fetchAvailableSlots()
        setFormData(prev => ({ ...prev, startTime: '', endTime: '' }))
        setSubmitting(false)
        setCheckingAvailability(false)
        return
      }

      const bookingData = {
        facilityId: facility._id,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees),
        equipmentNeeded: formData.equipmentNeeded
      }

      await bookingService.createBooking(bookingData)
      toast.success('Booking request submitted successfully!')
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/my-bookings')
      }
    } catch (error) {
      if (error.response?.status === 409) {
        // Conflict error
        toast.error('This time slot was just taken. Please select another time.')
        fetchAvailableSlots()
        setFormData(prev => ({ ...prev, startTime: '', endTime: '' }))
      } else {
        toast.error(error.response?.data?.message || 'Failed to create booking')
      }
    } finally {
      setSubmitting(false)
      setCheckingAvailability(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Facility Info Card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-building text-white text-sm"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{facility?.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{facility?.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-users w-4 text-gray-400"></i>
            <span className="ml-2">Capacity: {facility?.capacity}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-map-marker-alt w-4 text-gray-400"></i>
            <span className="ml-2 truncate">{facility?.location}</span>
          </div>
          {user?.userType === 'external' && facility?.pricePerHour > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <i className="fas fa-dollar-sign w-4 text-gray-400"></i>
              <span className="ml-2">${facility?.pricePerHour}/hour</span>
            </div>
          )}
        </div>
      </div>

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
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Time Slots */}
      {formData.bookingDate && (
        <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              disabled={checkingAvailability}
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              disabled={checkingAvailability}
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

      {/* Real-time availability status */}
      {formData.startTime && formData.endTime && (
        <div className={`flex items-center gap-2 text-sm ${checkingAvailability ? 'text-yellow-600' : 'text-green-600'}`}>
          {checkingAvailability ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Checking availability...</span>
            </>
          ) : lastCheckedTime ? (
            <>
              <i className="fas fa-check-circle"></i>
              <span>Slot available ✓</span>
            </>
          ) : null}
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
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none"
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
          max={facility?.capacity}
          value={formData.expectedAttendees}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
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
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
          />
          <button 
            type="button" 
            onClick={addEquipment} 
            className="bg-gray-900 text-white px-5 rounded-lg hover:bg-gray-800 transition-colors duration-200"
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

      {/* Booking Summary */}
      {formData.bookingDate && formData.startTime && formData.endTime && !checkingAvailability && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Booking Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>📅 Date: {new Date(formData.bookingDate).toLocaleDateString()}</p>
            <p>⏰ Time: {formData.startTime} - {formData.endTime}</p>
            <p>👥 Attendees: {formData.expectedAttendees || 'Not specified'}</p>
            {user?.userType === 'external' && facility?.pricePerHour > 0 && (
              <p>💰 Estimated: ${facility.pricePerHour * 1} (minimum 1 hour)</p>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={submitting || checkingAvailability || (facility && parseInt(formData.expectedAttendees) > facility.capacity) || !formData.startTime || !formData.endTime}
          className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i>Submitting...</>
          ) : checkingAvailability ? (
            <><i className="fas fa-spinner fa-spin mr-2"></i>Checking...</>
          ) : (
            <><i className="fas fa-paper-plane mr-2"></i>Submit Booking Request</>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BookingForm