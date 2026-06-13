import React from 'react'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    success: 'bg-green-600 hover:bg-green-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  }

  const iconColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    success: 'text-green-600',
    info: 'text-blue-600'
  }

  const icons = {
    danger: 'fa-exclamation-triangle',
    warning: 'fa-exclamation-circle',
    success: 'fa-check-circle',
    info: 'fa-info-circle'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`${iconColors[type]} bg-gray-100 rounded-full p-3`}>
              <i className={`fas ${icons[type]} text-3xl`}></i>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center">{message}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition ${buttonColors[type]}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal