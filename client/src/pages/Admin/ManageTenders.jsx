import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

const ManageTenders = () => {
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    page: 1
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [actionLoading, setActionLoading] = useState(null)

  const categories = [
    'IT & Software',
    'Construction',
    'Manufacturing',
    'Services',
    'Healthcare',
    'Education',
    'Other'
  ]

  useEffect(() => {
    fetchTenders()
  }, [filters])

  const fetchTenders = async () => {
    try {
      setLoading(true)
      const params = {
        ...filters,
        limit: pagination.limit
      }
      const response = await api.get('/tenders', { params })
      setTenders(response.data.tenders)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleDeleteTender = async (tenderId) => {
    if (!confirm('Are you sure you want to delete this tender? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(tenderId)
      await api.delete(`/admin/tenders/${tenderId}`)
      
      // Remove from local state
      setTenders(prev => prev.filter(tender => tender._id !== tenderId))
    } catch (error) {
      alert('Failed to delete tender')
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
      open: 'badge badge-success',
      closed: 'badge badge-gray',
      awarded: 'badge badge-info'
    }
    return badges[status] || 'badge badge-gray'
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    for (let i = 1; i <= Math.min(pagination.pages, 5); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border ${
            i === pagination.page
              ? 'bg-light-primary dark:bg-dark-primary text-white border-light-primary dark:border-dark-primary'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="flex justify-center mt-6">
        <div className="flex space-x-1">{pages}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Manage Tenders
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and moderate all tenders on the platform
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">Search Tenders</label>
              <input
                type="text"
                className="input"
                placeholder="Search by title..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <label className="label">Filter by Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="awarded">Awarded</option>
              </select>
            </div>
            
            <div>
              <label className="label">Filter by Category</label>
              <select
                className="input"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', category: '', search: '', page: 1 })}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tenders Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner w-6 h-6 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading tenders...</p>
            </div>
          ) : tenders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No tenders found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Tender</th>
                      <th className="table-header-cell">Posted By</th>
                      <th className="table-header-cell">Category</th>
                      <th className="table-header-cell">Budget</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Posted</th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tenders.map(tender => (
                      <tr key={tender._id}>
                        <td className="table-cell">
                          <div>
                            <Link
                              to={`/tenders/${tender._id}`}
                              className="font-medium text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary line-clamp-1"
                            >
                              {tender.title}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {tender.location}
                            </p>
                          </div>
                        </td>
                        
                        <td className="table-cell">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {tender.buyerId?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {tender.buyerId?.name || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="table-cell">
                          <span className="badge badge-gray text-xs">
                            {tender.category}
                          </span>
                        </td>
                        
                        <td className="table-cell">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {formatAmount(tender.budgetMin)}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              to {formatAmount(tender.budgetMax)}
                            </p>
                          </div>
                        </td>
                        
                        <td className="table-cell">
                          <span className={getStatusBadge(tender.status)}>
                            {tender.status}
                          </span>
                        </td>
                        
                        <td className="table-cell">
                          <div className="text-sm">
                            <p className="text-gray-900 dark:text-gray-100">
                              {formatDate(tender.createdAt)}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              Due: {formatDate(tender.deadline)}
                            </p>
                          </div>
                        </td>
                        
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            <Link
                              to={`/tenders/${tender._id}`}
                              className="btn btn-secondary text-xs"
                            >
                              View
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteTender(tender._id)}
                              disabled={actionLoading === tender._id}
                              className="btn btn-danger text-xs"
                            >
                              {actionLoading === tender._id ? (
                                <div className="spinner w-3 h-3"></div>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>

        {/* Summary Stats */}
        {!loading && tenders.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            Showing {tenders.length} of {pagination.total} tenders
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTenders
