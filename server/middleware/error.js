const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  console.error('Error:', err)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error = { message, statusCode: 400 }
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = { message: 'File too large. Maximum size is 10MB', statusCode: 400 }
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = { message: 'Too many files. Maximum is 5 files', statusCode: 400 }
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = { message: 'Unexpected file field', statusCode: 400 }
  }

  // Cloudinary errors
  if (err.http_code) {
    error = { message: err.message || 'Cloudinary upload error', statusCode: err.http_code }
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error'
  })
}

export default errorHandler
