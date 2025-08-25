import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import CloudinaryUploader from '../../components/CloudinaryUploader'
import FileViewer from '../../components/FileViewer'

const PostTender = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    location: '',
    deadline: '',
    documents: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'IT & Software',
    'Construction',
    'Manufacturing',
    'Services',
    'Healthcare',
    'Education',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleFileUpload = (uploadedFiles) => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...uploadedFiles]
    }))
  }

  const handleFileRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (Number(formData.budgetMax) < Number(formData.budgetMin)) {
      setError('Maximum budget must be greater than minimum budget')
      setLoading(false)
      return
    }

    const deadlineDate = new Date(formData.deadline)
    if (deadlineDate <= new Date()) {
      setError('Deadline must be in the future')
      setLoading(false)
      return
    }

    try {
      const tenderData = {
        ...formData,
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax),
        deadline: new Date(formData.deadline).toISOString()
      }
      
      await api.post('/tenders', tenderData)
      navigate('/buyer/tenders')
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create tender')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Post New Tender
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create a detailed tender to attract qualified sellers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Basic Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="label">
                  Tender Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="input"
                  placeholder="Enter a clear, descriptive title for your tender"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.title.length}/200 characters
                </p>
              </div>

              <div>
                <label htmlFor="category" className="label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="input"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="input resize-none"
                  placeholder="Provide detailed information about your requirements, scope of work, deliverables, timeline, and any specific skills needed..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                ></textarea>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.description.length}/2000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Budget and Location */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Budget and Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budgetMin" className="label">
                  Minimum Budget (₹) *
                </label>
                <input
                  type="number"
                  id="budgetMin"
                  name="budgetMin"
                  required
                  min="0"
                  className="input"
                  placeholder="0"
                  value={formData.budgetMin}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="budgetMax" className="label">
                  Maximum Budget (₹) *
                </label>
                <input
                  type="number"
                  id="budgetMax"
                  name="budgetMax"
                  required
                  min="0"
                  className="input"
                  placeholder="100000"
                  value={formData.budgetMax}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="location" className="label">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="input"
                placeholder="Enter city, state, or region"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Timeline
            </h2>
            
            <div>
              <label htmlFor="deadline" className="label">
                Application Deadline *
              </label>
              <input
                type="datetime-local"
                id="deadline"
                name="deadline"
                required
                className="input"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Set when applications should close for this tender
              </p>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Supporting Documents
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="label">
                  Upload Documents (Optional)
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload relevant documents such as requirements, specifications, or reference materials.
                </p>
                
                <CloudinaryUploader
                  onUpload={handleFileUpload}
                  maxFiles={5}
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
                  maxSize={10 * 1024 * 1024} // 10MB
                />
              </div>

              {formData.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Uploaded Documents ({formData.documents.length})
                  </h4>
                  <FileViewer
                    files={formData.documents}
                    onRemove={handleFileRemove}
                    showRemove={true}
                    showPreview={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/buyer/tenders')}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 flex items-center justify-center"
            >
              {loading && <div className="spinner mr-2"></div>}
              {loading ? 'Creating Tender...' : 'Post Tender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostTender
