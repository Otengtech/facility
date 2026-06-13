import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const response = await authService.getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Failed to load user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const { token, user } = response
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      toast.success('Login successful!')
      return { success: true, user }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { token, user } = response
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      toast.success('Registration successful!')
      return { success: true, user }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.info('Logged out successfully')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}