import React, { useState } from 'react'
import api from '../lib/api'

const FileViewer = ({ files, onRemove, showRemove = true, showPreview = true, allowDelete = false }) => {
  const [previewFile, setPreviewFile] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const getFileIcon = (file) => {
    if (file.type?.startsWith('image/') || isImageUrl(file.url)) return '🖼️'
    if (file.type === 'application/pdf' || file.url?.includes('.pdf')) return '📄'
    if (file.type?.includes('word') || file.name?.match(/\.(doc|docx)$/i)) return '📝'
    if (file.type?.includes('excel') || file.name?.match(/\.(xls|xlsx)$/i)) return '📊'
    if (file.type?.includes('powerpoint') || file.name?.match(/\.(ppt|pptx)$/i)) return '📈'
    return '📎'
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageUrl = (url) => {
    return url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  }

  const isImage = (file) => {
    return file.type?.startsWith('image/') || isImageUrl(file.url)
  }

  const isPDF = (file) => {
    return file.type === 'application/pdf' || file.url?.includes('.pdf')
  }

  const canPreview = (file) => {
    return isImage(file) || isPDF(file)
  }

  const openPreview = (file) => {
    if (canPreview(file)) {
      setPreviewFile(file)
    } else {
      // For non-previewable files, open in new tab
      window.open(file.url, '_blank')
    }
  }

  const closePreview = () => {
    setPreviewFile(null)
  }

  const handleDelete = async (file, index) => {
    if (!file.publicId) {
      // If no publicId, just remove from local state
      if (onRemove) onRemove(index)
      return
    }

    if (!confirm(`Are you sure you want to delete "${file.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(file.publicId)
      await api.delete(`/upload/${file.publicId}`)
      
      // Remove from local state
      if (onRemove) onRemove(index)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete file. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const downloadFile = async (file) => {
    try {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name || 'download'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      // Fallback - open in new tab
      window.open(file.url, '_blank')
    }
  }

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No files uploaded yet
      </div>
    )
  }

  return (
    <>
      <div className="file-viewer space-y-3">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="text-2xl flex-shrink-0">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(file.size)}</span>
                  {file.format && (
                    <>
                      <span>•</span>
                      <span>{file.format.toUpperCase()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              {showPreview && canPreview(file) && (
                <button
                  onClick={() => openPreview(file)}
                  className="btn btn-secondary text-xs px-2 py-1"
                  title="Preview file"
                >
                  👁️
                </button>
              )}
              
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="btn btn-secondary text-xs px-2 py-1"
                title="Open in new tab"
              >
                🔗
              </button>
              
              <button
                onClick={() => downloadFile(file)}
                className="btn btn-secondary text-xs px-2 py-1"
                title="Download file"
              >
                📥
              </button>
              
              {showRemove && (onRemove || allowDelete) && (
                <button
                  onClick={() => handleDelete(file, index)}
                  disabled={deleting === file.publicId}
                  className="btn btn-danger text-xs px-2 py-1 flex items-center"
                  title="Delete file"
                >
                  {deleting === file.publicId ? (
                    <div className="spinner w-3 h-3"></div>
                  ) : (
                    '🗑️'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closePreview}>
          <div className="relative max-w-4xl max-h-full w-full h-full p-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
            >
              ✕
            </button>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {previewFile.name}
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-auto">
                {isImage(previewFile) ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain mx-auto"
                    loading="lazy"
                  />
                ) : isPDF(previewFile) ? (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-full border-0"
                    title={previewFile.name}
                  />
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Preview not available for this file type
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(previewFile.size)}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => window.open(previewFile.url, '_blank')}
                    className="btn btn-secondary text-sm"
                  >
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => downloadFile(previewFile)}
                    className="btn btn-primary text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FileViewer
