import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserTypeSelector from '../components/auth/UserTypeSelector'
import { toast } from 'react-toastify'

const RegisterPage = () => {
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
      setTimeout(() => navigate('/'), 1500)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-2">Join FacilityBook today</p>
        </div>
        
        <UserTypeSelector userType={userType} setUserType={setUserType} />
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="+1234567890"
            />
          </div>
          
          {userType === 'internal' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Student/Staff ID
                </label>
                <input
                  type="text"
                  name="studentStaffId"
                  required
                  value={formData.studentStaffId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., STU12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </>
          )}
          
          {userType === 'external' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="Company/Organization name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Minimum 6 characters"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Creating account...</>
            ) : (
              <><i className="fas fa-arrow-right mr-2"></i>Create account</>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage