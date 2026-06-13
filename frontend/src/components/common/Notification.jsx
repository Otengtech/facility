import React, { useEffect } from 'react'

const Notification = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const configs = {
    success: {
      icon: 'fa-check-circle',
      bg: 'bg-green-500',
      textColor: 'text-white'
    },
    error: {
      icon: 'fa-exclamation-circle',
      bg: 'bg-red-500',
      textColor: 'text-white'
    },
    warning: {
      icon: 'fa-exclamation-triangle',
      bg: 'bg-yellow-500',
      textColor: 'text-white'
    },
    info: {
      icon: 'fa-info-circle',
      bg: 'bg-blue-500',
      textColor: 'text-white'
    }
  }

  const config = configs[type] || configs.info

  return (
    <div className={`fixed top-20 right-4 z-50 ${config.bg} rounded-lg shadow-2xl max-w-md animate-slide-in`}>
      <div className="flex items-center p-4">
        <div className="flex-shrink-0">
          <i className={`fas ${config.icon} text-white text-xl`}></i>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div className="w-full bg-white bg-opacity-30 h-1 rounded-b-lg">
        <div className="bg-white h-1 rounded-b-lg animate-progress" style={{ width: '100%', animationDuration: `${duration}ms` }}></div>
      </div>
    </div>
  )
}

export default Notification