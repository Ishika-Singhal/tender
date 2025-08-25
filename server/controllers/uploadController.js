const cloudinary = require('../config/cloudinary')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  }
})

// UNSIGNED UPLOAD - NO SIGNATURE NEEDED
const uploadSingle = async (req, res) => {
  try {
    console.log('📤 Starting unsigned upload')
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    console.log('📁 File info:', {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    })

    // Convert to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    
    // Use unsigned upload preset - NO SIGNATURE REQUIRED
    const result = await cloudinary.uploader.unsigned_upload(fileStr, 'tender_infinity_preset', {
      resource_type: 'auto'
    })

    console.log('✅ Upload successful:', result.public_id)

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
    console.error('❌ Upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}

// Multiple file unsigned upload
const uploadMultiple = async (req, res) => {
  try {
    console.log('📤 Starting multiple unsigned upload')
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    const uploadPromises = req.files.map(async (file) => {
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      
      const result = await cloudinary.uploader.unsigned_upload(fileStr, 'tender_infinity_preset', {
        resource_type: 'auto'
      })

      return {
        url: result.secure_url,
        publicId: result.public_id,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        resourceType: result.resource_type,
        format: result.format
      }
    })

    const results = await Promise.all(uploadPromises)
    console.log('✅ All files uploaded successfully')
    res.json(results)
  } catch (error) {
    console.error('❌ Multiple upload error:', error)
    res.status(500).json({ error: error.message || 'Upload failed' })
  }
}

// Rest of the functions remain the same
const deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params
    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' })
    }

    const result = await cloudinary.uploader.destroy(publicId)
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully', result })
    } else {
      res.status(404).json({ error: 'File not found' })
    }
  } catch (error) {
    console.error('❌ Delete error:', error)
    res.status(500).json({ error: error.message })
  }
}

const deleteMultiple = async (req, res) => {
  try {
    const { publicIds } = req.body
    if (!publicIds || !Array.isArray(publicIds)) {
      return res.status(400).json({ error: 'Public IDs array required' })
    }

    const result = await cloudinary.api.delete_resources(publicIds)
    res.json({ message: 'Files deleted', result })
  } catch (error) {
    console.error('❌ Multiple delete error:', error)
    res.status(500).json({ error: error.message })
  }
}

const getCloudinaryConfig = async (req, res) => {
  try {
    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'tender_infinity_preset'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getSignedUploadParams = async (req, res) => {
  try {
    res.json({
      timestamp: Math.round(Date.now() / 1000),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'tender_infinity_preset'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  deleteMultiple,
  getCloudinaryConfig,
  getSignedUploadParams
}
