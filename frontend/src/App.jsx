import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from './stores/authStore'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const { isAuthenticated, isLoading, isInitializing, checkAuth, initializeAuth } = useAuthStore()

  useEffect(() => {
    // Clear any existing toast notifications
    toast.dismiss()
    
    initializeAuth() // Set token in headers immediately
    checkAuth()
  }, [checkAuth, initializeAuth])

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App