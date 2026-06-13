import React, { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FacilityList from '../components/facilities/FacilityList'
import FacilityFilters from '../components/facilities/FacilityFilters'
import { facilityService } from '../services/facilityService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const FacilitiesPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  // Memoize fetchFacilities to prevent unnecessary re-renders
  const fetchFacilities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await facilityService.getAllFacilities(filters)
      setFacilities(response.facilities || [])
      setTotalCount(response.facilities?.length || 0)
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
      setError(error.response?.data?.message || 'Failed to load facilities')
      toast.error('Unable to load facilities. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (isAuthenticated) {
      fetchFacilities()
    }
  }, [isAuthenticated, fetchFacilities])

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
  }

  const handleRetry = () => {
    fetchFacilities()
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/facilities' }} replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 md:px-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
              <p className="text-gray-500 mt-1">
                Browse and book available facilities for your events
              </p>
            </div>
            {!loading && !error && facilities.length > 0 && (
              <div className="text-sm text-gray-500">
                <i className="fas fa-building mr-1"></i>
                {totalCount} facility{totalCount !== 1 ? 'ies' : ''} available
              </div>
            )}
          </div>
        </div>
        
        {/* Filters Section */}
        <FacilityFilters onFilter={handleFilter} loading={loading} />
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-3"></i>
            <p className="text-red-700 mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i> Try Again
            </button>
          </div>
        )}
        
        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner />
            <p className="text-gray-500 mt-4">Loading facilities...</p>
          </div>
        )}
        
        {/* Facilities List */}
        {!loading && !error && (
          <FacilityList facilities={facilities} loading={loading} />
        )}
        
        {/* Empty State */}
        {!loading && !error && facilities.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="fas fa-building text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-500 mb-4">
              {Object.keys(filters).length > 0 
                ? "Try adjusting your filters to see more facilities"
                : "No facilities are currently available"}
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <i className="fas fa-undo mr-2"></i> Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FacilitiesPage