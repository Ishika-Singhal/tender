import React, { useState, useEffect } from 'react'
import api from '../../lib/api'

const Reports = () => {
  const [stats, setStats] = useState({
    users: { total: 0, buyers: 0, sellers: 0 },
    tenders: { total: 0, open: 0, closed: 0, awarded: 0 },
    bids: { total: 0, pending: 0, accepted: 0, rejected: 0 }
  })
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      setLoading(true)
      
      // Fetch main stats
      const statsResponse = await api.get('/admin/stats')
      setStats(statsResponse.data)
      
      // Fetch recent data for trends (mock data for this example)
      const mockTrends = [
        { month: 'Jan', users: 45, tenders: 12, bids: 23 },
        { month: 'Feb', users: 67, tenders: 18, bids: 34 },
        { month: 'Mar', users: 89, tenders: 25, bids: 45 },
        { month: 'Apr', users: 123, tenders: 34, bids: 67 },
        { month: 'May', users: 156, tenders: 42, bids: 89 },
        { month: 'Jun', users: 189, tenders: 56, bids: 123 }
      ]
      setTrends(mockTrends)
      
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  const formatNumber = (num) => {
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Platform performance metrics and insights
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg">
                👥
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                +12.5%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatNumber(stats.users.total)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Total Users</p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span>{formatNumber(stats.users.buyers)} Buyers</span>
              <span className="mx-2">•</span>
              <span>{formatNumber(stats.users.sellers)} Sellers</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-light-success dark:bg-dark-success text-white rounded-lg">
                📋
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                +8.3%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatNumber(stats.tenders.total)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Total Tenders</p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span>{formatNumber(stats.tenders.open)} Open</span>
              <span className="mx-2">•</span>
              <span>{formatNumber(stats.tenders.awarded)} Awarded</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 text-white rounded-lg">
                💰
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                +15.7%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatNumber(stats.bids.total)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Total Bids</p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span>{formatNumber(stats.bids.accepted)} Accepted</span>
              <span className="mx-2">•</span>
              <span>{formatNumber(stats.bids.pending)} Pending</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500 text-white rounded-lg">
                📈
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                +22.1%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {Math.round((stats.bids.accepted / stats.tenders.total) * 100) || 0}%
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Success Rate</p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tenders to Bids Conversion
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              User Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Registered Users</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(stats.users.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Buyers</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(stats.users.buyers)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active Sellers</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(stats.users.sellers)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Buyer/Seller Ratio</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {stats.users.sellers > 0 ? Math.round(stats.users.buyers / stats.users.sellers * 100) / 100 : 0}:1
                </span>
              </div>
            </div>
          </div>

          {/* Tender Statistics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Tender Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Tenders Posted</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(stats.tenders.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Currently Open</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {formatNumber(stats.tenders.open)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Successfully Awarded</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatNumber(stats.tenders.awarded)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Award Rate</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {stats.tenders.total > 0 ? Math.round((stats.tenders.awarded / stats.tenders.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding Analytics */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Bidding Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {formatNumber(stats.bids.total)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {formatNumber(stats.bids.pending)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {formatNumber(stats.bids.accepted)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                {formatNumber(stats.bids.rejected)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
            </div>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Growth Trends (Last 6 Months)
          </h3>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Month</th>
                  <th className="table-header-cell">New Users</th>
                  <th className="table-header-cell">New Tenders</th>
                  <th className="table-header-cell">New Bids</th>
                  <th className="table-header-cell">Activity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {trends.map((trend, index) => (
                  <tr key={trend.month}>
                    <td className="table-cell font-medium">{trend.month}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <span>{trend.users}</span>
                        {index > 0 && (
                          <span className={`text-xs ${
                            trend.users > trends[index - 1].users 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {trend.users > trends[index - 1].users ? '↗' : '↘'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <span>{trend.tenders}</span>
                        {index > 0 && (
                          <span className={`text-xs ${
                            trend.tenders > trends[index - 1].tenders 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {trend.tenders > trends[index - 1].tenders ? '↗' : '↘'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <span>{trend.bids}</span>
                        {index > 0 && (
                          <span className={`text-xs ${
                            trend.bids > trends[index - 1].bids 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {trend.bids > trends[index - 1].bids ? '↗' : '↘'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {Math.round((trend.users + trend.tenders + trend.bids) / 3)}
                        </span>
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-light-primary dark:bg-dark-primary h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, ((trend.users + trend.tenders + trend.bids) / 3) / 200 * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
