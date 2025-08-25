import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TenderCard = ({ tender, showActions = false, onEdit, onClose, onDelete }) => {
  const { user } = useAuth()
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const isExpired = new Date(tender.deadline) < new Date()

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            to={`/tenders/${tender._id}`}
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-light-primary dark:hover:text-dark-primary transition-colors duration-200"
          >
            {tender.title}
          </Link>
          <div className="flex items-center space-x-2 mt-1">
            <span className={getStatusBadge(tender.status)}>
              {tender.status}
            </span>
            {isExpired && tender.status === 'open' && (
              <span className="badge badge-danger">Expired</span>
            )}
          </div>
        </div>
        <span className="badge badge-info">{tender.category}</span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {tender.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Budget:</span>
          <span className="font-medium text-light-primary dark:text-dark-primary">
            {formatBudget(tender.budgetMin, tender.budgetMax)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Location:</span>
          <span className="font-medium">{tender.location}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
          <span className={`font-medium ${isExpired ? 'text-red-600 dark:text-red-400' : ''}`}>
            {formatDate(tender.deadline)}
          </span>
        </div>
        {tender.buyerId && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Posted by:</span>
            <span className="font-medium">{tender.buyerId.name}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3">
        <Link 
          to={`/tenders/${tender._id}`}
          className="btn btn-primary text-sm"
        >
          View Details
        </Link>

        {showActions && (
          <div className="flex space-x-2">
            {tender.status === 'open' && (
              <>
                <button
                  onClick={() => onEdit?.(tender)}
                  className="btn btn-secondary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onClose?.(tender)}
                  className="btn btn-secondary text-sm"
                >
                  Close
                </button>
              </>
            )}
            <button
              onClick={() => onDelete?.(tender)}
              className="btn btn-danger text-sm"
            >
              Delete
            </button>
          </div>
        )}

        {user?.role === 'seller' && tender.status === 'open' && !isExpired && (
          <Link
            to={`/seller/apply/${tender._id}`}
            className="btn btn-success text-sm"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  )
}

export default TenderCard
