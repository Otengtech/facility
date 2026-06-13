import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', studentStaffId: '' })
  const [loginMethod, setLoginMethod] = useState('email')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const loginData = loginMethod === 'email' 
      ? { email: credentials.email, password: credentials.password }
      : { studentStaffId: credentials.studentStaffId, password: credentials.password }
    
    const result = await login(loginData)
    
    if (result.success) {
      setTimeout(() => navigate('/'), 1500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        
        {/* Login Method Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2.5 rounded-md transition-all duration-200 font-medium ${
              loginMethod === 'email' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-envelope mr-2"></i> Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('id')}
            className={`flex-1 py-2.5 rounded-md transition-all duration-200 font-medium ${
              loginMethod === 'id' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-id-card mr-2"></i> Student/Staff ID
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Student/Staff ID
              </label>
              <input
                type="text"
                required
                value={credentials.studentStaffId}
                onChange={(e) => setCredentials({ ...credentials, studentStaffId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="Enter your ID"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Signing in...</>
            ) : (
              <><i className="fas fa-arrow-right mr-2"></i>Sign in</>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage