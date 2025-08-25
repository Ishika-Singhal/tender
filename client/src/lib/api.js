import axios from 'axios'

// This should match your backend port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

console.log('🔗 API Base URL:', API_BASE_URL) // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Remove Content-Type for file uploads - let axios handle it
api.interceptors.request.use(
  (config) => {
    // Debug log
    console.log('🚀 Full request URL:', config.baseURL + config.url)
    
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Don't set Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

export default api
