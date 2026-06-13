import React, { useState } from 'react'

const FacilityFilters = ({ onFilter, loading }) => {
  const [filters, setFilters] = useState({
    capacity: '',
    equipment: '',
    date: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const activeFilters = {}
    if (filters.capacity) activeFilters.capacity = filters.capacity
    if (filters.equipment) activeFilters.equipment = filters.equipment
    if (filters.date) activeFilters.date = filters.date
    onFilter(activeFilters)
  }

  const handleReset = () => {
    setFilters({ capacity: '', equipment: '', date: '' })
    onFilter({})
  }

  const hasActiveFilters = filters.capacity || filters.equipment || filters.date

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-8 overflow-hidden">
      {/* Filter Header */}
      <div 
        className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <i className="fas fa-sliders-h text-gray-500"></i>
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
      </div>
      
      {/* Filter Content */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-users mr-2 text-gray-400"></i>
                Minimum Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={filters.capacity}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-tools mr-2 text-gray-400"></i>
                Equipment
              </label>
              <input
                type="text"
                name="equipment"
                value={filters.equipment}
                onChange={handleChange}
                placeholder="e.g., projector, wifi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-calendar-day mr-2 text-gray-400"></i>
                Specific Date
              </label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-search mr-2"></i>
              Apply Filters
            </button>
            {hasActiveFilters && (
              <button 
                type="button" 
                onClick={handleReset} 
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-undo-alt mr-2"></i>
                Reset
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default FacilityFilters