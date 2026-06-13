import React, { useState } from 'react'
import { reportService } from '../../services/reportService'
import LoadingSpinner from '../common/LoadingSpinner'
import { toast } from 'react-toastify'

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [groupBy, setGroupBy] = useState('day')
  const [loading, setLoading] = useState(false)
  const [bookingReport, setBookingReport] = useState(null)
  const [utilization, setUtilization] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [activeTab, setActiveTab] = useState('booking')

  const generateReports = async () => {
    setLoading(true)
    try {
      const [bookingRes, utilizationRes, revenueRes] = await Promise.all([
        reportService.getBookingReport(dateRange.startDate, dateRange.endDate, groupBy),
        reportService.getFacilityUtilization(dateRange.startDate, dateRange.endDate),
        reportService.getRevenueReport(dateRange.startDate, dateRange.endDate)
      ])
      setBookingReport(bookingRes.report)
      setUtilization(utilizationRes.utilization)
      setRevenue(revenueRes)
      toast.success('Reports generated successfully')
    } catch (error) {
      console.error('Failed to generate reports:', error)
      toast.error('Failed to generate reports')
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = (format) => {
    // Implement download functionality
    toast.info(`Download as ${format} - Coming soon`)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Report Parameters Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <i className="fas fa-chart-line text-gray-900 text-lg"></i>
            <h3 className="text-lg font-semibold text-gray-900">Report Parameters</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">Configure your report settings</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <i className="fas fa-chart-bar mr-2 text-gray-400"></i>
                Group By
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                <option value="day">Daily</option>
                <option value="month">Monthly</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button 
              onClick={generateReports} 
              className="bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
            >
              <i className="fas fa-chart-bar"></i>
              <span>Generate Reports</span>
            </button>
            {(bookingReport || utilization || revenue) && (
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadReport('pdf')} 
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <i className="fas fa-file-pdf text-red-500"></i>
                  <span>PDF</span>
                </button>
                <button 
                  onClick={() => downloadReport('excel')} 
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                >
                  <i className="fas fa-file-excel text-green-500"></i>
                  <span>Excel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      {(bookingReport?.length > 0 || utilization?.length > 0 || revenue) && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-1">
              <button
                onClick={() => setActiveTab('booking')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'booking'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-calendar-check mr-2"></i>
                Booking Summary
              </button>
              <button
                onClick={() => setActiveTab('utilization')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'utilization'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Facility Utilization
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === 'revenue'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-dollar-sign mr-2"></i>
                Revenue Summary
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Booking Summary Tab */}
            {activeTab === 'booking' && bookingReport && bookingReport.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
                  <div className="text-sm text-gray-500">
                    {dateRange.startDate} to {dateRange.endDate}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rejected</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookingReport.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item._id || 'Total'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.totalBookings}</td>
                          <td className="px-4 py-3 text-sm text-green-600">{item.approved}</td>
                          <td className="px-4 py-3 text-sm text-blue-600">{item.confirmed}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.completed}</td>
                          <td className="px-4 py-3 text-sm text-red-600">{item.rejected}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${item.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Facility Utilization Tab */}
            {activeTab === 'utilization' && utilization && utilization.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Utilization</h3>
                <div className="space-y-5">
                  {utilization.map((item, idx) => {
                    const maxBookings = Math.max(...utilization.map(u => u.totalBookings))
                    const percentage = maxBookings > 0 ? (item.totalBookings / maxBookings) * 100 : 0
                    return (
                      <div key={item.facility._id} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{idx + 1}.</span>
                            <span className="font-semibold text-gray-900">{item.facility.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{item.totalBookings} bookings</span>
                            <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        {item.confirmedBookings && (
                          <div className="mt-1 text-xs text-gray-500">
                            {item.confirmedBookings} confirmed bookings
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Revenue Summary Tab */}
            {activeTab === 'revenue' && revenue && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Total Revenue Card */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-300 text-sm mb-1">Total Revenue</p>
                        <p className="text-4xl font-bold">${revenue.revenue?.totalRevenue || 0}</p>
                        <p className="text-gray-300 text-sm mt-2">
                          From {revenue.revenue?.totalPaidBookings || 0} paid bookings
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <i className="fas fa-chart-line text-2xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Revenue by User Type */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Revenue by User Type</h4>
                    <div className="space-y-3">
                      {revenue.byUserType?.map((type) => (
                        <div key={type._id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600 capitalize">
                              {type._id === 'internal' ? (
                                <><i className="fas fa-user-graduate mr-2"></i>Internal Users</>
                              ) : (
                                <><i className="fas fa-building mr-2"></i>External Users</>
                              )}
                            </span>
                            <span className="text-lg font-semibold text-gray-900">${type.revenue}</span>
                          </div>
                          <div className="text-xs text-gray-500">{type.count} bookings</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-gray-900 h-1.5 rounded-full"
                              style={{
                                width: `${(type.revenue / (revenue.revenue?.totalRevenue || 1)) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-check-circle text-green-600"></i>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{revenue.revenue?.totalPaidBookings || 0}</p>
                          <p className="text-xs text-gray-500">Paid Bookings</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-chart-line text-blue-600"></i>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${revenue.byUserType?.find(t => t._id === 'external')?.revenue || 0}
                          </p>
                          <p className="text-xs text-gray-500">External Revenue</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-chart-simple text-purple-600"></i>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${Math.round((revenue.revenue?.totalRevenue || 0) / 30)}
                          </p>
                          <p className="text-xs text-gray-500">Daily Average</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!bookingReport && !utilization && !revenue && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-chart-line text-gray-400 text-3xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Generated</h3>
          <p className="text-gray-500 mb-4">Select your date range and click generate to view reports</p>
          <button 
            onClick={generateReports} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-chart-bar mr-2"></i> Generate Reports
          </button>
        </div>
      )}
    </div>
  )
}

export default Reports