import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import TenderCard from '../../components/TenderCard'

const MyTenders = () => {
  const { user } = useAuth()
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedTender, setSelectedTender] = useState(null)
  const [modalAction, setModalAction] = useState('')

  useEffect(() => {
    fetchTenders()
  }, [])

  const fetchTenders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/tenders', {
        params: { 
          page: 1, 
          limit: 50,
          sort: '-createdAt'
        }
      })
      
      // Filter tenders by current user (buyer)
      const userTenders = response.data.tenders.filter(
        tender => tender.buyerId._id === user._id || tender.buyerId === user._id
      )
      setTenders(userTenders)
    } catch (error) {
      console.error('Error fetching tenders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTenders = tenders.filter(tender => {
    if (filter === 'all') return true
    return tender.status === filter
  })

  const handleEdit = (tender) => {
    // Navigate to edit form - for now just show alert
    alert('Edit functionality would redirect to edit form')
  }

  const handleClose = (tender) => {
    setSelectedTender(tender)
    setModalAction('close')
    setShowModal(true)
  }

  const handleDelete = (tender) => {
    setSelectedTender(tender)
    setModalAction('delete')
    setShowModal(true)
  }

  const confirmAction = async () => {
    try {
      if (modalAction === 'close') {
        await api.post(`/tenders/${selectedTender._id}/close`)
        setTenders(prev => 
          prev.map(t => 
            t._id === selectedTender._id ? { ...t, status: 'closed' } : t
          )
        )
      } else if (modalAction === 'delete') {
        await api.delete(`/tenders/${selectedTender._id}`)
        setTenders(prev => prev.filter(t => t._id !== selectedTender._id))
      }
      setShowModal(false)
      setSelectedTender(null)
      setModalAction('')
    } catch (error) {
      console.error(`Error ${modalAction}ing tender:`, error)
      alert(`Failed to ${modalAction} tender. Please try again.`)
    }
  }

  const getStatusCount = (status) => {
    if (status === 'all') return tenders.length
    return tenders.filter(t => t.status === status).length
  }

  const statusTabs = [
    { key: 'all', label: 'All Tenders', count: getStatusCount('all') },
    { key: 'open', label: 'Open', count: getStatusCount('open') },
    { key: 'closed', label: 'Closed', count: getStatusCount('closed') },
    { key: 'awarded', label: 'Awarded', count: getStatusCount('awarded') }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Tenders
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage all your posted tenders
            </p>
          </div>
          <Link to="/buyer/post-tender" className="btn btn-primary">
            Post New Tender
          </Link>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : filteredTenders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filter === 'all' ? 'No tenders posted yet' : `No ${filter} tenders`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Start by posting your first tender to find qualified sellers.'
                : `You don't have any ${filter} tenders at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link to="/buyer/post-tender" className="btn btn-primary">
                Post Your First Tender
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map(tender => (
              <TenderCard
                key={tender._id}
                tender={tender}
                showActions={true}
                onEdit={handleEdit}
                onClose={handleClose}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Confirm {modalAction === 'close' ? 'Close' : 'Delete'} Tender
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to {modalAction} "{selectedTender?.title}"? 
                {modalAction === 'close' 
                  ? ' This will prevent new bids from being submitted.'
                  : ' This action cannot be undone.'
                }
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`btn ${modalAction === 'delete' ? 'btn-danger' : 'btn-primary'} flex-1`}
                >
                  {modalAction === 'close' ? 'Close Tender' : 'Delete Tender'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTenders
