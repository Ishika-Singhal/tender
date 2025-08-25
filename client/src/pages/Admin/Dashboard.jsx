import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, buyers: 0, sellers: 0 },
    tenders: { total: 0, open: 0, closed: 0, awarded: 0 },
    bids: { total: 0, pending: 0, accepted: 0, rejected: 0 }
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, usersResponse, tendersResponse] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users', { params: { limit: 5 } }),
        api.get('/tenders', { params: { limit: 5, sort: '-createdAt' } })
      ])
      
      setStats(statsResponse.data)
      
      // Create recent activity from users and tenders
      const users = usersResponse.data.users.map(user => ({
        type: 'user_registered',
        data: user,
        timestamp: user.createdAt
      }))
      
      const tenders = tendersResponse.data.tenders.map(tender => ({
        type: 'tender_posted',
        data: tender,
        timestamp: tender.createdAt
      }))
      
      const combined = [...users, ...tenders]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
      
      setRecentActivity(combined)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, block, or delete user accounts',
      link: '/admin/users',
      icon: '👥',
      color: 'bg-light-primary dark:bg-dark-primary'
    },
    {
      title: 'Manage Tenders',
      description: 'Monitor and moderate posted tenders',
      link: '/admin/tenders',
      icon: '📋',
      color: 'bg-light-success dark:bg-dark-success'
    },
    {
      title: 'View Reports',
      description: 'Analytics and platform statistics',
      link: '/admin/reports',
      icon: '📊',
      color: 'bg-yellow-500 dark:bg-yellow-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
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
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage the Tender Infinity platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg">
                👥
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.users.total}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Users
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Buyers:</span>
                <span className="font-medium">{stats.users.buyers}</span>
              </div>
              <div className="flex justify-between">
                <span>Sellers:</span>
                <span className="font-medium">{stats.users.sellers}</span>
              </div>
            </div>
          </div>

          {/* Tenders Stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-light-success dark:bg-dark-success text-white rounded-lg">
                📋
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.tenders.total}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Tenders
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Open:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{stats.tenders.open}</span>
              </div>
              <div className="flex justify-between">
                <span>Awarded:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{stats.tenders.awarded}</span>
              </div>
            </div>
          </div>

          {/* Bids Stats */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 text-white rounded-lg">
                💰
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.bids.total}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Bids
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">{stats.bids.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Accepted:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{stats.bids.accepted}</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 text-white rounded-lg">
                ⚡
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                Healthy
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              System Status
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Response:</span>
                <span className="font-medium">Fast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${action.color} text-white rounded-lg text-2xl`}>
                    {action.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-light-primary dark:group-hover:text-dark-primary">
                      {action.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h2>
            <Link
              to="/admin/reports"
              className="text-light-primary dark:text-dark-primary hover:underline"
            >
              View All Reports
            </Link>
          </div>

          <div className="card">
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No recent activity to display
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'user_registered' ? (
                        <div className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white">
                          👤
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-light-success dark:bg-dark-success rounded-full flex items-center justify-center text-white">
                          📋
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          {activity.type === 'user_registered' ? (
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              New {activity.data.role} registered: {activity.data.name}
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              New tender posted: {activity.data.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                        {activity.type === 'user_registered' ? (
                          <Link
                            to="/admin/users"
                            className="text-light-primary dark:text-dark-primary hover:underline text-sm"
                          >
                            View Users
                          </Link>
                        ) : (
                          <Link
                            to={`/tenders/${activity.data._id}`}
                            className="text-light-primary dark:text-dark-primary hover:underline text-sm"
                          >
                            View Tender
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
