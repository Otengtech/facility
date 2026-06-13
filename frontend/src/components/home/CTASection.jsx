import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const CTASection = () => {
  const { isAuthenticated } = useAuth()

  return (
    <section className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Get Started
          </p>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Ready to simplify <span className="text-blue-600">bookings?</span>
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join the teams that stopped managing bookings over email and spreadsheets.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={isAuthenticated ? "/facilities" : "/register"}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-gray-800 transition-all hover:scale-105"
          >
            {isAuthenticated ? "Browse Facilities" : "Get Started Free"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          
          <Link
            to="/my-bookings"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold text-base border border-gray-300 hover:bg-gray-50 transition-all"
          >
            My Bookings
            <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <i className="fas fa-check-circle text-green-500 text-xs"></i>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-check-circle text-green-500 text-xs"></i>
            Free trial available
          </span>
          <span className="flex items-center gap-2">
            <i className="fas fa-check-circle text-green-500 text-xs"></i>
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  )
}

export default CTASection