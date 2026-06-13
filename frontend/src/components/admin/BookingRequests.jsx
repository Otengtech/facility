import React, { useState, useEffect } from 'react'
import { adminBookingService } from '../../services/bookingService'
import LoadingSpinner from '../common/LoadingSpinner'
import { toast } from 'react-toastify'

const BookingRequests = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentReference, setPaymentReference] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await adminBookingService.getAllBookings({ status: filter })
      setBookings(response.bookings)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId) => {
    if (window.confirm('Approve this booking?')) {
      try {
        await adminBookingService.updateBookingStatus(bookingId, 'approved')
        toast.success('Booking approved successfully')
        fetchBookings()
      } catch (error) {
        toast.error('Failed to approve booking')
      }
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    try {
      await adminBookingService.updateBookingStatus(selectedBooking._id, 'rejected', rejectionReason)
      toast.success('Booking rejected')
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedBooking(null)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to reject booking')
    }
  }

  const handleConfirmPayment = async () => {
    if (!paymentReference.trim()) {
      toast.error('Please enter payment reference')
      return
    }
    try {
      await adminBookingService.confirmPayment(selectedBooking._id, paymentReference)
      toast.success('Payment confirmed, booking confirmed')
      setShowPaymentModal(false)
      setPaymentReference('')
      setSelectedBooking(null)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to confirm payment')
    }
  }

  const handleComplete = async (bookingId) => {
    if (window.confirm('Mark this booking as completed?')) {
      try {
        await adminBookingService.markCompleted(bookingId)
        toast.success('Booking marked as completed')
        fetchBookings()
      } catch (error) {
        toast.error('Failed to mark as completed')
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'fa-clock',
      approved: 'fa-check-circle',
      rejected: 'fa-times-circle',
      confirmed: 'fa-check-double',
      completed: 'fa-flag-checkered'
    }
    return icons[status] || 'fa-circle'
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          {['pending', 'approved', 'confirmed', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-all duration-200 ${
                filter === status
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`fas ${getStatusIcon(status)} text-xs`}></i>
                <span>{status}</span>
                {filter === status && bookings.length > 0 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                    {bookings.length}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <i className="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-lg">No {filter} bookings found</p>
            <p className="text-sm text-gray-400 mt-1">When bookings appear, they will show here</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-200">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-alt text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                  <i className={`fas ${getStatusIcon(booking.status)} text-xs`}></i>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left Column - Facility Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-building text-gray-500"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.facility.name}</h3>
                        <p className="text-sm text-gray-500">{booking.facility.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <i className="fas fa-user text-gray-400 w-4"></i>
                          <span className="text-gray-600">Booked By:</span>
                          <span className="font-medium text-gray-900">{booking.user.fullName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <i className="fas fa-tag text-gray-400 w-4"></i>
                          <span className="text-gray-600">User Type:</span>
                          <span className={`capitalize font-medium ${
                            booking.user.userType === 'internal' ? 'text-blue-600' : 'text-purple-600'
                          }`}>
                            {booking.user.userType}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <i className="fas fa-envelope text-gray-400 w-4"></i>
                          <span className="text-gray-600">Email:</span>
                          <span className="text-gray-900">{booking.user.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <i className="fas fa-phone text-gray-400 w-4"></i>
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-gray-900">{booking.user.phone}</span>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <i className="fas fa-users text-gray-400 w-4"></i>
                          <span className="text-gray-600">Attendees:</span>
                          <span className="font-medium text-gray-900">{booking.expectedAttendees}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <i className="fas fa-tasks text-gray-400 w-4"></i>
                          <span className="text-gray-600">Purpose:</span>
                          <span className="text-gray-900">{booking.purpose}</span>
                        </p>
                        {booking.equipmentNeeded?.length > 0 && (
                          <p className="flex items-start gap-2">
                            <i className="fas fa-tools text-gray-400 w-4 mt-0.5"></i>
                            <span className="text-gray-600">Equipment:</span>
                            <span className="text-gray-900 flex-1">{booking.equipmentNeeded.join(', ')}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions */}
                  <div className="lg:w-48 flex flex-row lg:flex-col gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking._id)}
                          className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <i className="fas fa-check text-sm"></i>
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowRejectModal(true)
                          }}
                          className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <i className="fas fa-times text-sm"></i>
                          Reject
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'approved' && booking.paymentStatus === 'pending' && booking.totalAmount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowPaymentModal(true)
                        }}
                        className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-credit-card text-sm"></i>
                        Confirm Payment
                      </button>
                    )}
                    
                    {booking.status === 'approved' && (booking.paymentStatus === 'waived' || booking.paymentStatus === 'paid') && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        className="flex-1 lg:w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-flag-checkered text-sm"></i>
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Info if applicable */}
                {booking.totalAmount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-gray-900">${booking.totalAmount}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-700'
                          : booking.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    {booking.paymentReference && (
                      <span className="text-xs text-gray-500">Ref: {booking.paymentReference}</span>
                    )}
                  </div>
                )}

                {/* Rejection Reason */}
                {booking.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-700 flex items-start gap-2">
                      <i className="fas fa-exclamation-circle mt-0.5"></i>
                      <span><strong>Rejection Reason:</strong> {booking.rejectionReason}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-times text-red-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Reject Booking</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-3">
                Please provide a reason for rejecting this booking:
              </p>
              <textarea
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                rows="4"
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={handleReject} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Reject Booking
              </button>
              <button onClick={() => setShowRejectModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-credit-card text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Payment</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-3">
                Enter the payment reference number for this booking:
              </p>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Payment Reference Number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={handleConfirmPayment} className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Confirm Payment
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingRequests