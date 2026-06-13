import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MyBookings from '../components/bookings/MyBookings'
import LoadingSpinner from '../components/common/LoadingSpinner'

const MyBookingsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">View and manage your booking requests</p>
      </div>
      <MyBookings />
    </div>
  )
}

export default MyBookingsPage