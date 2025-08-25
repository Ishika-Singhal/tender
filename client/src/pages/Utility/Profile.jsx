import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const Profile = () => {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [activeTab, setActiveTab] = useState('profile')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (message.text) setMessage({ type: '', text: '' })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // This would typically be a PUT request to update profile
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update profile. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // Validation
    if (formData.newPassword.length < 6) {
      setMessage({ 
        type: 'error', 
        text: 'New password must be at least 6 characters long' 
      })
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'New passwords do not match' 
      })
      setLoading(false)
      return
    }

    try {
      // This would typically be a PUT request to change password
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      })
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update password. Please check your current password.' 
      })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-light-primary dark:bg-dark-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* User Info Card */}
            <div className="card mt-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-light-primary dark:bg-dark-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {user?.email || 'user@example.com'}
                </p>
                <span className={`badge ${
                  user?.role === 'admin' ? 'badge-danger' :
                  user?.role === 'buyer' ? 'badge-info' : 'badge-success'
                }`}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                {message.text}
              </div>
            )}

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Profile Information
                </h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="input"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Changing your email may require verification
                    </p>
                  </div>

                  <div>
                    <label className="label">Account Type</label>
                    <div className="mt-1">
                      <span className={`badge ${
                        user?.role === 'admin' ? 'badge-danger' :
                        user?.role === 'buyer' ? 'badge-info' : 'badge-success'
                      }`}>
                        {user?.role || 'user'}
                      </span>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Contact support to change your account type
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex items-center"
                    >
                      {loading && <div className="spinner mr-2"></div>}
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Security Settings
                </h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      required
                      className="input"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      required
                      className="input"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      className="input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex items-center"
                    >
                      {loading && <div className="spinner mr-2"></div>}
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>

                {/* Security Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Last login</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Today at 2:30 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Account created</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Two-factor authentication</span>
                      <span className="badge badge-gray">Not enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive email updates about your account activity
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Bid Notifications
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified when you receive new bids
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Marketing Communications
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Display Preferences
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Language
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Choose your preferred language
                          </p>
                        </div>
                        <select className="input w-32">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Time Zone
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Set your local time zone
                          </p>
                        </div>
                        <select className="input w-48">
                          <option>GMT+05:30 (India)</option>
                          <option>GMT+00:00 (UTC)</option>
                          <option>GMT-05:00 (EST)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn btn-primary">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
