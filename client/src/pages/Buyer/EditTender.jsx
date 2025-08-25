import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'
import CloudinaryUploader from '../../components/CloudinaryUploader'
import FileViewer from '../../components/FileViewer'

const EditTender = () => {
  const { id } = useParams()
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
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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

  useEffect(() => {
    fetchTender()
  }, [id])

  const fetchTender = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/tenders/${id}`)
      const tender = response.data
      
      setFormData({
        title: tender.title || '',
        description: tender.description || '',
        category: tender.category || '',
        budgetMin: tender.budgetMin ? tender.budgetMin.toString() : '',
        budgetMax: tender.budgetMax ? tender.budgetMax.toString() : '',
        location: tender.location || '',
        deadline: tender.deadline ? new Date(tender.deadline).toISOString().slice(0, 16) : '',
        documents: tender.documents || []
      })
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load tender')
    } finally {
      setLoading(false)
    }
  }

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
  setSubmitting(true)
  setError('')

  // Validation
//   if (Number(formData.budgetMax) < Number(formData.budgetMin)) {
//     setError('Maximum budget must be greater than minimum budget')
//     setSubmitting(false)
//     return
//   }

  const deadlineDate = new Date(formData.deadline)
  if (deadlineDate <= new Date()) {
    setError('Deadline must be in the future')
    setSubmitting(false)
    return
  }

  try {
    const tenderData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      location: formData.location,
      deadline: new Date(formData.deadline).toISOString(),
      documents: formData.documents || [] // Ensure documents is always an array
    }
    
    console.log('📤 Sending update request:', tenderData)
    
    await api.patch(`/tenders/${id}/update`, tenderData)
    navigate('/buyer/tenders')
  } catch (error) {
    console.error('❌ Update error:', error.response?.data)
    setError(error.response?.data?.error || 'Failed to update tender')
  } finally {
    setSubmitting(false)
  }
}


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tender...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/buyer/tenders" className="hover:text-light-primary dark:hover:text-dark-primary">
              My Tenders
            </Link>
            <span className="mx-2">›</span>
            <span>Edit Tender</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Tender
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your tender information and requirements
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
                  placeholder="Enter a clear, descriptive title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={200}
                />
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
                  placeholder="Describe your requirements in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                ></textarea>
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
                <CloudinaryUploader
                  onUpload={handleFileUpload}
                  maxFiles={5}
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.txt']}
                  maxSize={10 * 1024 * 1024}
                />
              </div>

              {formData.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Current Documents ({formData.documents.length})
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

          {/* Actions */}
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
              disabled={submitting}
              className="btn btn-primary flex-1 flex items-center justify-center"
            >
              {submitting && <div className="spinner mr-2"></div>}
              {submitting ? 'Updating...' : 'Update Tender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTender
