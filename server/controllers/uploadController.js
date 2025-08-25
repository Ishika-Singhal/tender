import { cloudinary } from '../config/cloudinary.js'
import multer from 'multer'
import streamifier from 'streamifier'

// Multer configuration for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, DOC, DOCX, and TXT files are allowed.'), false)
    }
  }
})

// Upload single file to Cloudinary
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // Create upload stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto', // Automatically detect file type
            folder: 'tender-infinity', // Organize files in a folder
            use_filename: true,
            unique_filename: true
          },
          (error, result) => {
            if (result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        )

        streamifier.createReadStream(buffer).pipe(stream)
      })
    }

    const result = await streamUpload(req.file.buffer)
    
    // Return useful file information
    const fileInfo = {
      url: result.secure_url,
      publicId: result.public_id,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      resourceType: result.resource_type,
      format: result.format
    }

    res.json(fileInfo)
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}

// Upload multiple files
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'tender-infinity',
            use_filename: true,
            unique_filename: true
          },
          (error, result) => {
            if (result) {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                name: file.originalname,
                size: file.size,
                type: file.mimetype,
                resourceType: result.resource_type,
                format: result.format
              })
            } else {
              reject(error)
            }
          }
        )

        streamifier.createReadStream(file.buffer).pipe(stream)
      })
    })

    const results = await Promise.all(uploadPromises)
    res.json(results)
  } catch (error) {
    console.error('Multiple upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}

// Delete file from Cloudinary
const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params
    const { resourceType = 'auto' } = req.query

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' })
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true // Invalidate CDN cache
    })

    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully', result })
    } else {
      res.status(404).json({ error: 'File not found or already deleted' })
    }
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: error.message || 'Delete failed' })
  }
}

// Delete multiple files
const deleteMultiple = async (req, res) => {
  try {
    const { publicIds } = req.body
    const { resourceType = 'auto' } = req.query

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({ error: 'Public IDs array is required' })
    }

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      invalidate: true
    })

    res.json({ message: 'Files deletion completed', result })
  } catch (error) {
    console.error('Multiple delete error:', error)
    res.status(500).json({ error: error.message || 'Delete failed' })
  }
}

// Get Cloudinary configuration for frontend
const getCloudinaryConfig = async (req, res) => {
  try {
    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'tender_infinity_preset' // You need to create this in Cloudinary
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Generate signed upload parameters (for additional security)
const getSignedUploadParams = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const params = {
      timestamp,
      folder: 'tender-infinity',
      resource_type: 'auto'
    }

    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    res.json({
      ...params,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  deleteMultiple,
  getCloudinaryConfig,
  getSignedUploadParams
}
