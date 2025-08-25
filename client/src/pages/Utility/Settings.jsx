import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    }
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleSave = () => {
    setMessage({ type: 'success', text: 'Settings saved successfully!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const resetToDefaults = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false
      },
      preferences: {
        language: 'en',
        timezone: 'Asia/Kolkata',
        currency: 'INR'
      }
    })
    setMessage({ type: 'info', text: 'Settings reset to defaults!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Customize your platform experience and preferences
          </p>
        </div>

        {message.text && (
          <div className={`alert ${
            message.type === 'success' ? 'alert-success' : 
            message.type === 'error' ? 'alert-error' : 'alert-info'
          } mb-6`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* Appearance Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-light-primary focus:ring-offset-2 ${
                    isDark ? 'bg-light-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-2xl">
                <span title="Light Mode">☀️</span>
                <span className="text-gray-400">|</span>
                <span title="Dark Mode">🌙</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                  Current: {isDark ? 'Dark' : 'Light'} Mode
                </span>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications in browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive important alerts via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Privacy
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Profile Visibility
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Control who can see your profile
                  </p>
                </div>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  className="input w-32"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="contacts">Contacts Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Show Email Address
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display email in your public profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.showEmail}
                  onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                  className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Show Phone Number
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display phone number in your profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.privacy.showPhone}
                  onChange={(e) => handleSettingChange('privacy', 'showPhone', e.target.checked)}
                  className="h-4 w-4 text-light-primary focus:ring-light-primary border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Language
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred language
                  </p>
                </div>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  className="input w-32"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Time Zone
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set your local time zone
                  </p>
                </div>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                  className="input w-48"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Currency
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Default currency for displaying amounts
                  </p>
                </div>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                  className="input w-24"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Account Actions
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Data Export
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download a copy of your account data
                  </p>
                </div>
                <button className="btn btn-secondary">
                  Export Data
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Reset Settings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reset all settings to default values
                  </p>
                </div>
                <button 
                  onClick={resetToDefaults}
                  className="btn btn-secondary"
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-red-200 dark:border-red-800">
                <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="btn btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button 
              onClick={resetToDefaults}
              className="btn btn-secondary"
            >
              Reset All
            </button>
            <button 
              onClick={handleSave}
              className="btn btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
