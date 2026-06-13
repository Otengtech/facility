import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AdminDashboard from '../components/admin/AdminDashboard'
import BookingRequests from '../components/admin/BookingRequests'
import Reports from '../components/admin/Reports'
import FacilityManagement from '../components/admin/FacilityManagement'

const AdminPage = () => {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const location = useLocation()

  const tabs = [
    { path: '/admin', name: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/admin/bookings', name: 'Booking Requests', icon: 'fa-calendar-check' },
    { path: '/admin/reports', name: 'Reports', icon: 'fa-file-alt' },
    { path: '/admin/facilities', name: 'Facilities', icon: 'fa-building' }
  ]

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true
    if (path !== '/admin' && location.pathname.startsWith(path)) return true
    return false
  }

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">
              <i className="fas fa-user-shield mr-2 text-blue-600"></i>
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <nav className="flex space-x-4 border-b">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-4 py-2 text-sm font-medium transition ${
                  isActive(tab.path)
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/bookings" element={<BookingRequests />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/facilities" element={<FacilityManagement />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminPage