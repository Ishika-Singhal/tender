import express from 'express'
import {
  upload,
  uploadSingle,
  uploadMultiple,
  deleteFile,
  deleteMultiple,
  getCloudinaryConfig,
  getSignedUploadParams
} from '../controllers/upload.controller.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// All upload routes require authentication
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

export default router
