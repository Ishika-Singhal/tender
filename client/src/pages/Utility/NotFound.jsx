import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NotFound = () => {
  const { user } = useAuth()

  const getHomeLink = () => {
    if (!user) return '/'
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard'
      case 'buyer':
        return '/buyer/dashboard'
      case 'seller':
        return '/seller/dashboard'
      default:
        return '/'
    }
  }

  const suggestedLinks = [
    { label: 'Browse Tenders', path: '/browse', icon: '🔍' },
    { label: 'About Us', path: '/about', icon: '📖' },
    { label: 'Contact Support', path: '/contact', icon: '💬' }
  ]

  const userSpecificLinks = user ? [
    user.role === 'buyer' && { label: 'My Tenders', path: '/buyer/tenders', icon: '📋' },
    user.role === 'seller' && { label: 'My Bids', path: '/seller/bids', icon: '💰' },
    user.role === 'admin' && { label: 'Admin Dashboard', path: '/admin/dashboard', icon: '⚙️' },
    { label: 'Profile', path: '/profile', icon: '👤' }
  ].filter(Boolean) : []

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-light-primary dark:text-dark-primary mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-6">🔍</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Home Button */}
          <Link
            to={getHomeLink()}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            <span className="mr-2">🏠</span>
            Go to {user ? 'Dashboard' : 'Home'}
          </Link>

          {/* Suggested Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Try these instead:
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {suggestedLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="btn btn-secondary flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User-specific Links */}
          {userSpecificLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Your Account:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {userSpecificLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="btn btn-secondary flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search Box */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Looking for something specific?
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tenders, help topics..."
                className="input pr-12"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `/browse?q=${encodeURIComponent(e.target.value.trim())}`
                  }
                }}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-light-primary dark:hover:text-dark-primary"
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input')
                  if (input.value.trim()) {
                    window.location.href = `/browse?q=${encodeURIComponent(input.value.trim())}`
                  }
                }}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Still can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="btn btn-secondary flex-1 text-sm"
              >
                Contact Support
              </Link>
              <button
                onClick={() => window.history.back()}
                className="btn btn-secondary flex-1 text-sm"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Did you know? 🤔
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The first 404 error was discovered at CERN in 1992. The room where the first web server was located was room 404!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound
