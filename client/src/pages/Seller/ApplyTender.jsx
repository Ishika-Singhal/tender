import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'

const ApplyTender = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tender, setTender] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    proposal: '',
    attachments: []
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTender()
  }, [id])

  const fetchTender = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tenders/${id}`)
      setTender(response.data)
      
      // Check if user already applied
      const bidsResponse = await api.get('/bids/me')
      const existingBid = bidsResponse.data.find(bid => bid.tenderId._id === id)
      
      if (existingBid) {
        setError('You have already submitted a bid for this tender.')
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load tender')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error && !error.includes('already submitted')) setError('')
  }

  const handleFileUpload = async (files) => {
    if (!files.length) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'tender-infinity')
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData
          }
        )
        
        const data = await response.json()
        return {
          url: data.secure_url,
          name: file.name
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }))
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload files. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validation
    if (Number(formData.amount) < tender.budgetMin || Number(formData.amount) > tender.budgetMax) {
      setError(`Bid amount must be between ₹${tender.budgetMin.toLocaleString()} and ₹${tender.budgetMax.toLocaleString()}`)
      setSubmitting(false)
      return
    }

    try {
      await api.post(`/bids/tender/${id}`, formData)
      navigate('/seller/bids')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit bid')
    } finally {
      setSubmitting(false)
    }
  }

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString()}`
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

  if (error && error.includes('already submitted')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✋</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Already Applied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/seller/bids')}
              className="btn btn-primary"
            >
              View My Bids
            </button>
            <button
              onClick={() => navigate('/seller/browse')}
              className="btn btn-secondary"
            >
              Browse More Tenders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Apply to Tender
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Submit your proposal and win this project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && !error.includes('already submitted') && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              {/* Bid Amount */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Your Bid Amount
                </h2>
                
                <div>
                  <label htmlFor="amount" className="label">
                    Bid Amount (₹) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min={tender?.budgetMin}
                    max={tender?.budgetMax}
                    className="input"
                    placeholder="Enter your bid amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Budget range: {formatAmount(tender?.budgetMin || 0)} - {formatAmount(tender?.budgetMax || 0)}
                  </p>
                </div>
              </div>

              {/* Proposal */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Your Proposal
                </h2>
                
                <div>
                  <label htmlFor="proposal" className="label">
                    Proposal Details *
                  </label>
                  <textarea
                    id="proposal"
                    name="proposal"
                    rows={8}
                    required
                    className="input resize-none"
                    placeholder="Describe your approach, experience, timeline, and why you're the best fit for this project..."
                    value={formData.proposal}
                    onChange={handleChange}
                    maxLength={1000}
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formData.proposal.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Supporting Documents
                </h2>
                
                <div>
                  <label className="label">
                    Upload Portfolio/Documents (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-light-primary dark:text-dark-primary hover:underline">
                          <span>Upload files</span>
                          <input
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e.target.files)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB each
                      </p>
                    </div>
                  </div>

                  {uploading && (
                    <div className="mt-4 flex items-center">
                      <div className="spinner mr-2"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Uploading files...</span>
                    </div>
                  )}

                  {formData.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Uploaded Files:</h4>
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="text-xl">📎</div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/seller/browse')}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="btn btn-primary flex-1 flex items-center justify-center"
                >
                  {submitting && <div className="spinner mr-2"></div>}
                  {submitting ? 'Submitting Bid...' : 'Submit Bid'}
                </button>
              </div>
            </form>
          </div>

          {/* Tender Summary Sidebar */}
          <div className="space-y-6">
            {/* Tender Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Tender Details
              </h3>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                  {tender?.title}
                </h4>
                
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                    <p className="font-medium text-light-primary dark:text-dark-primary">
                      {formatAmount(tender?.budgetMin || 0)} - {formatAmount(tender?.budgetMax || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="font-medium">{tender?.category}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <p className="font-medium">{tender?.location}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
                    <p className="font-medium text-red-600 dark:text-red-400">
                      {tender?.deadline && formatDate(tender.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Info */}
            {tender?.buyerId && (
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

            {/* Tips */}
            <div className="card bg-light-success dark:bg-dark-success text-white">
              <h3 className="font-semibold mb-3">💡 Bidding Tips</h3>
              <ul className="text-sm space-y-2 opacity-90">
                <li>• Be specific about your approach</li>
                <li>• Highlight relevant experience</li>
                <li>• Provide realistic timelines</li>
                <li>• Include portfolio samples</li>
                <li>• Be competitive but fair</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyTender
