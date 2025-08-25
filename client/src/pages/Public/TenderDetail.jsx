import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const TenderDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tender, setTender] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTender()
  }, [id])

  const fetchTender = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tenders/${id}`)
      setTender(response.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load tender')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatBudget = (min, max) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
  }

  const getStatusBadge = (status) => {
    const badges = {
      open: 'badge badge-success',
      closed: 'badge badge-gray',
      awarded: 'badge badge-info'
    }
    return badges[status] || 'badge badge-gray'
  }

  const isExpired = tender && new Date(tender.deadline) < new Date()
  const canApply = user?.role === 'seller' && tender?.status === 'open' && !isExpired

  const handleApply = () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'seller') {
      alert('Only sellers can apply to tenders')
      return
    }
    navigate(`/seller/apply/${tender._id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tender details...</p>
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
            Error Loading Tender
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/browse" className="hover:text-light-primary dark:hover:text-dark-primary">
              Browse Tenders
            </Link>
            <span className="mx-2">›</span>
            <span>{tender.title}</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {tender.title}
              </h1>
              <div className="flex items-center space-x-3">
                <span className={getStatusBadge(tender.status)}>
                  {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                </span>
                {isExpired && tender.status === 'open' && (
                  <span className="badge badge-danger">Expired</span>
                )}
                <span className="badge badge-info">{tender.category}</span>
              </div>
            </div>
            
            {canApply && (
              <button
                onClick={handleApply}
                className="btn btn-success mt-4 md:mt-0"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {tender.description}
                </p>
              </div>
            </div>

            {/* Documents */}
            {tender.documents && tender.documents.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Documents
                </h2>
                <div className="space-y-2">
                  {tender.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-2xl">📎</div>
                      <div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-light-primary dark:text-dark-primary hover:underline font-medium"
                        >
                          {doc.name}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons for Non-Sellers */}
            {!canApply && (
              <div className="card bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                  {!user ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Interested in this tender?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please log in or register as a seller to apply.
                      </p>
                      <div className="space-x-4">
                        <Link to="/login" className="btn btn-primary">
                          Login
                        </Link>
                        <Link to="/register" className="btn btn-secondary">
                          Register
                        </Link>
                      </div>
                    </>
                  ) : user.role === 'buyer' ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        You are registered as a buyer
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Only sellers can apply to tenders.
                      </p>
                    </>
                  ) : tender.status !== 'open' ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        This tender is {tender.status}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Applications are no longer accepted.
                      </p>
                    </>
                  ) : isExpired ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Application deadline has passed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This tender expired on {formatDate(tender.deadline)}.
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tender Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tender Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Budget Range
                  </label>
                  <p className="text-lg font-semibold text-light-primary dark:text-dark-primary">
                    {formatBudget(tender.budgetMin, tender.budgetMax)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {tender.location}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {tender.category}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Application Deadline
                  </label>
                  <p className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {formatDate(tender.deadline)}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Posted Date
                  </label>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(tender.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            {tender.buyerId && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Posted By
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {tender.buyerId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {tender.buyerId.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Buyer
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Application CTA */}
            {canApply && (
              <div className="card bg-light-primary dark:bg-dark-primary text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Ready to Apply?
                </h3>
                <p className="mb-4 opacity-90">
                  Submit your proposal and showcase your expertise to win this project.
                </p>
                <button
                  onClick={handleApply}
                  className="btn bg-white text-light-primary hover:bg-gray-100 w-full"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenderDetail
