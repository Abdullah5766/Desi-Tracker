import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be set by auth store when user logs in
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - handled by auth store
      console.warn('Unauthorized request:', error.response.data?.message)
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data?.message)
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout')
    }
    
    if (!error.response) {
      console.error('Network error - could not connect to server')
    }
    
    return Promise.reject(error)
  }
)

export default api