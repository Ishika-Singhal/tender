const express = require('express')
const {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  deleteMultiple,
  getCloudinaryConfig,
  getSignedUploadParams
} = require('../controllers/uploadController')
const auth = require('../middleware/auth')

const router = express.Router()

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Upload routes are working!' })
})

// All other upload routes require authentication
router.use(auth)

// Upload single file
router.post('/single', upload.single('file'), uploadSingle)

// Upload multiple files (max 5)
router.post('/multiple', upload.array('files', 5), uploadMultiple)

// Delete single file
router.delete('/:publicId', deleteFile)

// Delete multiple files
router.delete('/', deleteMultiple)

// Get Cloudinary configuration
router.get('/config', getCloudinaryConfig)

// Get signed upload parameters
router.get('/signed-params', getSignedUploadParams)

module.exports = router
