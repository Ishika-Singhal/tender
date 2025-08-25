import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const SellerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    acceptedBids: 0,
    rejectedBids: 0,
    totalEarnings: 0
  })
  const [recentBids, setRecentBids] = useState([])
  const [availableTenders, setAvailableTenders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch user's bids
      const bidsResponse = await api.get('/bids/me')
      const bids = bidsResponse.data || []
      setRecentBids(bids.slice(0, 5))
      
      // Calculate stats
      const pendingBids = bids.filter(b => b.status === 'pending').length
      const acceptedBids = bids.filter(b => b.status === 'accepted').length
      const rejectedBids = bids.filter(b => b.status === 'rejected').length
      const totalEarnings = bids
        .filter(b => b.status === 'accepted')
        .reduce((sum, b) => sum + b.amount, 0)
      
      setStats({
        totalBids: bids.length,
        pendingBids,
        acceptedBids,
        rejectedBids,
        totalEarnings
      })

      // Fetch available tenders
      const tendersResponse = await api.get('/tenders', {
        params: { status: 'open', limit: 5, sort: '-createdAt' }
      })
      setAvailableTenders(tendersResponse.data.tenders || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Browse Tenders',
      description: 'Find new opportunities to bid on',
      link: '/seller/browse',
      icon: '🔍',
      color: 'bg-light-primary dark:bg-dark-primary'
    },
    {
      title: 'My Bids',
      description: 'View and track all your submitted bids',
      link: '/seller/bids',
      icon: '💰',
      color: 'bg-light-success dark:bg-dark-success'
    },
    {
      title: 'Profile Settings',
      description: 'Update your profile and skills',
      link: '/profile',
      icon: '👤',
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

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString()}`
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger'
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
            Here's your seller activity overview
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
                      {stats.totalBids}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500 text-white rounded-lg">
                    ⏳
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.pendingBids}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-success dark:bg-dark-success text-white rounded-lg">
                    ✅
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.acceptedBids}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-danger dark:bg-dark-danger text-white rounded-lg">
                    ❌
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {stats.rejectedBids}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600 text-white rounded-lg">
                    💰
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatAmount(stats.totalEarnings)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bids */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Recent Bids
                  </h2>
                  <Link
                    to="/seller/bids"
                    className="text-light-primary dark:text-dark-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {recentBids.length === 0 ? (
                  <div className="card text-center py-8">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No bids submitted yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start by browsing available tenders and submitting your first bid.
                    </p>
                    <Link to="/seller/browse" className="btn btn-primary">
                      Browse Tenders
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBids.map((bid) => (
                      <div key={bid._id} className="card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <Link
                              to={`/tenders/${bid.tenderId._id}`}
                              className="font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary"
                            >
                              {bid.tenderId.title}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Bid: {formatAmount(bid.amount)}
                            </p>
                          </div>
                          <span className={getStatusBadge(bid.status)}>
                            {bid.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Submitted on {formatDate(bid.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Tenders */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Latest Opportunities
                  </h2>
                  <Link
                    to="/seller/browse"
                    className="text-light-primary dark:text-dark-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {availableTenders.map((tender) => (
                    <div key={tender._id} className="card">
                      <div className="mb-3">
                        <Link
                          to={`/tenders/${tender._id}`}
                          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary line-clamp-1"
                        >
                          {tender.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tender.category} • {tender.location}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-light-primary dark:text-dark-primary">
                          {formatAmount(tender.budgetMin)} - {formatAmount(tender.budgetMax)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {formatDate(tender.deadline)}
                        </span>
                      </div>
                      
                      <Link
                        to={`/seller/apply/${tender._id}`}
                        className="btn btn-primary w-full text-sm"
                      >
                        Apply Now
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard
