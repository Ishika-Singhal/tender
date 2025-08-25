import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/api'

const ViewBids = () => {
  const { id } = useParams()
  const [tender, setTender] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTenderAndBids()
  }, [id])

  const fetchTenderAndBids = async () => {
    try {
      setLoading(true)
      const [tenderResponse, bidsResponse] = await Promise.all([
        api.get(`/tenders/${id}`),
        api.get(`/bids/tender/${id}`)
      ])
      
      setTender(tenderResponse.data)
      setBids(bidsResponse.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleBidDecision = async (bidId, action) => {
    try {
      setActionLoading(bidId)
      await api.post(`/bids/${bidId}/decision`, { action })
      
      // Update local state
      if (action === 'accept') {
        setBids(prev => prev.map(bid => ({
          ...bid,
          status: bid._id === bidId ? 'accepted' : 
                  bid.status === 'pending' ? 'rejected' : bid.status
        })))
        setTender(prev => ({ ...prev, status: 'awarded' }))
      } else {
        setBids(prev => prev.map(bid => 
          bid._id === bidId ? { ...bid, status: 'rejected' } : bid
        ))
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to process bid decision')
    } finally {
      setActionLoading(null)
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      accepted: 'badge badge-success',
      rejected: 'badge badge-danger'
    }
    return badges[status] || 'badge badge-gray'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bids...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Error Loading Bids
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/buyer/tenders" className="btn btn-primary">
            Back to My Tenders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/buyer/tenders" className="hover:text-light-primary dark:hover:text-dark-primary">
              My Tenders
            </Link>
            <span className="mx-2">›</span>
            <span>{tender?.title}</span>
            <span className="mx-2">›</span>
            <span>Bids</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Bids for "{tender?.title}"
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review and manage all bids for this tender
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className={`badge ${tender?.status === 'awarded' ? 'badge-success' : 'badge-info'}`}>
                {tender?.status}
              </span>
              <Link
                to={`/tenders/${tender?._id}`}
                className="btn btn-secondary"
              >
                View Tender Details
              </Link>
            </div>
          </div>
        </div>

        {/* Tender Summary */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Range</h3>
              <p className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                {formatAmount(tender.budgetMin)} - {formatAmount(tender.budgetMax)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bids</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {bids.length}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(tender.deadline)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
              <span className={`badge ${tender.status === 'awarded' ? 'badge-success' : 'badge-info'}`}>
                {tender.status}
              </span>
            </div>
          </div>
        </div>

        {/* Bids List */}
        {bids.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No bids received yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sellers haven't submitted any bids for this tender yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <div key={bid._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {bid.sellerId.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {bid.sellerId.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {bid.sellerId.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                        {formatAmount(bid.amount)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bid Amount
                      </p>
                    </div>
                    <span className={getStatusBadge(bid.status)}>
                      {bid.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Proposal:
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {bid.proposal}
                  </p>
                </div>

                {bid.attachments && bid.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Attachments:
                    </h4>
                    <div className="space-y-2">
                      {bid.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-xl">📎</div>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-primary dark:text-dark-primary hover:underline font-medium"
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>Submitted on {formatDate(bid.createdAt)}</span>
                </div>

                {bid.status === 'pending' && tender.status === 'open' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleBidDecision(bid._id, 'reject')}
                      disabled={actionLoading === bid._id}
                      className="btn btn-danger flex-1 flex items-center justify-center"
                    >
                      {actionLoading === bid._id && <div className="spinner mr-2"></div>}
                      Reject
                    </button>
                    <button
                      onClick={() => handleBidDecision(bid._id, 'accept')}
                      disabled={actionLoading === bid._id}
                      className="btn btn-success flex-1 flex items-center justify-center"
                    >
                      {actionLoading === bid._id && <div className="spinner mr-2"></div>}
                      Accept & Award
                    </button>
                  </div>
                )}

                {bid.status === 'accepted' && (
                  <div className="alert alert-success">
                    🎉 This bid has been accepted and the tender has been awarded!
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

export default ViewBids
