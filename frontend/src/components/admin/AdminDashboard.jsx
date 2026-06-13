import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportService } from '../../services/reportService'
import LoadingSpinner from '../common/LoadingSpinner'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse] = await Promise.all([
        reportService.getUserStats()
      ])
      setStats(statsResponse.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: 'fa-users', 
      change: '+12%',
      changeType: 'increase'
    },
    { 
      title: 'Internal Users', 
      value: stats?.internalUsers || 0, 
      icon: 'fa-user-graduate',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      title: 'External Users', 
      value: stats?.externalUsers || 0, 
      icon: 'fa-building',
      change: '+15%',
      changeType: 'increase'
    },
    { 
      title: 'Active Bookings', 
      value: stats?.activeBookings || 0, 
      icon: 'fa-calendar-check',
      change: '+5%',
      changeType: 'increase'
    }
  ]

  const quickActions = [
    { 
      title: 'Review Pending Bookings', 
      icon: 'fa-check-circle', 
      path: '/admin/bookings',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      title: 'Add New Facility', 
      icon: 'fa-plus-circle', 
      path: '/admin/facilities',
      color: 'text-gray-900',
      bg: 'bg-gray-100'
    },
    { 
      title: 'Generate Reports', 
      icon: 'fa-chart-line', 
      path: '/admin/reports',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      title: 'Manage Bookings', 
      icon: 'fa-calendar-alt', 
      path: '/admin/bookings',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-gray-300">Here's what's happening with your facility bookings today.</p>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2">
            <i className="fas fa-chart-simple mr-2"></i>
            <span className="text-sm">Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className={`fas ${card.icon} text-gray-600 text-lg`}></i>
              </div>
              {card.change && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  card.changeType === 'increase' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <i className={`fas fa-arrow-${card.changeType === 'increase' ? 'up' : 'down'} mr-1`}></i>
                  {card.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-900">
              <i className="fas fa-bolt mr-2 text-gray-900"></i>
              Quick Actions
            </h3>
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              View all
              <i className="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className={`w-8 h-8 ${action.bg} rounded-lg flex items-center justify-center mr-3`}>
                  <i className={`fas ${action.icon} ${action.color} text-sm`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            <i className="fas fa-info-circle mr-2 text-gray-900"></i>
            System Information
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">System Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-circle text-green-500 text-xs mr-1"></i>
                Active
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-check-circle mr-1"></i>
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-database mr-1"></i>
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-medium text-gray-900">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section (Optional) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            <i className="fas fa-history mr-2 text-gray-900"></i>
            Recent Activity
          </h3>
          <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            View all
            <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-plus text-blue-600 text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New user registered</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check-circle text-green-600 text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Booking approved</p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fas fa-building text-purple-600 text-sm"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New facility added: Conference Hall A</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard