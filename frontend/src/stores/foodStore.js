import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useFoodStore = create((set, get) => ({
  // Search state
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchError: null,

  // Food entries state
  currentTrackingDate: new Date().toISOString().split('T')[0],
  todayEntries: [],
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    entries: 0
  },
  isLoadingEntries: false,

  // Weekly totals state
  weeklyTotals: [],
  isLoadingWeekly: false,

  // Popular foods
  popularFoods: [],
  isLoadingPopular: false,

  // Modal state
  isAddFoodModalOpen: false,
  selectedFood: null,
  selectedMealType: 'breakfast',

  // Search functions
  setSearchQuery: (query) => set({ searchQuery: query }),

  searchFoods: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchError: null })
      return
    }

    set({ isSearching: true, searchError: null })
    
    try {
      const response = await api.get(`/food/search?q=${encodeURIComponent(query.trim())}&limit=20`)
      const { foods } = response.data.data

      set({
        searchResults: foods,
        isSearching: false
      })

    } catch (error) {
      console.error('Food search failed:', error)
      set({
        searchError: error.response?.data?.message || 'Search failed',
        searchResults: [],
        isSearching: false
      })
    }
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      searchError: null,
      isSearching: false
    })
  },

  // Weekly totals functions
  fetchWeeklyTotals: async () => {
    console.log('🚀 fetchWeeklyTotals called')
    set({ isLoadingWeekly: true })
    
    try {
      // Get current week (Monday to Sunday)
      const today = new Date()
      const currentWeekStart = new Date(today)
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
      
      const weeklyData = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart)
        date.setDate(currentWeekStart.getDate() + i)
        const dateString = date.toISOString().split('T')[0]
        
        try {
          console.log(`📊 Fetching entries for ${dateString}...`)
          const response = await api.get(`/food/entries?date=${dateString}&limit=100`)
          const { entries } = response.data.data
          
          // Calculate totals using the same logic as calculateDailyTotals
          const dayTotals = entries.reduce((acc, entry) => {
            if (entry.nutritionalValues) {
              acc.calories += entry.nutritionalValues.calories || 0
              acc.protein += entry.nutritionalValues.protein || 0
              acc.carbs += entry.nutritionalValues.carbs || 0
              acc.fat += entry.nutritionalValues.fat || 0
            }
            return acc
          }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
          
          weeklyData.push({
            date: dateString,
            dayName,
            calories: Math.round(dayTotals.calories),
            protein: Math.round(dayTotals.protein * 10) / 10,
            carbs: Math.round(dayTotals.carbs * 10) / 10,
            fat: Math.round(dayTotals.fat * 10) / 10,
            entries: entries.length
          })
          
        } catch (error) {
          console.error(`📊 Failed to fetch data for ${dateString}:`, error)
          // Add empty day data
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
          weeklyData.push({
            date: dateString,
            dayName,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            entries: 0
          })
        }
      }
      
      console.log('📊 Final weekly data:', weeklyData)
      
      set({
        weeklyTotals: weeklyData,
        isLoadingWeekly: false
      })

    } catch (error) {
      console.error('📊 Failed to fetch weekly totals:', error)
      set({ isLoadingWeekly: false })
    }
  },

  // Popular foods functions
  fetchPopularFoods: async () => {
    console.log('🚀 fetchPopularFoods called')
    set({ isLoadingPopular: true })
    try {
      const response = await api.get('/food/popular?limit=15')
      const { foods } = response.data.data

      set({
        popularFoods: foods,
        isLoadingPopular: false
      })

    } catch (error) {
      console.error('Failed to fetch popular foods:', error)
      set({ isLoadingPopular: false })
      
      // Temporarily disable all error toasts for debugging
      // if (error.response?.status !== 401) {
      //   toast.error('Failed to load popular foods')
      // }
    }
  },

  // Food entry functions
  addFoodEntry: async (foodId, quantity, mealType, date = null) => {
    try {
      const { currentTrackingDate } = get()
      const entryDate = date || currentTrackingDate
      console.log('🍽️ Adding food entry:', { foodId, quantity, mealType, date: entryDate, currentTrackingDate })
      const response = await api.post('/food/entries', {
        foodId,
        quantity: parseFloat(quantity),
        mealType,
        date: entryDate
      })

      console.log('✅ Food entry API response:', response.data)
      const { entry } = response.data.data

      // Add to current tracking date entries if it matches
      const currentState = get()
      const entryDateString = entry.date.split('T')[0] // Get YYYY-MM-DD format
      
      console.log('📅 Current tracking date:', currentState.currentTrackingDate, 'Entry date:', entryDateString)
      
      if (entryDateString === currentState.currentTrackingDate) {
        console.log('✅ Adding to current tracking date entries')
        set((state) => ({
          todayEntries: [entry, ...state.todayEntries]
        }))
        
        // Recalculate daily totals
        get().calculateDailyTotals()
      } else {
        console.log('⚠️ Entry date doesn\'t match tracking date, not adding to state')
      }

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Food added successfully!')
      return { success: true, data: entry }

    } catch (error) {
      console.error('❌ Failed to add food entry:', error)
      const message = error.response?.data?.message || 'Failed to add food'
      toast.error(message)
      return { success: false, message }
    }
  },

  updateFoodEntry: async (entryId, updateData) => {
    try {
      const response = await api.put(`/food/entries/${entryId}`, updateData)
      const { entry } = response.data.data

      // Update in today's entries
      set((state) => ({
        todayEntries: state.todayEntries.map(e => 
          e.id === entryId ? entry : e
        )
      }))

      // Recalculate daily totals
      get().calculateDailyTotals()

      toast.success('Food entry updated!')
      return { success: true, data: entry }

    } catch (error) {
      console.error('Failed to update food entry:', error)
      const message = error.response?.data?.message || 'Failed to update food entry'
      toast.error(message)
      return { success: false, message }
    }
  },

  deleteFoodEntry: async (entryId) => {
    try {
      await api.delete(`/food/entries/${entryId}`)

      // Remove from today's entries
      set((state) => ({
        todayEntries: state.todayEntries.filter(e => e.id !== entryId)
      }))

      // Recalculate daily totals
      get().calculateDailyTotals()

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Food entry deleted!')
      return { success: true }

    } catch (error) {
      console.error('Failed to delete food entry:', error)
      const message = error.response?.data?.message || 'Failed to delete food entry'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Fetch today's food entries
  fetchTodayEntries: async () => {
    console.log('🚀 fetchTodayEntries called')
    set({ isLoadingEntries: true })
    try {
      const { currentTrackingDate } = get()
      console.log('🔍 Fetching entries for date:', currentTrackingDate)
      const response = await api.get(`/food/entries?date=${currentTrackingDate}&limit=100`)
      console.log('🔍 API response:', response.data)
      const { entries } = response.data.data
      console.log('🔍 Entries received:', entries)

      set({
        todayEntries: entries,
        isLoadingEntries: false
      })

      // Calculate daily totals
      get().calculateDailyTotals()

    } catch (error) {
      console.error('❌ Failed to fetch today\'s entries:', error)
      console.error('❌ Error details:', error.response?.data)
      set({ isLoadingEntries: false })
      
      // Show error for debugging
      if (error.response?.status !== 401) {
        toast.error('Failed to load food entries: ' + (error.response?.data?.message || error.message))
      }
    }
  },

  // Calculate daily totals from today's entries
  calculateDailyTotals: () => {
    const { todayEntries } = get()
    
    const totals = todayEntries.reduce((acc, entry) => {
      if (entry.nutritionalValues) {
        acc.calories += entry.nutritionalValues.calories || 0
        acc.protein += entry.nutritionalValues.protein || 0
        acc.carbs += entry.nutritionalValues.carbs || 0
        acc.fat += entry.nutritionalValues.fat || 0
        acc.entries += 1
      }
      return acc
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      entries: 0
    })

    // Round values
    totals.calories = Math.round(totals.calories)
    totals.protein = Math.round(totals.protein * 10) / 10
    totals.carbs = Math.round(totals.carbs * 10) / 10
    totals.fat = Math.round(totals.fat * 10) / 10

    set({ dailyTotals: totals })
  },

  // Get entries by meal type
  getEntriesByMealType: (mealType) => {
    const { todayEntries } = get()
    return todayEntries.filter(entry => entry.mealType === mealType)
  },

  // Get totals by meal type
  getTotalsByMealType: (mealType) => {
    const entries = get().getEntriesByMealType(mealType)
    
    return entries.reduce((acc, entry) => {
      if (entry.nutritionalValues) {
        acc.calories += entry.nutritionalValues.calories || 0
        acc.protein += entry.nutritionalValues.protein || 0
        acc.carbs += entry.nutritionalValues.carbs || 0
        acc.fat += entry.nutritionalValues.fat || 0
      }
      return acc
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    })
  },

  // Modal functions
  openAddFoodModal: (food, mealType = 'breakfast') => {
    set({
      isAddFoodModalOpen: true,
      selectedFood: food,
      selectedMealType: mealType
    })
  },

  closeAddFoodModal: () => {
    set({
      isAddFoodModalOpen: false,
      selectedFood: null,
      selectedMealType: 'breakfast'
    })
  },

  setSelectedMealType: (mealType) => set({ selectedMealType: mealType }),

  // Date management functions
  setTrackingDate: (date) => {
    set({ currentTrackingDate: date })
    // Fetch entries for the new date
    get().fetchTodayEntries()
  },

  checkAndUpdateDate: () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const { currentTrackingDate } = get()
    
    if (currentDate !== currentTrackingDate) {
      console.log('🗓️ Date changed from', currentTrackingDate, 'to', currentDate)
      set({ 
        currentTrackingDate: currentDate,
        todayEntries: [],
        dailyTotals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          entries: 0
        }
      })
      // Fetch entries for the new date
      get().fetchTodayEntries()
    }
  },

  getCurrentTrackingDateLabel: () => {
    const { currentTrackingDate } = get()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    
    if (currentTrackingDate === today) {
      return 'Today'
    } else if (currentTrackingDate === yesterday) {
      return 'Yesterday'
    } else if (currentTrackingDate === tomorrow) {
      return 'Tomorrow'
    } else {
      return new Date(currentTrackingDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  },

  // Utility functions
  getMealTypeLabel: (mealType) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    }
    return labels[mealType] || mealType
  },

  // Reset store
  resetStore: () => {
    set({
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      searchError: null,
      todayEntries: [],
      dailyTotals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        entries: 0
      },
      isLoadingEntries: false,
      weeklyTotals: [],
      isLoadingWeekly: false,
      popularFoods: [],
      isLoadingPopular: false,
      isAddFoodModalOpen: false,
      selectedFood: null,
      selectedMealType: 'breakfast'
    })
  }
}))