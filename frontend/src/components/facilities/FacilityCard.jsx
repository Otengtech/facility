import React from 'react'
import { useNavigate } from 'react-router-dom'

const FacilityCard = ({ facility }) => {
  const navigate = useNavigate()

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
        {/* Image Thumbnail */}
        <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img 
            src={facility.photos?.[0] || 'https://via.placeholder.com/96x96?text=No+Image'} 
            alt={facility.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Mobile Availability Badge */}
          <div className="absolute top-2 right-2 sm:hidden bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            Available
          </div>
        </div>
        
        {/* Info Section */}
        <div className="flex-1 w-full">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">
                {facility.name}
              </h3>
              {/* Desktop Availability Badge */}
              <div className="hidden sm:flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
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
          
          {/* Details Grid */}
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
          
          {/* Equipment Tags - Only show on larger screens */}
          {facility.equipment?.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mb-3">
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
        
        {/* Action Button */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <button
            onClick={() => navigate(`/booking/${facility._id}`)}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group/btn"
          >
            <span>Book Now</span>
            <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FacilityCard