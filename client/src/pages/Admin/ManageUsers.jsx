import React, { useState, useEffect } from 'react'
import api from '../../lib/api'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: '',
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

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        ...filters,
        limit: pagination.limit
      }
      const response = await api.get('/admin/users', { params })
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
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

  const handleToggleBlock = async (userId) => {
    try {
      setActionLoading(userId)
      await api.patch(`/admin/users/${userId}/toggle-block`)
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, blocked: !user.blocked }
          : user
      ))
    } catch (error) {
      alert('Failed to update user status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setActionLoading(userId)
      await api.delete(`/admin/users/${userId}`)
      
      // Remove from local state
      setUsers(prev => prev.filter(user => user._id !== userId))
    } catch (error) {
      alert('Failed to delete user')
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

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge badge-danger',
      buyer: 'badge badge-info',
      seller: 'badge badge-success'
    }
    return badges[role] || 'badge badge-gray'
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
            Manage Users
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View, block, and manage all platform users
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Search Users</label>
              <input
                type="text"
                className="input"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <label className="label">Filter by Role</label>
              <select
                className="input"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ role: '', search: '', page: 1 })}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner w-6 h-6 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No users found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">User</th>
                      <th className="table-header-cell">Role</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Joined</th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="table-cell">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="table-cell">
                          <span className={getRoleBadge(user.role)}>
                            {user.role}
                          </span>
                        </td>
                        
                        <td className="table-cell">
                          <span className={`badge ${user.blocked ? 'badge-danger' : 'badge-success'}`}>
                            {user.blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        
                        <td className="table-cell">
                          {formatDate(user.createdAt)}
                        </td>
                        
                        <td className="table-cell">
                          <div className="flex space-x-2">
                            {user.role !== 'admin' && (
                              <>
                                <button
                                  onClick={() => handleToggleBlock(user._id)}
                                  disabled={actionLoading === user._id}
                                  className={`btn text-sm ${
                                    user.blocked ? 'btn-success' : 'btn-secondary'
                                  }`}
                                >
                                  {actionLoading === user._id ? (
                                    <div className="spinner w-4 h-4"></div>
                                  ) : user.blocked ? (
                                    'Unblock'
                                  ) : (
                                    'Block'
                                  )}
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  disabled={actionLoading === user._id}
                                  className="btn btn-danger text-sm"
                                >
                                  {actionLoading === user._id ? (
                                    <div className="spinner w-4 h-4"></div>
                                  ) : (
                                    'Delete'
                                  )}
                                </button>
                              </>
                            )}
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
        {!loading && users.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            Showing {users.length} of {pagination.total} users
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
