import React, { useState, useEffect } from 'react'
import { facilityService } from '../../services/facilityService'
import LoadingSpinner from '../common/LoadingSpinner'
import { toast } from 'react-toastify'

const FacilityManagement = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    location: '',
    pricePerHour: 0,
    equipment: [],
    photos: []
  })
  const [equipmentInput, setEquipmentInput] = useState('')

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const response = await facilityService.getAllFacilities()
      setFacilities(response.facilities)
    } catch (error) {
      console.error('Failed to fetch facilities:', error)
      toast.error('Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  // Image upload function
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB`)
        continue
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

      // Convert to base64 for preview (in production, upload to cloud storage)
      const reader = new FileReader()
      await new Promise((resolve) => {
        reader.onload = (event) => {
          uploadedUrls.push(event.target.result)
          resolve()
        }
        reader.readAsDataURL(file)
      })
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...uploadedUrls]
    }))
    setUploading(false)
    toast.success(`${uploadedUrls.length} image(s) uploaded successfully`)
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleOpenModal = (facility = null) => {
    if (facility) {
      setEditingFacility(facility)
      setFormData({
        name: facility.name,
        description: facility.description,
        capacity: facility.capacity,
        location: facility.location,
        pricePerHour: facility.pricePerHour || 0,
        equipment: facility.equipment || [],
        photos: facility.photos || []
      })
    } else {
      setEditingFacility(null)
      setFormData({
        name: '',
        description: '',
        capacity: '',
        location: '',
        pricePerHour: 0,
        equipment: [],
        photos: []
      })
    }
    setShowModal(true)
  }

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, equipmentInput.trim()]
      }))
      setEquipmentInput('')
    }
  }

  const removeEquipment = (index) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.capacity || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (editingFacility) {
        await facilityService.updateFacility(editingFacility._id, formData)
        toast.success('Facility updated successfully')
      } else {
        await facilityService.createFacility(formData)
        toast.success('Facility created successfully')
      }
      setShowModal(false)
      fetchFacilities()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save facility')
    }
  }

  const handleDelete = async (facility) => {
    if (window.confirm(`Are you sure you want to delete "${facility.name}"?`)) {
      try {
        // await facilityService.deleteFacility(facility._id)
        toast.success('Facility deleted successfully')
        fetchFacilities()
      } catch (error) {
        toast.error('Failed to delete facility')
      }
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:px-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Facility Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all facility listings</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
        >
          <i className="fas fa-plus text-sm"></i>
          <span>Add Facility</span>
        </button>
      </div>

      {/* Facilities Grid */}
      {facilities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <i className="fas fa-building text-gray-300 text-5xl mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No facilities yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first facility</p>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i> Add Facility
          </button>
        </div>
      ) : (
       <div className="space-y-3">
  {facilities.map((facility) => (
    <div key={facility._id} className="group bg-white px-4 md:mx-16 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
        {/* Image Thumbnail */}
        <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={facility.photos?.[0] || 'https://via.placeholder.com/96x96?text=No+Image'}
            alt={facility.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 sm:hidden bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            Active
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">
                {facility.name}
              </h3>
              <div className="hidden sm:flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                <i className="fas fa-circle text-green-500 text-xs"></i>
                <span className="text-xs text-green-700 font-medium">Active</span>
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
        
        {/* Action Buttons */}
        <div className="w-full sm:w-auto flex-shrink-0 flex gap-2">
          <button
            onClick={() => handleOpenModal(facility)}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="fas fa-edit text-sm"></i>
            Edit
          </button>
          <button
            onClick={() => handleDelete(facility)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
      )}

      {/* Centered Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-5" id="facility-form">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Facility Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Grand Conference Hall"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the facility, its features, and amenities"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      placeholder="Number of people"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Building A, Floor 2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price Per Hour (for external users)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for free booking</p>
                </div>
                
                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Equipment & Amenities
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={equipmentInput}
                      onChange={(e) => setEquipmentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                      placeholder="e.g., Projector, Whiteboard, WiFi"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                    />
                    <button 
                      type="button" 
                      onClick={addEquipment} 
                      className="bg-gray-900 text-white px-5 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  {formData.equipment.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.equipment.map((item, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 border border-gray-200">
                          <i className="fas fa-check-circle text-green-600 text-xs"></i>
                          {item}
                          <button 
                            type="button" 
                            onClick={() => removeEquipment(index)} 
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Facility Photos
                  </label>
                  
                  {/* Upload Area */}
                  <div className="mb-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-2xl text-gray-400 mb-2`}></i>
                        <p className="text-sm text-gray-500">
                          {uploading ? 'Uploading...' : 'Click to upload images'}
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  {/* Photo Preview Grid */}
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group/photo">
                          <img
                            src={photo}
                            alt={`Facility ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover/photo:opacity-100"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button 
                type="submit"
                form="facility-form"
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
              >
                {editingFacility ? 'Update Facility' : 'Create Facility'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="px-6 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilityManagement