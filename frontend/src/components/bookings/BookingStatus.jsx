import React from 'react'

const BookingStatus = ({ status }) => {
  const getStatusInfo = () => {
    switch(status) {
      case 'pending':
        return { icon: 'fa-clock', color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending Review' }
      case 'approved':
        return { icon: 'fa-check-circle', color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' }
      case 'rejected':
        return { icon: 'fa-times-circle', color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' }
      case 'confirmed':
        return { icon: 'fa-check-double', color: 'text-blue-600', bg: 'bg-blue-100', text: 'Confirmed' }
      case 'completed':
        return { icon: 'fa-flag-checkered', color: 'text-gray-600', bg: 'bg-gray-100', text: 'Completed' }
      case 'cancelled':
        return { icon: 'fa-ban', color: 'text-red-600', bg: 'bg-red-100', text: 'Cancelled' }
      default:
        return { icon: 'fa-question', color: 'text-gray-600', bg: 'bg-gray-100', text: status }
    }
  }

  const { icon, color, bg, text } = getStatusInfo()

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full ${bg} ${color}`}>
      <i className={`fas ${icon} mr-2`}></i>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}

export default BookingStatus