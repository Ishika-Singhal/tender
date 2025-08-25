import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const MyBids = () => {
  const { user } = useAuth()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBids()
  }, [])

  const fetchBids = async () => {
    try {
      setLoading(true)
      const response = await api.get('/bids/me')
      setBids(response.data)
    } catch (error) {
      console.error('Error fetching bids:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBids = bids.filter(bid => {
    if (filter === 'all') return true
    return bid.status === filter
  })

  const getStatusCount = (status) => {
    if (status === 'all') return bids.length
    return bids.filter(b => b.status === status).length
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

 const formatAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0"
  return `₹${Number(amount).toLocaleString()}`
}


  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger'
    }
    return badges[status] || 'badge badge-gray'
  }

  const statusTabs = [
    { key: 'all', label: 'All Bids', count: getStatusCount('all') },
    { key: 'pending', label: 'Pending', count: getStatusCount('pending') },
    { key: 'accepted', label: 'Accepted', count: getStatusCount('accepted') },
    { key: 'rejected', label: 'Rejected', count: getStatusCount('rejected') }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Bids
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track all your submitted bids and their status
            </p>
          </div>
          <Link to="/seller/browse" className="btn btn-primary">
            Browse New Tenders
          </Link>
        </div>

        {/* Stats Summary */}
        {!loading && bids.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg">
                  📊
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {bids.length}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids</p>
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
                    {getStatusCount('accepted')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
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
                    {getStatusCount('pending')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
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
                    {formatAmount(bids.filter(b => b.status === 'accepted').reduce((sum, b) => sum + b.amount, 0))}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {statusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 badge badge-gray">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filter === 'all' ? 'No bids submitted yet' : `No ${filter} bids`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Start by browsing available tenders and submitting your first bid.'
                : `You don't have any ${filter} bids at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/seller/browse" className="btn btn-primary">
                Browse Tenders
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBids.map(bid => (
              <div key={bid._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <Link
                      to={`/tenders/${bid.tenderId._id}`}
                      className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      {bid.tenderId.title}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {bid.tenderId.category} • {bid.tenderId.location}
                    </p>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                        {formatAmount(bid.amount)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your Bid
                      </p>
                    </div>
                    <span className={getStatusBadge(bid.status)}>
                      {bid.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Your Proposal:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {bid.proposal}
                  </p>
                </div>

                {bid.attachments && bid.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Attachments:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {bid.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <span>📎</span>
                          <span>{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
                    <span className="font-medium ml-2">{formatDate(bid.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Tender Budget:</span>
                    <span className="font-medium ml-2">
                      {formatAmount(bid.tenderId.budgetMin)} - {formatAmount(bid.tenderId.budgetMax)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
                    <span className="font-medium ml-2">{formatDate(bid.tenderId.deadline)}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Link
                    to={`/tenders/${bid.tenderId._id}`}
                    className="btn btn-primary text-sm"
                  >
                    View Tender Details
                  </Link>
                </div>

                {bid.status === 'accepted' && (
                  <div className="alert alert-success mt-4">
                    🎉 Congratulations! Your bid has been accepted. The project has been awarded to you!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBids
