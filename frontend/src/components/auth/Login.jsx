import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="fas fa-building text-blue-600 text-4xl"></i>
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 text-sm mt-2">Sign in to your account</p>
        </div>
        
        {/* Login Method Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 rounded-md transition font-medium ${
              loginMethod === 'email' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-envelope mr-2"></i> Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('id')}
            className={`flex-1 py-2 rounded-md transition font-medium ${
              loginMethod === 'id' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-id-card mr-2"></i> Student/Staff ID
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope mr-2 text-gray-400"></i>Email Address
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-id-card mr-2 text-gray-400"></i>Student/Staff ID
              </label>
              <input
                type="text"
                required
                value={credentials.studentStaffId}
                onChange={(e) => setCredentials({ ...credentials, studentStaffId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your ID"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-lock mr-2 text-gray-400"></i>Password
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Signing in...</>
            ) : (
              <><i className="fas fa-sign-in-alt mr-2"></i>Sign In</>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login