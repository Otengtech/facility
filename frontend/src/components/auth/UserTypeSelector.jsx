import React from 'react'

const UserTypeSelector = ({ userType, setUserType }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        type="button"
        onClick={() => setUserType('internal')}
        className={`flex-1 py-3 rounded-lg border-2 transition ${
          userType === 'internal'
            ? 'border-blue-600 bg-blue-50 text-blue-600'
            : 'border-gray-300 text-gray-600 hover:border-blue-300'
        }`}
      >
        <i className="fas fa-user-graduate text-xl mb-1 block"></i>
        <span className="font-semibold">Internal User</span>
        <p className="text-xs mt-1">Student or Staff</p>
      </button>
      
      <button
        type="button"
        onClick={() => setUserType('external')}
        className={`flex-1 py-3 rounded-lg border-2 transition ${
          userType === 'external'
            ? 'border-blue-600 bg-blue-50 text-blue-600'
            : 'border-gray-300 text-gray-600 hover:border-blue-300'
        }`}
      >
        <i className="fas fa-building text-xl mb-1 block"></i>
        <span className="font-semibold">External User</span>
        <p className="text-xs mt-1">Organization/Public</p>
      </button>
    </div>
  )
}

export default UserTypeSelector