import React from 'react'
import FacilityCard from './FacilityCard'

const FacilityList = ({ facilities, loading, error, onRetry }) => {
  // Loading State
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
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
    )
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load facilities</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Try Again
        </button>
      </div>
    )
  }

  // Empty State
  if (facilities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <i className="fas fa-building text-gray-400 text-2xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No facilities found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or check back later for new facilities.
        </p>
      </div>
    )
  }

  // Success State - Grid Layout
  return (
    <div className="space-y-3">
      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        Found {facilities.length} facility{facilities.length !== 1 ? 'ies' : ''}
      </div>
      
      {/* Facilities Grid */}
      <div className="grid grid-cols-1 gap-3">
        {facilities.map((facility, index) => (
          <div
            key={facility._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <FacilityCard facility={facility} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FacilityList