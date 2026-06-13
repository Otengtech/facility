import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/common/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FacilitiesPage from './pages/FacilitiesPage'
import BookingPage from './pages/BookingPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminPage from './pages/AdminPage'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/booking/:facilityId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App