import React, { useState, useEffect } from 'react'
import { bookingService } from '../../services/bookingService'
import { toast } from 'react-toastify'
import BookingStatus from './BookingStatus'
import ConfirmationModal from '../common/ConfirmationModal'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getUserBookings()
      setBookings(response.bookings)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    try {
      await bookingService.cancelBooking(selectedBooking._id)
      toast.success('Booking cancelled successfully')
      setShowCancelModal(false)
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-yellow-400',
      approved: 'border-green-400',
      rejected: 'border-red-400',
      confirmed: 'border-blue-400',
      completed: 'border-gray-400',
      cancelled: 'border-red-400'
    }
    return colors[status] || 'border-gray-200'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-calendar-alt text-gray-300 text-4xl mb-3"></i>
        <p className="text-gray-500">No bookings found</p>
        <button
          onClick={() => window.location.href = '/facilities'}
          className="mt-3 px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
        >
          Browse Facilities
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div 
          key={booking._id} 
          className={`bg-white rounded-lg border-l-4 ${getStatusColor(booking.status)} border border-gray-200 p-4 hover:shadow-md transition-all duration-200`}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900">
                  {booking.facility.name}
                </h3>
                <BookingStatus status={booking.status} />
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <i className="fas fa-calendar-day w-3 text-gray-400"></i>
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-clock w-3 text-gray-400"></i>
                  {booking.startTime} - {booking.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <i className="fas fa-users w-3 text-gray-400"></i>
                  {booking.expectedAttendees}
                </span>
                {booking.totalAmount > 0 && (
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <i className="fas fa-dollar-sign w-3 text-gray-400"></i>
                    ${booking.totalAmount}
                  </span>
                )}
              </div>

              {/* Quick rejection reason preview */}
              {booking.rejectionReason && (
                <div className="mt-2 text-xs text-red-600 truncate">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {booking.rejectionReason.substring(0, 60)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => {
                  setSelectedBooking(booking)
                  setShowDetailModal(true)
                }}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                title="View Details"
              >
                <i className="fas fa-eye text-sm"></i>
              </button>
              {booking.status === 'pending' && (
                <button
                  onClick={() => {
                    setSelectedBooking(booking)
                    setShowCancelModal(true)
                  }}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Cancel Booking"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message={`Are you sure you want to cancel your booking for ${selectedBooking?.facility?.name} on ${selectedBooking ? new Date(selectedBooking.bookingDate).toLocaleDateString() : ''}? This action cannot be undone.`}
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep It"
      />

      {/* Booking Details Modal - Simplified */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Facility</p>
                  <p className="font-medium text-gray-900">{selectedBooking.facility.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="font-medium text-gray-900">{selectedBooking.facility.location}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="font-medium text-gray-900">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Time</p>
                  <p className="font-medium text-gray-900">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Status</p>
                  <BookingStatus status={selectedBooking.status} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Booking ID</p>
                  <p className="font-mono text-xs text-gray-500">{selectedBooking._id}</p>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-gray-500 text-xs mb-1">Purpose</p>
                <p className="text-sm text-gray-900">{selectedBooking.purpose}</p>
              </div>
              
              {selectedBooking.equipmentNeeded?.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-gray-500 text-xs mb-1">Equipment Needed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.equipmentNeeded.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings