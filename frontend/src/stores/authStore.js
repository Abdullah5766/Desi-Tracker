import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: true,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', {
            email,
            password
          })

          const { user, token } = response.data
          const currentState = get()

          // If this is a different user than the previous one, clear persisted data
          if (currentState.user && currentState.user.id !== user.id) {
            const { useCalorieStore } = await import('./calorieStore')
            const { useFoodStore } = await import('./foodStore')
            useCalorieStore.getState().clearCalculatorData()
            useFoodStore.getState().resetStore()
          }

          // Set auth state
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitializing: false
          })

          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          toast.success('Login successful!')
          return { success: true }

        } catch (error) {
          set({ isLoading: false, isInitializing: false })
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/register', {
            username,
            email,
            password
          })

          const { user, token } = response.data

          // Clear any persisted data for new user
          // Import at runtime to avoid circular dependencies
          const { useCalorieStore } = await import('./calorieStore')
          const { useFoodStore } = await import('./foodStore')
          useCalorieStore.getState().clearCalculatorData()
          useFoodStore.getState().resetStore()

          // Set auth state
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitializing: false
          })

          // Set token in api headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          toast.success('Registration successful!')
          return { success: true }

        } catch (error) {
          set({ isLoading: false, isInitializing: false })
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      logout: () => {
        // Clear auth state (but keep calculator data for when user logs back in)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false
        })

        // Remove token from api headers
        delete api.defaults.headers.common['Authorization']

        toast.success('Logged out successfully')
      },

      checkAuth: async () => {
        const { token, user: currentUser } = get()
        
        if (!token) {
          set({ isLoading: false, isAuthenticated: false, isInitializing: false })
          return
        }

        // Always set token in headers first, even before verification
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        set({ isLoading: true })
        try {
          const response = await api.post('/auth/verify', { token })
          const { user } = response.data

          // If this is a different user than what's persisted, clear data
          if (currentUser && currentUser.id !== user.id) {
            const { useCalorieStore } = await import('./calorieStore')
            const { useFoodStore } = await import('./foodStore')
            useCalorieStore.getState().clearCalculatorData()
            useFoodStore.getState().resetStore()
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitializing: false
          })

        } catch (error) {
          console.error('Auth check failed:', error)
          
          // Only clear auth state for authentication errors, not network/server errors
          const isAuthError = error.response?.status === 401 || 
                              error.response?.status === 403 ||
                              error.response?.data?.message?.includes('token') ||
                              error.response?.data?.message?.includes('Invalid') ||
                              error.response?.data?.message?.includes('expired')
          
          if (isAuthError) {
            // Clear invalid auth state only for auth-related errors
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isInitializing: false
            })
            
            delete api.defaults.headers.common['Authorization']
            toast.error('Session expired. Please log in again.')
          } else {
            // For server errors (500) or network issues, don't clear auth state
            // Just update loading states but keep user authenticated
            set({
              isLoading: false,
              isInitializing: false
            })
            
            // Show a non-intrusive warning instead of logging out
            console.warn('Auth verification failed due to server error. Keeping user logged in.')
          }
        }
      },

      // Initialize auth on app start
      initializeAuth: () => {
        const { token, isAuthenticated } = get()
        if (token && isAuthenticated) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },

      // Check if user is ready for API calls
      isReady: () => {
        const { token, isAuthenticated, user } = get()
        const ready = token && isAuthenticated && user && user.id
        console.log('🔐 Auth isReady check:', { ready, token: !!token, isAuthenticated, userId: user?.id })
        return ready
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },

      // Get user profile data
      fetchProfile: async () => {
        try {
          const response = await api.get('/user/profile')
          const { user } = response.data

          set((state) => ({
            user: { ...state.user, ...user }
          }))

          return { success: true, data: user }

        } catch (error) {
          console.error('Failed to fetch profile:', error)
          const message = error.response?.data?.message || 'Failed to fetch profile'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        try {
          const response = await api.put('/user/profile', profileData)
          const { user } = response.data

          set((state) => ({
            user: { ...state.user, ...user }
          }))

          toast.success('Profile updated successfully!')
          return { success: true, data: user }

        } catch (error) {
          console.error('Failed to update profile:', error)
          const message = error.response?.data?.message || 'Failed to update profile'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Update nutrition goals
      updateGoals: async (goalsData) => {
        try {
          const response = await api.put('/user/goals', goalsData)
          const { user } = response.data

          set((state) => ({
            user: { ...state.user, ...user }
          }))

          toast.success('Goals updated successfully!')
          return { success: true, data: user }

        } catch (error) {
          console.error('Failed to update goals:', error)
          const message = error.response?.data?.message || 'Failed to update goals'
          toast.error(message)
          return { success: false, message }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)