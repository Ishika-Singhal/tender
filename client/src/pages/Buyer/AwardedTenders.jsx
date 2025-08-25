import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const AwardedTenders = () => {
  const { user } = useAuth()
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAwardedTenders()
  }, [])

  const fetchAwardedTenders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/tenders', {
        params: { 
          status: 'awarded',
          page: 1, 
          limit: 50,
          sort: '-updatedAt'
        }
      })
      
      // Filter tenders by current user (buyer)
      const userTenders = response.data.tenders.filter(
        tender => tender.buyerId._id === user._id || tender.buyerId === user._id
      )
      
      // Fetch winning bids for each tender
      const tendersWithBids = await Promise.all(
        userTenders.map(async (tender) => {
          try {
            const bidsResponse = await api.get(`/bids/tender/${tender._id}`)
            const winningBid = bidsResponse.data.find(bid => bid.status === 'accepted')
            return { ...tender, winningBid }
          } catch (error) {
            return tender
          }
        })
      )
      
      setTenders(tendersWithBids)
    } catch (error) {
      console.error('Error fetching awarded tenders:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading awarded tenders...</p>
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
            Awarded Tenders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your successfully awarded projects and winning bidders
          </p>
        </div>

        {/* Content */}
        {tenders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No awarded tenders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              When you accept bids on your tenders, they'll appear here.
            </p>
            <div className="space-x-4">
              <Link to="/buyer/tenders" className="btn btn-primary">
                View My Tenders
              </Link>
              <Link to="/buyer/post-tender" className="btn btn-secondary">
                Post New Tender
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-success dark:bg-dark-success text-white rounded-lg">
                    🏆
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {tenders.length}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Awarded</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-light-primary dark:bg-dark-primary text-white rounded-lg">
                    💰
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatAmount(tenders.reduce((sum, t) => sum + (t.winningBid?.amount || 0), 0))}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500 text-white rounded-lg">
                    📊
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {Math.round(tenders.reduce((sum, t) => sum + (t.winningBid?.amount || 0), 0) / tenders.length).toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Award Value</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Awarded Tenders List */}
            <div className="space-y-6">
              {tenders.map((tender) => (
                <div key={tender._id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <Link
                        to={`/tenders/${tender._id}`}
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary"
                      >
                        {tender.title}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {tender.category} • {tender.location}
                      </p>
                    </div>
                    
                    <div className="mt-4 lg:mt-0">
                      <span className="badge badge-success">Awarded</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Project Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Original Budget:</span>
                          <span className="font-medium">
                            {formatAmount(tender.budgetMin)} - {formatAmount(tender.budgetMax)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Posted:</span>
                          <span className="font-medium">{formatDate(tender.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Awarded:</span>
                          <span className="font-medium">{formatDate(tender.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Winner Details */}
                    {tender.winningBid && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                          Winning Bidder
                        </h4>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white font-bold">
                            {tender.winningBid.sellerId.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {tender.winningBid.sellerId.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {tender.winningBid.sellerId.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Award Amount:</span>
                            <span className="font-bold text-light-success dark:text-dark-success">
                              {formatAmount(tender.winningBid.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Savings:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatAmount(tender.budgetMax - tender.winningBid.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {tender.description}
                      </p>
                      <div className="flex space-x-2">
                        <Link
                          to={`/buyer/tenders/${tender._id}/bids`}
                          className="btn btn-secondary text-sm"
                        >
                          View All Bids
                        </Link>
                        <Link
                          to={`/tenders/${tender._id}`}
                          className="btn btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AwardedTenders
