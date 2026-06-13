import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { facilityService } from '../../services/facilityService'
import LoadingSpinner from '../common/LoadingSpinner'

const AvailableFacilities = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      const response = await facilityService.getAllFacilities()
      // Get first 6 facilities or all if less
      setFacilities(response.facilities?.slice(0, 6) || [])
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
      setError('Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Available Facilities
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Choose from our premium spaces
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Discover the perfect space for your next event or meeting
            </p>
          </div>
          
          {/* Skeleton Loaders */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Available Facilities
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Choose from our premium spaces
            </h2>
          </div>
          
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchFacilities}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Empty State
  if (facilities.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Available Facilities
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Choose from our premium spaces
            </h2>
          </div>
          
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <i className="fas fa-building text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500">No facilities available at the moment</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new spaces</p>
          </div>
        </div>
      </section>
    )
  }

  // Success State
  return (
    <section className="py-16 px-6 sm:px-6 md:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Available Facilities
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose from our premium spaces
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover the perfect space for your next event or meeting
          </p>
        </div>

        {/* Facilities List - Using same style as FacilityCard */}
        <div className="space-y-3">
          {facilities.slice(0, 6).map((facility) => (
            <div 
              key={facility._id} 
              className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-4">
                {/* Image Thumbnail */}
                <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={facility.photos?.[0] || 'https://via.placeholder.com/96x96?text=No+Image'} 
                    alt={facility.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Info Section */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">
                        {facility.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                        <i className="fas fa-circle text-green-500 text-xs"></i>
                        <span className="text-xs text-green-700 font-medium">Available</span>
                      </div>
                    </div>
                    
                    {/* Price - Mobile */}
                    {facility.pricePerHour > 0 && (
                      <div className="sm:hidden">
                        <p className="text-lg font-bold text-gray-900">
                          ${facility.pricePerHour}
                          <span className="text-xs font-normal text-gray-500">/hour</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 line-clamp-2">
                    {facility.description?.substring(0, 80)}
                    {facility.description?.length > 80 ? '...' : ''}
                  </p>
                  
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                      <i className="fas fa-users text-gray-400 text-xs sm:text-sm"></i>
                      <span>{facility.capacity} people</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                      <i className="fas fa-map-marker-alt text-gray-400 text-xs sm:text-sm"></i>
                      <span className="truncate max-w-[120px] sm:max-w-none">{facility.location}</span>
                    </div>
                    {facility.equipment?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                        <i className="fas fa-tools text-gray-400 text-xs sm:text-sm"></i>
                        <span>{facility.equipment.length} items</span>
                      </div>
                    )}
                    {/* Price - Desktop */}
                    {facility.pricePerHour > 0 && (
                      <div className="hidden sm:block ml-auto">
                        <p className="text-sm font-medium text-gray-500">Starting from</p>
                        <p className="text-lg font-bold text-gray-900">
                          ${facility.pricePerHour}
                          <span className="text-xs font-normal text-gray-500">/hour</span>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Equipment Tags */}
                  {facility.equipment?.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1.5">
                      {facility.equipment.slice(0, 3).map((item, idx) => (
                        <span 
                          key={idx} 
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                      {facility.equipment.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md">
                          +{facility.equipment.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Book Button */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  <Link
                    to={`/booking/${facility._id}`}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Book Now</span>
                    <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link 
            to="/facilities"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors font-medium"
          >
            View All Facilities
            <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AvailableFacilities