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
  currentTrackingDate: (() => {
    const today = new Date()
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0')
  })(),
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

  // Monthly totals state
  monthlyTotals: [],
  isLoadingMonthly: false,

  // Popular foods
  popularFoods: [],
  isLoadingPopular: false,

  // Modal state
  isAddFoodModalOpen: false,
  selectedFood: null,
  selectedMealType: 'breakfast',

  // Custom foods storage (persisted in localStorage)
  customFoodEntries: [],

  // Custom food persistence functions
  loadCustomFoodEntries: () => {
    try {
      const stored = localStorage.getItem('desi-tracker-custom-foods')
      if (stored) {
        const customEntries = JSON.parse(stored)
        set({ customFoodEntries: customEntries })
        return customEntries
      }
    } catch (error) {
      console.error('Failed to load custom food entries:', error)
    }
    return []
  },

  saveCustomFoodEntry: (entry) => {
    try {
      const currentState = get()
      const updatedEntries = [...currentState.customFoodEntries, entry]
      set({ customFoodEntries: updatedEntries })
      localStorage.setItem('desi-tracker-custom-foods', JSON.stringify(updatedEntries))
    } catch (error) {
      console.error('Failed to save custom food entry:', error)
    }
  },

  removeCustomFoodEntry: (entryId) => {
    try {
      const currentState = get()
      const updatedEntries = currentState.customFoodEntries.filter(e => e.id !== entryId)
      set({ customFoodEntries: updatedEntries })
      localStorage.setItem('desi-tracker-custom-foods', JSON.stringify(updatedEntries))
    } catch (error) {
      console.error('Failed to remove custom food entry:', error)
    }
  },

  getCustomFoodEntriesForDate: (dateString) => {
    const { customFoodEntries } = get()
    return customFoodEntries.filter(entry => {
      const entryDate = entry.date.split('T')[0] // Extract YYYY-MM-DD from ISO string
      return entryDate === dateString
    })
  },

  // Search functions
  setSearchQuery: (query) => set({ searchQuery: query }),

  searchFoods: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchError: null })
      return
    }

    set({ isSearching: true, searchError: null })
    
    try {
      const response = await api.get(`/foods?search=${encodeURIComponent(query.trim())}&limit=20`)
      const { foods } = response.data

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
      // Load custom food entries first
      get().loadCustomFoodEntries()
      // Get current week (Monday to Sunday) - use local timezone
      const today = new Date()
      const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1) // Start from Monday
      
      // Prepare all API requests in parallel
      const weekApiPromises = []
      const weekDates = []
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + i)
        const dateString = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0')
        
        weekDates.push({ date, dateString })
        weekApiPromises.push(
          api.get(`/food-entries?date=${dateString}&limit=100`)
            .then(response => ({ dateString, entries: response.data.entries, success: true }))
            .catch(error => ({ dateString, entries: [], success: false, error }))
        )
      }
      
      console.log(`📊 Making ${weekApiPromises.length} parallel API calls for weekly data...`)
      
      // Execute all API calls in parallel
      const apiResults = await Promise.all(weekApiPromises)
      
      console.log('📊 All weekly API calls completed')
      
      // Process results
      const weeklyData = []
      
      for (let i = 0; i < weekDates.length; i++) {
        const { date, dateString } = weekDates[i]
        const apiResult = apiResults[i]
        
        // Get custom food entries for this date
        const customEntries = get().getCustomFoodEntriesForDate(dateString)
        
        if (!apiResult.success) {
          console.error(`📊 Failed to fetch data for ${dateString}:`, apiResult.error)
        }
        
        console.log(`📊 Found ${apiResult.entries.length} API entries and ${customEntries.length} custom entries for ${dateString}`)
        
        // Combine API and custom entries
        const allEntries = [...apiResult.entries, ...customEntries]
        
        // Calculate totals using the same logic as calculateDailyTotals
        const dayTotals = allEntries.reduce((acc, entry) => {
          const nutrition = entry.nutritionalValues || entry.food
          if (nutrition) {
            const quantity = entry.quantity || 1
            const servingSize = entry.food?.servingSize || 100
            const multiplier = quantity / servingSize
            
            acc.calories += (nutrition.calories || 0) * multiplier
            acc.protein += (nutrition.protein || 0) * multiplier
            acc.carbs += (nutrition.carbs || 0) * multiplier
            acc.fat += (nutrition.fat || 0) * multiplier
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
          entries: allEntries.length
        })
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

  // Get user's first tracking date by searching backwards
  getUserFirstTrackingDate: async () => {
    try {
      // Load custom food entries first
      get().loadCustomFoodEntries()
      
      // Check for the earliest custom food entry
      const { customFoodEntries } = get()
      let earliestCustomDate = null
      
      if (customFoodEntries.length > 0) {
        const customDates = customFoodEntries.map(entry => new Date(entry.date))
        earliestCustomDate = new Date(Math.min(...customDates))
      }
      
      // Search backwards from today to find the first API entry
      let earliestApiDate = null
      const today = new Date()
      
      // Search up to 60 days back to find first entry
      for (let i = 0; i < 60; i++) {
        const checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
        const dateString = checkDate.getFullYear() + '-' + 
                          String(checkDate.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(checkDate.getDate()).padStart(2, '0')
        
        try {
          const response = await api.get(`/food-entries?date=${dateString}&limit=1`)
          if (response.data.entries && response.data.entries.length > 0) {
            earliestApiDate = new Date(dateString + 'T00:00:00')
            // Continue searching to find even earlier entries
          }
        } catch (error) {
          // Continue searching even if this date fails
          continue
        }
      }
      
      // Determine the earliest date between custom and API entries
      let firstTrackingDate = null
      if (earliestCustomDate && earliestApiDate) {
        firstTrackingDate = earliestCustomDate < earliestApiDate ? earliestCustomDate : earliestApiDate
      } else if (earliestCustomDate) {
        firstTrackingDate = earliestCustomDate
      } else if (earliestApiDate) {
        firstTrackingDate = earliestApiDate
      }
      
      return firstTrackingDate
    } catch (error) {
      console.error('Failed to get first tracking date:', error)
      return null
    }
  },

  // Monthly totals functions
  fetchMonthlyTotals: async () => {
    console.log('🚀 fetchMonthlyTotals called')
    set({ isLoadingMonthly: true })
    
    try {
      // Load custom food entries first
      get().loadCustomFoodEntries()
      
      // Get past 30 days (simplified approach)
      const today = new Date()
      
      // Prepare all API requests in parallel
      const monthApiPromises = []
      const monthDates = []
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
        const dateString = date.getFullYear() + '-' + 
                          String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(date.getDate()).padStart(2, '0')
        
        monthDates.push({ date, dateString })
        monthApiPromises.push(
          api.get(`/food-entries?date=${dateString}&limit=100`)
            .then(response => ({ dateString, entries: response.data.entries, success: true }))
            .catch(error => ({ dateString, entries: [], success: false, error }))
        )
      }
      
      console.log(`📊 Making ${monthApiPromises.length} parallel API calls for monthly data...`)
      
      // Execute all API calls in parallel
      const apiResults = await Promise.all(monthApiPromises)
      
      console.log('📊 All monthly API calls completed')
      
      // Process results
      const monthlyData = []
      
      for (let i = 0; i < monthDates.length; i++) {
        const { dateString } = monthDates[i]
        const apiResult = apiResults[i]
        
        // Get custom food entries for this date
        const customEntries = get().getCustomFoodEntriesForDate(dateString)
        
        if (!apiResult.success) {
          console.error(`📊 Failed to fetch monthly data for ${dateString}:`, apiResult.error)
        }
        
        console.log(`📊 Found ${apiResult.entries.length} API entries and ${customEntries.length} custom entries for ${dateString}`)
        
        // Combine API and custom entries
        const allEntries = [...apiResult.entries, ...customEntries]
        
        // Calculate totals
        const dayTotals = allEntries.reduce((acc, entry) => {
          const nutrition = entry.nutritionalValues || entry.food
          if (nutrition) {
            const quantity = entry.quantity || 1
            const servingSize = entry.food?.servingSize || 100
            const multiplier = quantity / servingSize
            
            acc.calories += (nutrition.calories || 0) * multiplier
            acc.protein += (nutrition.protein || 0) * multiplier
            acc.carbs += (nutrition.carbs || 0) * multiplier
            acc.fat += (nutrition.fat || 0) * multiplier
          }
          return acc
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
        
        monthlyData.push({
          date: dateString,
          calories: Math.round(dayTotals.calories),
          protein: Math.round(dayTotals.protein * 10) / 10,
          carbs: Math.round(dayTotals.carbs * 10) / 10,
          fat: Math.round(dayTotals.fat * 10) / 10,
          entries: allEntries.length
        })
      }
      
      console.log('📊 Final monthly data:', monthlyData)
      
      
      set({
        monthlyTotals: monthlyData,
        isLoadingMonthly: false
      })
    } catch (error) {
      console.error('📊 Failed to fetch monthly totals:', error)
      set({ isLoadingMonthly: false })
    }
  },

  // Popular foods functions
  fetchPopularFoods: async () => {
    console.log('🚀 fetchPopularFoods called')
    set({ isLoadingPopular: true })
    try {
      const response = await api.get('/foods/popular?limit=15')
      const { foods } = response.data

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
      const { currentTrackingDate, todayEntries } = get()
      const entryDate = date || currentTrackingDate
      console.log('🍽️ Adding food entry:', { foodId, quantity, mealType, date: entryDate, currentTrackingDate })
      console.log('🍽️ Current todayEntries before adding:', todayEntries)
      console.log('🍽️ Auth headers:', api.defaults.headers.common['Authorization'])
      
      const requestData = {
        foodId,
        quantity: parseFloat(quantity),
        meal: mealType.toUpperCase(), // Backend expects 'meal' field in uppercase
        date: entryDate
      }
      console.log('🍽️ Request data being sent to API:', requestData)
      
      const response = await api.post('/food-entries', requestData)

      console.log('✅ Food entry API response:', response.data)
      const { entry } = response.data

      // Add to current tracking date entries if it matches
      const currentState = get()
      const entryDateString = entry.date.split('T')[0] // Get YYYY-MM-DD format
      
      console.log('📅 Current tracking date:', currentState.currentTrackingDate, 'Entry date:', entryDateString)
      console.log('📅 Date comparison result:', entryDateString === currentState.currentTrackingDate)
      console.log('📅 Entry object:', entry)
      
      if (entryDateString === currentState.currentTrackingDate) {
        console.log('✅ Adding to current tracking date entries')
        set((state) => ({
          todayEntries: [entry, ...state.todayEntries]
        }))
        
        // Recalculate daily totals
        get().calculateDailyTotals()
        
        // Log the updated state
        const updatedState = get()
        console.log('✅ Updated todayEntries after adding:', updatedState.todayEntries)
        console.log('✅ Updated dailyTotals after adding:', updatedState.dailyTotals)
      } else {
        console.log('⚠️ Entry date doesn\'t match tracking date, not adding to state')
        console.log('⚠️ Refreshing today\'s entries from API instead')
        // If dates don't match, refresh today's entries from API
        get().fetchTodayEntries()
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
      const response = await api.put(`/food-entries/${entryId}`, updateData)
      const { entry } = response.data

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
      // Store the entry to restore if deletion fails
      const currentState = get()
      const entryToDelete = currentState.todayEntries.find(e => e.id === entryId)
      
      if (!entryToDelete) {
        toast.error('Entry not found')
        return { success: false, message: 'Entry not found' }
      }

      // OPTIMISTIC UPDATE: Remove from UI immediately
      set((state) => ({
        todayEntries: state.todayEntries.filter(e => e.id !== entryId)
      }))

      // Recalculate daily totals immediately
      get().calculateDailyTotals()

      // Show success message immediately
      toast.success('Food entry deleted!')

      // Check if this is a custom food entry
      const isCustomEntry = entryId.startsWith('custom_')
      
      // Perform API call in background (for non-custom entries)
      if (!isCustomEntry) {
        try {
          await api.delete(`/food-entries?entryId=${entryId}`)
        } catch (apiError) {
          // If API call fails, restore the entry
          console.error('Failed to delete food entry from server:', apiError)
          
          // Restore the entry in UI
          set((state) => ({
            todayEntries: [...state.todayEntries, entryToDelete].sort((a, b) => 
              new Date(a.createdAt) - new Date(b.createdAt)
            )
          }))
          
          // Recalculate totals with restored entry
          get().calculateDailyTotals()
          
          toast.error('Failed to delete entry - restored')
          return { success: false, message: 'API deletion failed' }
        }
      } else {
        // Remove from localStorage for custom entries
        get().removeCustomFoodEntry(entryId)
      }

      // Refresh weekly totals to update the chart (in background)
      get().fetchWeeklyTotals()

      return { success: true }

    } catch (error) {
      console.error('Failed to delete food entry:', error)
      toast.error('Failed to delete food entry')
      return { success: false, message: error.message }
    }
  },

  // Add custom food entry (no backend storage)
  addCustomFoodEntry: async (customFood, quantity, mealType, date = null) => {
    try {
      const currentState = get()
      
      // Generate a temporary ID for the custom food entry
      const tempId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      // Use current tracking date if no date provided
      const entryDate = date || currentState.currentTrackingDate
      
      // Calculate nutritional values (only calories for custom foods)
      const totalCalories = customFood.calories * quantity
      
      // Create the custom food entry object
      const customFoodEntry = {
        id: tempId,
        date: entryDate + 'T00:00:00.000Z', // Format as ISO string
        mealType: mealType.toLowerCase(),
        quantity: quantity,
        unit: 'serving',
        nutritionalValues: {
          calories: totalCalories,
          protein: 0, // Custom foods don't track macros
          carbs: 0,
          fat: 0
        },
        food: {
          ...customFood,
          id: tempId,
          servingUnit: 'serving',
          servingSize: 1
        },
        userId: 'custom', // Mark as custom entry
        foodId: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('📝 Adding custom food entry:', customFoodEntry)

      // Save to localStorage
      get().saveCustomFoodEntry(customFoodEntry)

      // Add to today's entries if it matches current tracking date
      const entryDateString = entryDate
      if (entryDateString === currentState.currentTrackingDate) {
        console.log('✅ Adding custom food to current tracking date entries')
        set((state) => ({
          todayEntries: [customFoodEntry, ...state.todayEntries]
        }))
        
        // Recalculate daily totals
        get().calculateDailyTotals()
      }

      // Refresh weekly totals to update the chart
      get().fetchWeeklyTotals()

      toast.success('Custom food added successfully!')
      return { success: true, data: customFoodEntry }

    } catch (error) {
      console.error('❌ Failed to add custom food entry:', error)
      toast.error('Failed to add custom food')
      return { success: false, message: 'Failed to add custom food' }
    }
  },

  // Fetch today's food entries
  fetchTodayEntries: async () => {
    console.log('🚀 fetchTodayEntries called')
    set({ isLoadingEntries: true })
    try {
      const { currentTrackingDate } = get()
      console.log('🔍 Fetching entries for date:', currentTrackingDate)
      console.log('🔍 API request URL will be:', `/food-entries?date=${currentTrackingDate}&limit=100`)
      
      // Load custom food entries first
      get().loadCustomFoodEntries()
      
      const response = await api.get(`/food-entries?date=${currentTrackingDate}&limit=100`)
      console.log('🔍 API response:', response.data)
      const { entries } = response.data
      console.log('🔍 API entries received:', entries)

      // Ensure entries is an array
      const apiEntries = Array.isArray(entries) ? entries : []

      // Get custom food entries for current date
      const customEntries = get().getCustomFoodEntriesForDate(currentTrackingDate)
      console.log('🔍 Custom entries for current date:', customEntries)

      // Combine API and custom entries
      const allEntries = [...apiEntries, ...customEntries]
      console.log('🔍 Total combined entries:', allEntries)

      set({
        todayEntries: allEntries,
        isLoadingEntries: false
      })

      // Calculate daily totals
      get().calculateDailyTotals()

    } catch (error) {
      console.error('❌ Failed to fetch today\'s entries:', error)
      console.error('❌ Error details:', error.response?.data)
      
      // Even if API fails, load custom entries
      try {
        get().loadCustomFoodEntries()
        const { currentTrackingDate } = get()
        const customEntries = get().getCustomFoodEntriesForDate(currentTrackingDate)
        console.log('🔍 Loading only custom entries due to API failure:', customEntries)
        
        set({
          todayEntries: customEntries,
          isLoadingEntries: false
        })
        
        // Calculate daily totals
        get().calculateDailyTotals()
      } catch (customError) {
        console.error('❌ Failed to load custom entries:', customError)
        set({ isLoadingEntries: false })
      }
      
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
      // Handle both API entry format (entry.food) and custom entry format (entry.nutritionalValues)
      const nutrition = entry.nutritionalValues || entry.food
      if (nutrition) {
        // Calculate actual nutritional values based on quantity
        const quantity = entry.quantity || 1
        const servingSize = entry.food?.servingSize || 100
        const multiplier = quantity / servingSize
        
        acc.calories += (nutrition.calories || 0) * multiplier
        acc.protein += (nutrition.protein || 0) * multiplier
        acc.carbs += (nutrition.carbs || 0) * multiplier
        acc.fat += (nutrition.fat || 0) * multiplier
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
    return todayEntries.filter(entry => (entry.mealType || entry.meal)?.toLowerCase() === mealType.toLowerCase())
  },

  // Get totals by meal type
  getTotalsByMealType: (mealType) => {
    const entries = get().getEntriesByMealType(mealType)
    
    return entries.reduce((acc, entry) => {
      const nutrition = entry.nutritionalValues || entry.food
      if (nutrition) {
        const quantity = entry.quantity || 1
        const servingSize = entry.food?.servingSize || 100
        const multiplier = quantity / servingSize
        
        acc.calories += (nutrition.calories || 0) * multiplier
        acc.protein += (nutrition.protein || 0) * multiplier
        acc.carbs += (nutrition.carbs || 0) * multiplier
        acc.fat += (nutrition.fat || 0) * multiplier
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
    console.log('🍽️ openAddFoodModal called with:', { food: food?.name, mealType })
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
    const today = new Date()
    const currentDate = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
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
    
    const today = new Date()
    const todayString = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0')
    
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const yesterdayString = yesterday.getFullYear() + '-' + 
                           String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(yesterday.getDate()).padStart(2, '0')
    
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowString = tomorrow.getFullYear() + '-' + 
                          String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(tomorrow.getDate()).padStart(2, '0')
    
    if (currentTrackingDate === todayString) {
      return 'Today'
    } else if (currentTrackingDate === yesterdayString) {
      return 'Yesterday'
    } else if (currentTrackingDate === tomorrowString) {
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
    // Clear custom food entries from localStorage when resetting store
    try {
      localStorage.removeItem('desi-tracker-custom-foods')
    } catch (error) {
      console.error('Failed to clear custom food entries:', error)
    }

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
      selectedMealType: 'breakfast',
      customFoodEntries: [],
      // Reset tracking date to today
      currentTrackingDate: (() => {
        const today = new Date()
        return today.getFullYear() + '-' + 
               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
               String(today.getDate()).padStart(2, '0')
      })()
    })
  }
}))