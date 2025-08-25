import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'
import TenderCard from '../../components/TenderCard'
import Filters from '../../components/Filters'

const SellerBrowse = () => {
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: 'open' })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  const fetchTenders = async (filterParams = { status: 'open' }, page = 1) => {
    try {
      setLoading(true)
      const params = { ...filterParams, page, limit: pagination.limit }
      const response = await api.get('/tenders', { params })
      
      setTenders(response.data.tenders)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenders()
  }, [])

  const handleFilter = (newFilters) => {
    const filtersWithStatus = { ...newFilters, status: 'open' }
    setFilters(filtersWithStatus)
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchTenders(filtersWithStatus, 1)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchTenders(filters, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1)

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    // Previous button
    if (pagination.page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(pagination.page - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Previous
        </button>
      )
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 ${
            i === pagination.page
              ? 'bg-light-primary dark:bg-dark-primary text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    if (pagination.page < pagination.pages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(pagination.page + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Next
        </button>
      )
    }

    return (
      <div className="flex justify-center items-center mt-12">
        <nav className="flex">{pages}</nav>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Browse Tenders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect opportunities that match your skills and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Filters onFilter={handleFilter} loading={loading} />
              
              {/* Tips Card */}
              <div className="card mt-6 bg-light-primary dark:bg-dark-primary text-white">
                <h3 className="font-semibold mb-3">💡 Tips for Success</h3>
                <ul className="text-sm space-y-2 opacity-90">
                  <li>• Read requirements carefully</li>
                  <li>• Highlight relevant experience</li>
                  <li>• Be competitive with pricing</li>
                  <li>• Submit proposals early</li>
                  <li>• Include portfolio samples</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {loading ? (
                    'Loading...'
                  ) : (
                    `Showing ${tenders.length} of ${pagination.total} open tenders`
                  )}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                <select 
                  className="input text-sm py-1"
                  onChange={(e) => {
                    const [field, order] = e.target.value.split(':')
                    const sortParam = order === 'desc' ? `-${field}` : field
                    handleFilter({ ...filters, sort: sortParam })
                  }}
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="deadline:asc">Deadline (Earliest)</option>
                  <option value="budgetMax:desc">Budget (High to Low)</option>
                  <option value="budgetMax:asc">Budget (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tenders.length === 0 ? (
              /* No Results */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No tenders found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more opportunities.
                </p>
                <button
                  onClick={() => handleFilter({ status: 'open' })}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Tender Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tenders.map(tender => (
                    <div key={tender._id} className="relative">
                      <TenderCard tender={tender} />
                      {/* Apply Button Overlay for Sellers */}
                      <div className="absolute top-4 right-4">
                        <Link
                          to={`/seller/apply/${tender._id}`}
                          className="btn btn-success text-sm shadow-lg"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerBrowse
