import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const BuyerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTenders: 0,
    openTenders: 0,
    closedTenders: 0,
    awardedTenders: 0,
    totalBids: 0
  })
  const [recentTenders, setRecentTenders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's tenders
      const tendersResponse = await api.get('/tenders', {
        params: { buyerId: user._id, limit: 5 }
      })
      
      const tenders = tendersResponse.data.tenders || []
      setRecentTenders(tenders)
      
      // Calculate stats
      const openTenders = tenders.filter(t => t.status === 'open').length
      const closedTenders = tenders.filter(t => t.status === 'closed').length
      const awardedTenders = tenders.filter(t => t.status === 'awarded').length
      
      // Fetch total bids for user's tenders
      const bidsPromises = tenders.map(tender => 
        api.get(`/bids/tender/${tender._id}`).catch(() => ({ data: [] }))
      )
      const bidsResponses = await Promise.all(bidsPromises)
      const totalBids = bidsResponses.reduce((sum, response) => sum + (response.data?.length || 0), 0)
      
      setStats({
        totalTenders: tenders.length,
        openTenders,
        closedTenders,
        awardedTenders,
        totalBids
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Post New Tender',
      description: 'Create a new tender to find the right seller',
      link: '/buyer/post-tender',
      icon: '📝',
      color: 'bg-light-primary dark:bg-dark-primary'
    },
    {
      title: 'My Tenders',
      description: 'View and manage all your tenders',
      link: '/buyer/tenders',
      icon: '📋',
      color: 'bg-light-success dark:bg-dark-success'
    },
    {
      title: 'Awarded Projects',
      description: 'See all your awarded projects',
      link: '/buyer/awarded',
      icon: '🏆',
      color: 'bg-yellow-500 dark:bg-yellow-600'
    }
  ]

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge badge-success',
      closed: 'badge badge-gray',
      awarded: 'badge badge-info'
    }
    return badges[status] || 'badge badge-gray'
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's an overview of your tender activities
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg">
                    📊
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.totalTenders}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Tenders</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-success dark:bg-dark-success text-white rounded-lg">
                    🟢
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.openTenders}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Open Tenders</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-gray-500 text-white rounded-lg">
                    ⭕
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.closedTenders}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Closed Tenders</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500 text-white rounded-lg">
                    🏆
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.awardedTenders}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Awarded</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500 text-white rounded-lg">
                    💰
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.totalBids}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids</p>
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

            {/* Recent Tenders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Tenders
                </h2>
                <Link
                  to="/buyer/tenders"
                  className="text-light-primary dark:text-dark-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {recentTenders.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No tenders yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start by posting your first tender to find the right seller.
                  </p>
                  <Link to="/buyer/post-tender" className="btn btn-primary">
                    Post Your First Tender
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recentTenders.map((tender) => (
                    <div key={tender._id} className="card hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <Link
                          to={`/tenders/${tender._id}`}
                          className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary line-clamp-2"
                        >
                          {tender.title}
                        </Link>
                        <span className={getStatusBadge(tender.status)}>
                          {tender.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {tender.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                          <span className="font-medium ml-1">
                            ₹{tender.budgetMin.toLocaleString()}-₹{tender.budgetMax.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
                          <span className="font-medium ml-1">
                            {formatDate(tender.deadline)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Link
                          to={`/buyer/tenders/${tender._id}/bids`}
                          className="btn btn-secondary text-sm"
                        >
                          View Bids
                        </Link>
                        <Link
                          to={`/tenders/${tender._id}`}
                          className="btn btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BuyerDashboard
