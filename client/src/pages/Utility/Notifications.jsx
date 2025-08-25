import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Mock notifications data since we don't have a notifications API endpoint
  const mockNotifications = [
    {
      _id: '1',
      type: 'bid_received',
      data: {
        tenderTitle: 'E-commerce Website Development',
        sellerName: 'John Doe'
      },
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      _id: '2',
      type: 'bid_accepted',
      data: {
        tenderTitle: 'Mobile App Development',
        amount: 25000
      },
      read: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
      _id: '3',
      type: 'tender_awarded',
      data: {
        tenderTitle: 'Website Redesign Project',
        buyerName: 'Jane Smith'
      },
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      _id: '4',
      type: 'bid_rejected',
      data: {
        tenderTitle: 'Logo Design Contest',
        reason: 'Budget constraints'
      },
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      _id: '5',
      type: 'tender_closed',
      data: {
        tenderTitle: 'Database Migration Project'
      },
      read: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification._id !== notificationId)
    )
  }

  const clearAllRead = () => {
    setNotifications(prev => 
      prev.filter(notification => !notification.read)
    )
  }

  const formatDate = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      bid_received: '💰',
      bid_accepted: '✅',
      bid_rejected: '❌',
      tender_awarded: '🏆',
      tender_closed: '⭕'
    }
    return icons[type] || '📢'
  }

  const getNotificationMessage = (notification) => {
    const { type, data } = notification
    
    switch (type) {
      case 'bid_received':
        return `New bid received from ${data.sellerName} for "${data.tenderTitle}"`
      case 'bid_accepted':
        return `Your bid of ₹${data.amount?.toLocaleString()} for "${data.tenderTitle}" has been accepted!`
      case 'bid_rejected':
        return `Your bid for "${data.tenderTitle}" has been rejected`
      case 'tender_awarded':
        return `Tender "${data.tenderTitle}" has been awarded to you by ${data.buyerName}`
      case 'tender_closed':
        return `Tender "${data.tenderTitle}" has been closed`
      default:
        return 'New notification'
    }
  }

  const getNotificationColor = (type) => {
    const colors = {
      bid_received: 'border-blue-200 dark:border-blue-800',
      bid_accepted: 'border-green-200 dark:border-green-800',
      bid_rejected: 'border-red-200 dark:border-red-800',
      tender_awarded: 'border-yellow-200 dark:border-yellow-800',
      tender_closed: 'border-gray-200 dark:border-gray-700'
    }
    return colors[type] || 'border-gray-200 dark:border-gray-700'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 badge badge-danger">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Stay updated with your tender and bid activity
            </p>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-secondary text-sm"
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={clearAllRead}
                className="btn btn-secondary text-sm"
              >
                Clear Read
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'read', label: 'Read', count: notifications.length - unreadCount }
              ].map((tab) => (
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

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' 
                ? 'When you have activity on your tenders or bids, notifications will appear here.'
                : `You don't have any ${filter} notifications at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div
                key={notification._id}
                className={`card border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${
                          !notification.read 
                            ? 'font-semibold text-gray-900 dark:text-gray-100' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-light-primary dark:text-dark-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
