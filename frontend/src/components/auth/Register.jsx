import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import UserTypeSelector from './UserTypeSelector'
import { toast } from 'react-toastify'

const Register = () => {
  const [userType, setUserType] = useState('internal')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    studentStaffId: '',
    department: '',
    organization: ''
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    const registrationData = {
      userType,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      ...(userType === 'internal' && {
        studentStaffId: formData.studentStaffId,
        department: formData.department
      }),
      ...(userType === 'external' && {
        organization: formData.organization
      })
    }
    
    const result = await register(registrationData)
    
    if (result.success) {
      setTimeout(() => navigate('/'), 2000)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="fas fa-user-plus text-blue-600 text-4xl"></i>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-600 text-sm mt-2">Join us and start booking facilities</p>
        </div>
        
        <UserTypeSelector userType={userType} setUserType={setUserType} />
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-user mr-2 text-gray-400"></i>Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-envelope mr-2 text-gray-400"></i>Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-phone mr-2 text-gray-400"></i>Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
          
          {userType === 'internal' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-id-card mr-2 text-gray-400"></i>Student/Staff ID
                </label>
                <input
                  type="text"
                  name="studentStaffId"
                  required
                  value={formData.studentStaffId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <i className="fas fa-building mr-2 text-gray-400"></i>Department
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </>
          )}
          
          {userType === 'external' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-building mr-2 text-gray-400"></i>Organization
              </label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your company/organization name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-lock mr-2 text-gray-400"></i>Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimum 6 characters"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-check-circle mr-2 text-gray-400"></i>Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Creating Account...</>
            ) : (
              <><i className="fas fa-user-plus mr-2"></i>Register</>
            )}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register