import React, { useState } from 'react'
import api from '../lib/api'

const CloudinaryUploader = ({ 
  onUpload, 
  maxFiles = 5, 
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "Upload Files",
  multiple = true
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [error, setError] = useState('')

  const validateFile = (file) => {
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
    }

    const fileType = file.type
    const fileName = file.name.toLowerCase()
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return fileType.startsWith(type.replace('*', ''))
      }
      return fileName.endsWith(type.replace('.', ''))
    })

    if (!isValidType) {
      throw new Error(`File ${file.name} is not a supported format`)
    }
  }

  const uploadToServer = async (files) => {
    const formData = new FormData()
    
    if (multiple && files.length > 1) {
      // Upload multiple files
      files.forEach(file => {
        formData.append('files', file)
      })
      
      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress({ overall: progress })
        }
      })
      
      return response.data
    } else {
      // Upload single file
      formData.append('file', files[0])
      
      const response = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress({ [files[0].name]: progress })
        }
      })
      
      return [response.data] // Return as array for consistency
    }
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once`)
      return
    }

    setError('')
    setUploading(true)
    setUploadProgress({})

    try {
      // Validate all files first
      files.forEach(validateFile)

      // Upload files to server
      const uploadedFiles = await uploadToServer(files)
      
      onUpload(uploadedFiles)
      setUploadProgress({})
      
      // Reset the input
      e.target.value = ''
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.response?.data?.error || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="cloudinary-uploader">
      <div className="upload-area">
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
            uploading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800' 
              : 'border-gray-300 hover:border-light-primary hover:bg-blue-50 dark:border-gray-600 dark:hover:border-dark-primary dark:hover:bg-blue-900/10'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="spinner w-8 h-8 mb-2"></div>
            ) : (
              <svg className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{uploading ? 'Uploading...' : 'Click to upload'}</span>
              {!uploading && ' or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedTypes.join(', ')} (MAX. {formatFileSize(maxSize)})
            </p>
            {multiple && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Up to {maxFiles} files
              </p>
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {fileName === 'overall' ? 'Uploading files...' : fileName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-light-primary dark:bg-dark-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CloudinaryUploader
